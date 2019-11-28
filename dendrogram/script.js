
    const root = tree(data);
  
    const svg = d3.create("svg")
        .style("font", "10px sans-serif")
        .style("margin", "5px");
  
    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d => `
          M${d.target.y},${d.target.x}
          C${d.source.y + root.dy / 2},${d.target.x}
           ${d.source.y + root.dy / 2},${d.source.x}
           ${d.source.y},${d.source.x}
        `);
  
    const node = svg.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);
  
    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);
  
    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .text(d => d.data.name)
      .filter(d => d.children)
        .attr("text-anchor", "end")
      .clone(true).lower()
        .attr("stroke", "white");
  
    yield svg.node();

    svg.attr("viewBox", autoBox);
  

  function autoBox() {
    const {x, y, width, height} = this.getBBox();
    return [x, y, width, height];
  }

  data = FileAttachment("flare-2.json").json()

  tree = data => {
    const root = d3.hierarchy(data).sort((a, b) => d3.descending(a.height, b.height) || d3.ascending(a.data.name, b.data.name));
    root.dx = 10;
    root.dy = width / (root.height + 1);
    return d3.cluster().nodeSize([root.dx, root.dy])(root);
  }

  d3 = require("d3@5");


