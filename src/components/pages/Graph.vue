<template>
    <div class="graph">
        <svg id="svg" @contextmenu.prevent="showContext"></svg>
        <div class="actions">
            <v-btn outlined @click="onUndo" :disabled="disableUndoBtn" color="warning">undo</v-btn>
            <v-btn outlined @click="onCancel" color="error" :disabled="disablecancelBtn">cancel</v-btn>
            <v-btn outlined color="success" @click="onsave" :disabled="disableSaveBtn">Save</v-btn>
        </div>
        <ContextMenu ref="myMenu" @context="onAction" />
        <TestModal name="testModal" />
        <AddModal modal-name="addModal" @onAdd="onAdd" />
        <DuplicateModal modal-name="duplicateModal" @onAdd="onDuplicate" :node-name="selectedNode?.name" />
        <moveModal modal-name="moveModal" :node-name="selectedNode?.name" @onMove="move" :graph="graph?.data" />
        <LinkModal modal-name="linkModal" :node-name="selectedNode?.name" :graph="graph?.data" @onLink="onLink" />
        <UnLinkModal modal-name="unlinkModal" :selected-node="selectedNode" :graph="graph?.data"
            :parents="selectedNodeParents" @onUnLink="onUnLink" />
    </div>
</template>
  
<script>
// /* eslint-disable */
import * as d3 from 'd3'
import AddModal from '../partials/AddModal.vue';
import ContextMenu from '../partials/ContextMenu.vue';
import DuplicatedNameConfirmModal from '../partials/DuplicatedNameConfirmModal.vue'
import RemoveConfirmModal from '../partials/RemoveConfirmModal.vue'
import TestModal from '../partials/TestModal.vue';
import DuplicateModal from '../partials/DuplicateModal.vue'
import moveModal from '../partials/moveModal.vue';
import LinkModal from '../partials/LinkModal.vue'
import UnLinkModal from '../partials/UnLinkModal.vue'
import UnLinkConfirmModal from '../partials/UnLinkConfirmModal.vue';
export default {
    name: 'GraphPage',
    components: {
        ContextMenu,
        TestModal,
        AddModal,
        DuplicateModal,
        moveModal,
        LinkModal,
        UnLinkModal
    },
    data() {
        return {
            selectedNode: null,
            graph: null,
        }
    },
    computed: {
        disableUndoBtn() {
            const temp = this.$store.state.temp
            if (temp.length > 0) return false
            return true
        },
        disablecancelBtn() {
            const temp = this.$store.state.temp
            if (temp.length > 0) return false
            return true
        },
        disableSaveBtn() {
            const temp = this.$store.state.temp
            if (temp.length > 0) return false
            return true
        },
        selectedNodeParents() {
            const allParents = []
            if (this.selectedNode?.id) {
                const parent = this.reverseParentFinder(this.graph.data, this.selectedNode.id)

                if (parent)
                    allParents.push(parent)
                const selectedNodeId = this.selectedNode.id
                this.graph.links.forEach(link => {
                    if (link.from === selectedNodeId) {
                        allParents.push(this.searchById(this.graph.data, link.to))
                    } else if (link.to === selectedNodeId) {
                        allParents.push(this.searchById(this.graph.data, link.from))
                    }
                })
            }
            return allParents
        }
    },
    methods: {
        draw() {
            // return
            const data = this.graph.data
            const links = this.graph.links
            const unlinks = this.graph.unlinks

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

            const link = svg.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)

            link
                .selectAll()
                .data(root.links())
                .join("path")
                .attr("d", d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x))
                .attr("id", d =>
                    d.source.data.name + "-" + d.target.data.name
                );

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
                .text(d => d.data.name)
                .clone(true).lower()
                .attr("stroke", "white");

            d3.selectAll("circle").on("contextmenu", (event) => {
                this.selectedNode = event.srcElement.__data__.data
            });

            const connectNodes = (t, f) => {
                let to = null,
                    fr = null;
                node.each(d => {
                    if (d.data.id === t) to = d;
                    if (d.data.id === f) fr = d;
                });
                if (to && fr) {
                    link.append("path")
                        .attr("d", "M" + to.y + "," + to.x + "L" + fr.y + "," + fr.x)
                        .attr("id", to.data.id + "-" + fr.data.id)
                        .attr("fill", "none")
                        .attr("stroke", "red");
                }
            };
            links.forEach(item => {
                connectNodes(item.to, item.from);
            })

            const removeConnection = (t, f) => {
                d3.select("#" + t + "-" + f).remove();
                d3.select("#" + f + "-" + t).remove();
            }
            unlinks.forEach(item => {
                const to = this.searchById(this.graph.data, item.to)
                const from = this.searchById(this.graph.data, item.from)
                removeConnection(from.name, to.name);
            })

        },
        onAction(action) {
            if (action == 'add') {
                this.$modal.show('addModal');
            } else if (action == 'remove') {
                this.$modal.show(RemoveConfirmModal, null, { height: 150, width: 300 }, { 'before-close': this.onRemove });
            } else if (action == 'duplicate') {
                this.$modal.show('duplicateModal');
            } else if (action == 'move') {
                this.$modal.show('moveModal');
            } else if (action == 'link') {
                this.$modal.show('linkModal');
            } else if (action == 'unlink') {
                if (this.selectedNodeParents.length < 2) {
                    return this.$modal.show(UnLinkConfirmModal, null, { height: 175, width: 300 });
                }
                this.$modal.show('unlinkModal');
            }
        },
        onAdd(name) {
            const nameIsDuplicated = this.reverseSearch(this.graph.data, name)
            if (nameIsDuplicated) {
                return this.$modal.show(DuplicatedNameConfirmModal, null, { height: 175, width: 300 },
                    {
                        'before-close': (event) => {
                            const confirmed = event.params
                            if (confirmed) {
                                this.add(name)
                                this.$modal.hide('addModal')
                            }
                        }
                    }
                );
            } else {
                this.add(name)
            }
            this.$modal.hide('addModal');
        },
        add(name) {
            if (name) {
                try {
                    const previousData = structuredClone(this.graph)
                    const parent = this.reverseSearch(this.graph.data, this.selectedNode.name)
                    if (parent.children) {
                        parent.children.push({ name, id: "", children: [] })
                    } else {
                        parent.children = []
                        parent.children.push({ name, id: "", children: [] })
                    }
                    this.reverseSetId(this.graph.data)
                    this.refresh()
                    this.sthHasChanged(previousData)

                } catch (error) {
                    console.log(error)
                    alert('somthing went wrong')
                }

            }
        },
        onRemove(event) {
            const confirmed = event.params
            if (confirmed) {
                this.remove(this.selectedNode.id)
            }
        },
        remove(id) {
            if (id) {
                try {
                    const previousData = structuredClone(this.graph)
                    const parent = this.reverseParentFinder(this.graph.data, this.selectedNode.id)
                    if (parent) {
                        parent.children = parent.children.filter(item => item.id !== id)
                    }
                    this.reverseSetId(this.graph.data)
                    this.refresh()
                    this.sthHasChanged(previousData)
                } catch (error) {
                    console.log(error)
                    alert('Error moving node')
                }
            }
        },
        onDuplicate(name) {
            const nameIsDuplicated = this.reverseSearch(this.graph.data, name)
            if (nameIsDuplicated) {
                return this.$modal.show(DuplicatedNameConfirmModal, null, { height: 175, width: 300 },
                    {
                        'before-close': (event) => {
                            const confirmed = event.params
                            if (confirmed) {
                                this.duplicate(name)
                                this.$modal.hide('duplicateModal')
                            }
                        }
                    }
                );
            } else {
                this.duplicate(name)
            }
            this.$modal.hide('duplicateModal');
        },
        duplicate(name) {
            if (name) {
                try {
                    const previousData = structuredClone(this.graph)
                    const cloned = structuredClone(this.selectedNode) // create deep clone on selected node
                    const nodeParent = this.reverseParentFinder(this.graph.data, this.selectedNode.id)
                    cloned.name = name
                    nodeParent.children.push(cloned)
                    this.reverseSetId(this.graph.data)
                    this.refresh()
                    this.sthHasChanged(previousData)
                } catch (error) {
                    console.log('error', error)
                    alert('something went wrong')
                }
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
        searchById(object, id) {
            if (object.id == id) {
                return object
            } else {
                if (object.children) {
                    for (let i = 0; i < object.children.length; i++) {
                        const child = object.children[i]
                        const found = this.searchById(child, id)
                        if (found) return found
                    }
                }
            }
        },
        reverseParentFinder(obj, id) {
            if (obj.children) {
                const found = obj.children.find(item => item.id == id)
                if (found) {
                    return obj
                }
                for (let i = 0; i < obj.children.length; i++) {
                    const child = obj.children[i]
                    const f = this.reverseParentFinder(child, id)
                    if (f) {
                        return f
                    }
                }
            }

        },
        refresh() {
            document.getElementById("svg").innerHTML = ""
            this.selectedNode = null
            this.draw()
        },
        showContext(e) {
            // if(!this.selectedNode?.id) return
            this.$refs.myMenu.show(e)
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
        move(target_node_id) {
            try {
                const previousData = structuredClone(this.graph)
                const target_node = this.searchById(this.graph.data, target_node_id)
                const selected = structuredClone(this.selectedNode)
                this.remove(selected.id)
                if (!('children' in target_node)) {
                    target_node.children = []
                }
                target_node.children.push(selected)
                this.reverseSetId(this.graph.data)
                this.refresh()
                this.sthHasChanged(previousData)
                this.$modal.hide('moveModal')
            } catch (error) {
                console.log(error)
                alert('Something went wrong')
            }
        },
        sthHasChanged(prevoiusData) {
            this.$store.commit('addTempt', prevoiusData)
            this.change = true
        },
        onUndo() {
            if (this.$store.state.temp.length > 0) {
                this.graph = this.clone(this.$store.getters.lastTemp)
            } else {
                this.graph = this.clone(this.$store.getters.lastSaved)
            }
            console.log(4)
            this.$store.commit('removeLastTemp')
            this.refresh()
        },
        onsave() {
            this.$store.commit('save', this.clone(this.graph))
            this.$store.commit('clearTemp')
            this.refresh()
        },
        onCancel() {
            const lastSaved = this.$store.getters.lastSaved
            this.graph = this.clone(lastSaved)
            this.$store.commit('clearTemp')
            this.refresh()
        },
        clone(obj) {
            return structuredClone(obj)
        },
        onLink(node_id) {
            const previousData = structuredClone(this.graph)
            const link = {
                from: this.selectedNode.id, to: node_id
            }
            this.graph.links.push(link)
            this.reverseSetId(this.graph.data)
            this.refresh()
            this.sthHasChanged(previousData)
            this.$modal.hide('linkModal');
        },
        onUnLink(node_id) {
            const previousData = structuredClone(this.graph)

            const selectedNodeId = this.selectedNode.id
            const foundedLink = this.graph.links.find(item => {
                if ((item.to == node_id && item.from == selectedNodeId) ||
                    (item.from == node_id && item.to == selectedNodeId)) {
                    return true
                }
            })

            if (foundedLink) {
                const filtered = this.graph.links.filter(item => {
                    if ((item.to !== node_id || item.from !== selectedNodeId) &&
                        (item.from !== node_id || item.to !== selectedNodeId)) {
                        return true
                    }
                })
                this.graph.links = filtered
            } else {
                console.log('unlink')
                this.graph.unlinks.push({ to: selectedNodeId, from: node_id })
            }

            this.reverseSetId(this.graph.data)
            this.refresh()
            this.sthHasChanged(previousData)
            this.$modal.hide('unlinkModal');
        }
    },
    mounted() {
        const lastSaved = this.$store.getters.lastSaved
        this.graph = this.clone(lastSaved)
        this.reverseSetId(this.graph.data)
        this.draw()
    }
}
</script>
  
<style scoped>
.graph {
    padding: 20px;
}

.graph .actions {
    text-align: right;
    margin-top: 20px;
}

.graph .actions .v-btn {
    margin: 0 5px;
}
</style>
  