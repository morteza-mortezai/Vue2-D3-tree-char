<template>
    <div>{{ selectedNode }}
        <svg id="svg" @contextmenu.prevent="showContext"></svg>
        <ContextMenu ref="myMenu" @context="onContext" />
    </div>
</template>
  
<script>
/* eslint-disable */
import * as d3 from 'd3'
import AddModal from './AddModal.vue';
import ContextMenu from './ContextMenu.vue';
export default {
    name: 'Graph',
    components: {
        ContextMenu
    },
    data() {
        return {
            selectedNode: null,
            graph: {
                "name": "tree",
                "children": [
                    {
                        "name": "A",
                        "children": [
                            {
                                "name": "B",
                                "children": [
                                    { "name": "C", "size": 3938 },
                                ]
                            },
                            {
                                "name": "H",
                                "children": [
                                    { "name": "D", "size": 3534 },
                                    { "name": "E", "size": 5731 },
                                    { "name": "F", "size": 7840 },
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
            var menu = [
                {
                    title: 'Item #1',
                    action: function (d) {
                        console.log('Item #1 clicked!');
                        console.log('The data for this circle is: ' + d);
                    },
                    disabled: false // optional, defaults to false
                },
                {
                    title: 'Item #2',
                    action: function (d) {
                        console.log('You have clicked the second item!');
                        console.log('The data for this circle is: ' + d);
                    }
                }
            ]

            var data1 = [1, 2, 3];
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

            const link = svg.append("g")
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
                .text(d => d.data.name)
                .clone(true).lower()
                .attr("stroke", "white");

            d3.selectAll("circle").on("contextmenu", (event) => {
                this.selectedNode = event.srcElement.__data__.data
            })
            return svg.node();
        },
        onContext(action) {
            if (action == 'add') {
                this.$modal.show(AddModal, null, { height: 150, width: 300 }, { 'before-close': this.create });
            }
        },
        create(event) {
            const name = event.params
            // return
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
        refresh() {
            document.getElementById("svg").innerHTML = ""
            this.draw()
        },
        showContext(e){
            this.$refs.myMenu.show(e)
            
        }
    },
    mounted() {
        this.draw()
    }
}
</script>
  
<style>

</style>
  