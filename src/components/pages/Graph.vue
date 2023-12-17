<template>
    <div>
        <svg id="svg" @contextmenu.prevent="showContext"></svg>
        <ContextMenu ref="myMenu" @context="onAction" />
        <!-- {{ graph }} -->
        <button @click="test">test</button>
        <button @click="$modal.show('testModal')">show</button>
        <button @click="$modal.hide('testModal')">hide</button>
        <TestModal name="testModal" />
    </div>
</template>
  
<script>
// /* eslint-disable */
// modals must be updated
// reversefind must be work with id
import * as d3 from 'd3'
import AddModal from '../partials/AddModal.vue';
import ContextMenu from '../partials/ContextMenu.vue';
import DuplicatedConfirmModal from '../partials/DuplicatedConfirmModal.vue'
import RemoveConfirmModal from '../partials/RemoveConfirmModal.vue'
import TestModal from '../partials/TestModal.vue';
export default {
    name: 'GraphPage',
    components: {
        ContextMenu,
        TestModal
    },
    data() {
        return {
            selectedNode: null,
            graph: {
                "name": "tree",
                "id": 1,
                "children": [
                    {
                        "name": "A",
                        "id": "",
                        "children": [
                            {
                                "name": "B",
                                "children": [
                                    { "name": "C", "id": 3938 },
                                    { "name": "D", "id": 3534 },
                                ]
                            },
                            {
                                "name": "H",
                                "children": [
                                    { "name": "D", "id": 3534 },
                                    { "name": "E", "id": 5731 },
                                    { "name": "F", "id": 7840 },
                                ]
                            },
                        ]
                    }
                ]
            }
        }
    },
    methods: {
        draw() {
            // return
            const data = this.graph

            const width = 928;

            // Compute the tree height; this approach will allow the height of the
            // SVG to scale according to the breadth (width) of the tree layout.
            const root = d3.hierarchy(data);
            const dx = 10;
            const dy = width / (root.height + 1);

            // Create a tree layout.
            const tree = d3.tree().nodeSize([dx, dy]);

            // Sort the tree and apply the layout.
            root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
            tree(root);

            // Compute the extent of the tree. Note that x and y are swapped here
            // because in the tree layout, x is the breadth, but when displayed, the
            // tree extends right rather than down.
            let x0 = Infinity;
            let x1 = -x0;
            root.each(d => {
                if (d.x > x1) x1 = d.x;
                if (d.x < x0) x0 = d.x;
            });

            // Compute the adjusted height of the tree.
            const height = x1 - x0 + dx * 2;

            const svg = d3.select("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-dy / 3, x0 - dx, width, height])
                .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
            // const link =
            svg.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)
                .selectAll()
                .data(root.links())
                .join("path")
                .attr("d", d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x));

            const node = svg.append("g")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .selectAll()
                .data(root.descendants())
                .join("g")
                .attr("transform", d => `translate(${d.y},${d.x})`)

            node.append("circle")
                .attr("fill", d => d.children ? "#555" : "#999")
                .attr("r", 5.5)

            node.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d.children ? -6 : 6)
                .attr("text-anchor", d => d.children ? "end" : "start")
                .text(d => d.data.name + `(${d.data.id})`)
                .clone(true).lower()
                .attr("stroke", "white");

            d3.selectAll("circle").on("contextmenu", (event) => {
                this.selectedNode = event.srcElement.__data__.data
            })
            return svg.node();
        },
        onAction(action) {
            if (action == 'add') {
                this.$modal.show(AddModal, null, { height: 150, width: 300 }, { 'before-close': this.onAdd });
            } else if (action == 'remove') {
                this.$modal.show(RemoveConfirmModal, null, { height: 150, width: 300 }, { 'before-close': this.onRemove });
            } else if (action == 'duplicate') {
                this.duplicate()
            }
        },
        onAdd(event) {
            const name = event.params
            const nameIsDuplicated = this.reverseSearch(this.graph, name)
            if (nameIsDuplicated) {
                event.cancel() // prohibit closing modal
                return this.$modal.show(DuplicatedConfirmModal, null, { height: 175, width: 300 },
                    { 'before-close': (event)=>{
                        const confirmed = event.params
                        if (confirmed) {
                            this.add(name)
                            this.$modal.hide(DuplicatedConfirmModal)
                        } 
                    } }
                );
            }
            this.add(name)
        },
        add(name) {
            if (name) {
                const found = this.reverseSearch(this.graph, this.selectedNode.name)
                if (found.children) {
                    found.children.push({ name, children: [] })
                } else {
                    found.children = []
                    found.children.push({ name, children: [] })
                }
                this.refresh()
            }
        },
        onRemove(event) {
            const confirmed = event.params
            if (confirmed) {
                this.remove(this.selectedNode.name)
            }
        },
        remove(name) {
            if (name) {
                const parent = this.reverseParentFinder(this.graph, this.selectedNode.name)
                if (parent) {
                    parent.children = parent.children.filter(item => item.name !== name)
                }
                this.refresh()
            }
        },
        reverseSearch(object, name) {
            if (object.name == name) {
                return object
            } else {
                if (object.children) {
                    for (let i = 0; i < object.children.length; i++) {
                        const child = object.children[i]
                        const found = this.reverseSearch(child, name)
                        if (found) return found
                    }
                }
            }
        },
        reverseParentFinder(obj, name) {
            if (obj.children) {
                const found = obj.children.find(item => item.name == name)
                if (found) {
                    return obj
                }
                for (let i = 0; i < obj.children.length; i++) {
                    const child = obj.children[i]
                    const f = this.reverseParentFinder(child, name)
                    if (f) {
                        return f
                    }
                }
            }

        },
        refresh() {
            document.getElementById("svg").innerHTML = ""
            this.draw()
        },
        showContext(e) {
            this.$refs.myMenu.show(e)

        },
        duplicate() {
            const name = this.selectedNode.name
            if (name) {
                try {
                    // const node=this.reverseSearch(name)
                    const node = this.selectedNode
                    const nodeParent = this.reverseParentFinder(this.graph, name)
                    const clone = structuredClone(node)
                    nodeParent.children.push(clone)
                    this.refresh()
                } catch (error) {
                    alert('something went wrong')
                }
            }

        },
        reverseSetId(obj, parentId, index) {
            if (parentId) {
                obj.id = `${parentId}-${index + 1}`
            } else {
                obj.id = `1`
            }
            if (obj.children) {
                obj.children.forEach((child, index) => {
                    this.reverseSetId(child, obj.id, index)
                })
            }
        },
        test() {
            const t = this.reverseParentFinder(this.graph, 'F')
            console.log('test', t)
        }
    },
    mounted() {
        this.reverseSetId(this.graph)
        this.draw()
    }
}
</script>
  
<style></style>
  