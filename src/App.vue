<template>
  <div id="app">
    <vue-context ref="menu">
      <li>
        <a @click.prevent="onContext($event.target.innerText)">Add</a>
      </li>
      <li>
        <a @click.prevent="onContext($event.target.innerText)">Remove</a>
      </li>
    </vue-context>

    <svg id="svg" @contextmenu.prevent="$refs.menu.open"></svg>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
// import aaplJason from '../src/aapl.json'
import AddModal from './components/AddModal.vue';
import VueContext from 'vue-context';
// import {createContextMenu} from './contextMenu'
// import contextMenu from 'd3-context-menu'
export default {
  name: 'App',
  components: {
    VueContext,
  },
  data() {
    return {
      selectedNode: null,
      graph: {
        "name": "flare",
        "children": [
          {
            "name": "analytics",
            "children": [
              {
                "name": "cluster",
                "children": [
                  { "name": "AgglomerativeCluster", "size": 3938 },
                ]
              },
              {
                "name": "graph",
                "children": [
                  { "name": "BetweennessCentrality", "size": 3534 },
                  { "name": "LinkDistance", "size": 5731 },
                  { "name": "MaxFlowMinCut", "size": 7840 },
                  { "name": "ShortestPaths", "size": 5914 },
                  { "name": "SpanningTree", "size": 3416 }
                ]
              },
              {
                "name": "optimization",
                "children": [{ "name": "AspectRatioBanker", "size": 7074 }]
              }
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
      //   .on('contextmenu', (data,index) => {
      //     var position = d3.mouse(this);
      // d3.select('#my_custom_menu')
      //   .style('position', 'absolute')
      //   .style('left', position[0] + "px")
      //   .style('top', position[1] + "px")
      //   .style('display', 'block');

      //     // createContextMenu(d, menuItems, width, height, '#graphSvg');

      //     // console.log(d3.event)
      //     // d3.event.preventDefault();
      //     // if (d3.event.pageX || d3.event.pageY) {
      //     //   var x = d3.event.pageX;
      //     //   var y = d3.event.pageY;
      //     // } else if (d3.event.clientX || d3.event.clientY) {
      //     //   var x = d3.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      //     //   var y = d3.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      //     // }

      //     // d3.select('#action_div')
      //     //   .style('position', 'absolute')
      //     //   .style('left', x + 'px')
      //     //   .style('top', y + 'px')
      //     //   .style('display', 'block');

      //     // d3.event.preventDefault();
      //   })


      node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 5.5)
      // .on('contextmenu', d3.contextMenu(menu))

      node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke", "white");

      d3.selectAll("circle").on("contextmenu", (event) => {
        // if(!event.srcElement.__data__.data){
        //   this.$refs.menu.hide()
        // }
        // console.log(event.srcElement.__data__.data)
        this.selectedNode = event.srcElement.__data__.data

        // this.create(event.srcElement.__data__.data)
      })
      return svg.node();
    },
    onContext(option) {
      if (option == 'Add') {
        this.$modal.show(AddModal, null, {height:150,width:300}, { 'before-close': this.create });
      }
    },
    create(event) {
      const name=event.params
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
    }
  },
  mounted() {
    this.draw()
  }
}
</script>

<style>
.v-context {
  position: absolute;
  background-color: antiquewhite;
  padding: 10px 20px;
  list-style: none;
  cursor: pointer;
}
/* .v-context li{
  padding: 0 20px;
}
.v-context li:hover{
  background-color: blue;
} */
</style>
