const path = "../../../json/등록/복수전공/";
var filename = "2019_2_dualdegree.json";
var chart;
var color = {};

function getColorsByDvisions() {
    let colors = document.getElementById("colors");
    color["1"] = colors.children.color_hs.getAttribute("value");
    color["2"] = colors.children.color_ns.getAttribute("value");
    color["3"] = colors.children.color_en.getAttribute("value");
    color["4"] = colors.children.color_amp.getAttribute("value");
    color["5"] = colors.children.color_dd.getAttribute("value");
    color["6"] = "#FFFFFF";
}

function init() {
    getColorsByDvisions();
    d3_drawChart();
}

function selectSelectbox(id, value) {
    switch (id) {
        case "sel_sbs":
            filename = value.slice(0, 4) + "_" + value.slice(5, 6) + "_dualdegree.json";
            d3_drawChart()
            break;
    }
}

function d3_drawChart() {
    var margin = { top: 200, right: 80, bottom: 10, left: 200 },
        width = 720,
        height = 720;

    var x = d3.scale.ordinal().rangeBands([0, width]);

    var svg = d3.select("#chartdiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sel_ord = document.getElementById("sel_ord")
    var option = sel_ord.options[sel_ord.selectedIndex].getAttribute("value");
    console.log(option);

    d3.json(path + filename, function (majors) {
        var matrix = [],
            nodes = majors.nodes,
            n = nodes.length;

        // Compute index per node.
        nodes.some(function (node, i) {
            if(option != "all" && i > 50) return true;
            node.index = i;
            node.count = 0;
            matrix[i] = d3.range(n).map(function (j) { return { x: j, y: i, z: 0 }; });
        });

        // Convert links to matrix; count character occurrences.
        majors.links.forEach(function (link) {
            matrix[link.source][link.target].z += link.value;
            matrix[link.target][link.source].z += link.value;
            matrix[link.source][link.source].z += link.value;
            matrix[link.target][link.target].z += link.value;
            nodes[link.source].count += link.value;
            nodes[link.target].count += link.value;
        });

        // Precompute the orders.
        var orders = {
            name: d3.range(n).sort(function (a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
            count: d3.range(n).sort(function (a, b) { return nodes[b].count - nodes[a].count; }),
            group: d3.range(n).sort(function (a, b) { return nodes[a].group - nodes[b].group; })
        };

        // The default sort order.
        x.domain(orders.name);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#FFFFFF");

        var row = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function (d, i) { 
                return "translate(0," + x(i) + ")"; })
            .each(row);

        row.append("line")
            .attr("x2", width);

        row.append("text")
            .attr("x", -6)
            .attr("y", x.rangeBand() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function (d, i) { return nodes[i].name; });

        var column = svg.selectAll(".column")
            .data(matrix)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

        column.append("line")
            .attr("x1", -width);

        column.append("text")
            .attr("x", 6)
            .attr("y", x.rangeBand() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .text(function (d, i) { return nodes[i].name; });

        function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function (d) { return d.z; }))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function (d) { return x(d.x); })
                .attr("width", x.rangeBand())
                .attr("height", x.rangeBand())
                .style("fill",
                    function (d) {
                        if (d.x == d.y) {
                            return color["6"];
                        } else if (nodes[d.x].group == nodes[d.y].group) {
                            return color[nodes[d.x].group];
                        } else if (nodes[d.x].group != nodes[d.y].group) {
                            return color["5"];
                        }
                    })
                .style("fill-opacity",
                    function (d) {
                        if (d.z < 10) {
                            return 0.4;
                        } else if (d.z <= 20) {
                            return 0.7;
                        } else {
                            return 1;
                        }
                    })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        }

        function mouseover(p) {
            d3.selectAll(".row text").classed("active", function (d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function (d, i) { return i == p.x; });
        }

        function mouseout() {
            d3.selectAll("text").classed("active", false);
        }

        d3.select("#sel_ord").on("change", function () {
            clearTimeout(timeout);
            let idx = this.selectedIndex
            order(this.options[idx].getAttribute("value"));
        });

        function order(value) {
            x.domain(orders[value]);
            var t = svg.transition().duration(2500);

            t.selectAll(".row")
                .delay(function (d, i) { return x(i) * 4; })
                .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; })
                .selectAll(".cell")
                .delay(function (d) { return x(d.x) * 4; })
                .attr("x", function (d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function (d, i) { return x(i) * 4; })
                .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
        }

        var timeout = setTimeout(function () {
            order("group");
            d3.select("#sel_ord").property("selectedIndex", 2).node().focus();
        }, 5000);
    });
}
