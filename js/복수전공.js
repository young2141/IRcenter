const path = "../../../json/등록/복수전공/";
var filename = "multidegree.json";
var chart;
var color = {};
var division = {
    "인문사회": 0,
    "자연과학": 1,
    "공학": 2,
    "예체능": 3
};

function getColorsByDvisions() {
    let colors = document.getElementById("colors");
    color["0"] = "C6C6DD";
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

function d3_drawChart() {
    d3.json(path + filename, function (data) {
        data.nodes.forEach(e => e.group = division[e.group]);

        var innerW = d3.min([window.innerWidth * 0.4, 600]);
        var margin = { top: innerW * 0.42, right: 0, bottom: 10, left: innerW * 0.42 },
            width = innerW,
            height = width;

        var x = d3.scaleBand().range([0, width]);
        var x2 = d3.scaleBand().range([0, width]);

        //draw upper chart
        var svg = d3.select("#chartdiv").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "some")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var linklabel = "#linklabel1";
        var explainer = d3.select("svg#some").append("foreignObject")
            .attr("width", 500)
            .attr("height", 200)
            .attr("transform", "translate(0,20)")
            .append("xhtml:text")
            .attr("id", linklabel.substr(1, linklabel.length))
            .html("");

        //draw downer chart
        var svg2 = d3.select("#chartdiv2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "some2")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var linklabel2 = "#linklabel2";
        var explainer2 = d3.select("svg#some2").append("foreignObject")
            .attr("width", 500)
            .attr("height", 200)
            .attr("transform", "translate(0,20)")
            .append("xhtml:text")
            .attr("id", linklabel2.substr(1, linklabel2.length))
            .html("");

        var termyear = document.getElementById("termyear").options[(document.getElementById("termyear").selectedIndex)].getAttribute("value");
        var all_nodes = data["nodes"].slice(0);
        var all_edges = data["edges"].filter(d => d["termyear"] == termyear).slice(0);

        var matrix = [];
        var nodeHash = {};
        var nodes = [];
        var edges = [];
        var n;

        var matrix2 = [];
        var nodeHash2 = {};
        var nodes2 = [];
        var edges2 = [];
        var n2;


        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#FFFFFF");

        svg2.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#FFFFFF");

        createNetwork();

        var orders = {
            name: d3.range(n).sort(function (a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
            count: d3.range(n).sort(function (a, b) { return nodes[b].count - nodes[a].count; }),
            group: d3.range(n).sort(function (a, b) { return nodes[a].group - nodes[b].group; })
        };

        var orders2 = {
            name: d3.range(n2).sort(function (a, b) { return d3.ascending(nodes2[a].name, nodes2[b].name); }),
            count: d3.range(n2).sort(function (a, b) { return nodes2[b].count - nodes2[a].count; }),
            group: d3.range(n2).sort(function (a, b) { return nodes2[a].group - nodes2[b].group; })
        };

        x.domain(orders.name);
        x2.domain(orders2.name);

        var row = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; })
            .each(row);

        row.append("line")
            .attr("x2", width);

        row.append("text")
            .attr("x", -6)
            .attr("y", x.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function (d, i) { return nodes[i].name.replace(/&amp;/g, '&'); })
            .style("fill", function (d, i) { return color[nodes[d[i].x].group + 1]; })
            .style("font-size", function (d, i) { return x.bandwidth() - 2 + "px"; })
            .on("mouseover", mouseover_row)
            .on("mouseout", mouseout_row);

        var column = svg.selectAll(".column")
            .data(matrix)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

        column.append("line")
            .attr("x1", -width);

        column.append("text")
            .attr("x", 6)
            .attr("y", x.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .style("fill", function (d, i) { return color[nodes[d[i].y].group + 1]; })
            .text(function (d, i) { return nodes[i].name.replace(/&amp;/g, '&'); })
            .style("font-size", x.bandwidth() - 2 + "px")
            .on("mouseover", mouseover_col)
            .on("mouseout", mouseout_col);

        var row2 = svg2.selectAll(".row")
            .data(matrix2)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function (d, i) { return "translate(0," + x2(i) + ")"; })
            .each(row2);

        row2.append("line")
            .attr("x2", width);

        row2.append("text")
            .attr("x", -6)
            .attr("y", x2.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function (d, i) { return nodes2[i].name.replace(/&amp;/g, '&'); })
            .style("fill", function (d, i) { return color[nodes2[d[i].x].group + 1]; })
            .style("font-size", function (d, i) { return x2.bandwidth() - 2 + "px"; })
            .on("mouseover", mouseover_row)
            .on("mouseout", mouseout_row);

        var column2 = svg2.selectAll(".column")
            .data(matrix2)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", function (d, i) { return "translate(" + x2(i) + ")rotate(-90)"; });

        column2.append("line")
            .attr("x1", -width);

        column2.append("text")
            .attr("x", 6)
            .attr("y", x2.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .style("fill", function (d, i) { return color[nodes2[d[i].y].group + 1]; })
            .text(function (d, i) { return nodes2[i].name.replace(/&amp;/g, '&'); })
            .style("font-size", x2.bandwidth() - 2 + "px")
            .on("mouseover", mouseover_col)
            .on("mouseout", mouseout_col);

        function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row)
                // .data(row.filter(function (d) { return d.z; }))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function (d) { return x(d.x); })
                .attr("width", x.bandwidth() - 1)
                .attr("height", x.bandwidth() - 1)
                .style("fill", function (d) { return d.x == d.y ? "#FFF" : d.z == 0 ? color["0"] : nodes[d.x].group == nodes[d.y].group ? color[nodes[d.x].group + 1] : color["5"]; })
                .style("fill-opacity", function (d) { return d.z == 0 ? 0.6 : d.z < 10 ? 0.4 : d.z <= 20 ? 0.7 : 1; })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .append("title")
                .text(function (d) { return d.x == d.y ? "" : d.z + "복수전공"; });
        }

        function row2(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row)
                // .data(row.filter(function (d) { return d.z; }))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function (d) { return x2(d.x); })
                .attr("width", x2.bandwidth() - 1)
                .attr("height", x2.bandwidth() - 1)
                .style("fill", function (d) { return d.x == d.y ? "#FFF" : d.z == 0 ? color["0"] : nodes2[d.x].group == nodes2[d.y].group ? color[nodes2[d.x].group + 1] : color["5"]; })
                .style("fill-opacity", function (d) { return d.z == 0 ? 0.6 : d.z < 10 ? 0.4 : d.z <= 20 ? 0.7 : 1; })
                .on("mouseover", mouseover2)
                .on("mouseout", mouseout2)
                .append("title")
                .text(function (d) { return d.x == d.y ? "" : d.z + "복수전공"; });
        }

        // if (!isAll) {
        d3.select("#order").on("change", function () {
            // clearTimeout(timeout);
            let idx = this.selectedIndex
            order(this.options[idx].getAttribute("value"));
            updateMatrix(matrix);
            updateMatrix2(matrix2);
        });

        d3.select("#termyear").on("change", function () {
            let idx = document.getElementById("termyear").selectedIndex;
            termyear = document.getElementById("termyear").options[idx].getAttribute("value");
            all_nodes = data["nodes"].slice(0);
            all_edges = data["edges"].filter(element => element["termyear"] === termyear).slice(0);
            createNetwork();
            updateMatrix(matrix);
            updateMatrix2(matrix2);
        });
        // }

        function order(value) {
            x.domain(orders[value]);
            // x2.domain(orders[value]);
            var t = svg.transition().duration(3000);
            // var t2 = svg2.transition().duration(3000);

            t.selectAll(".row")
                .delay(function (d, i) { return x(i) * 5; })
                .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; })
                .selectAll(".cell")
                .delay(function (d) { return x(d.x) * 5; })
                .attr("x", function (d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function (d, i) { return x(i) * 5; })
                .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
        }

        function order2(value) {
            x2.domain(orders[value]);
            var t = svg2.transition().duration(3000);

            t.selectAll(".row")
                .delay(function (d, i) { return x2(i) * 5; })
                .attr("transform", function (d, i) { return "translate(0," + x2(i) + ")"; })
                .selectAll(".cell")
                .delay(function (d) { return x2(d.x) * 5; })
                .attr("x", function (d) { return x2(d.x); });

            t.selectAll(".column")
                .delay(function (d, i) { return x2(i) * 5; })
                .attr("transform", function (d, i) { return "translate(" + x2(i) + ")rotate(-90)"; });
        }

        function mouseover_row(p) {
            var activeCells = d3.selectAll("rect.cell").filter(function (d) {
                return d.z && d.y == p[0].y && d.x != d.y;
            }).style('stroke-width', 3).style('stroke', 'grey');
        }

        function mouseout_row(p) {
            d3.selectAll("rect.cell").filter(function (d) {
                return d.z && d.y == p[0].y && d.x != d.y;
            }).style('stroke-width', 0);
        }

        function mouseover_col(p) {
            var activeCells = d3.selectAll("rect.cell").filter(function (d) {
                return d.z && d.x == p[0].y && d.x != d.y;
            }).style('stroke-width', 3).style('stroke', 'grey');
        }

        function mouseout_col(p) {
            d3.selectAll("rect.cell").filter(function (d) {
                return d.z && d.x == p[0].y && d.x != d.y;
            }).style('stroke-width', 0);
        }

        function mouseover(p) {
            var rowtext = d3.selectAll(".row text").filter(function (d, i) { return i == p.y; }),
                coltext = d3.selectAll(".column text").filter(function (d, i) { return i == p.x; });

            d3.selectAll(".row text").classed("active", function (d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function (d, i) { return i == p.x; });

            if (rowtext.text() === coltext.text()) {
                d3.select(linklabel).html(rowtext.text() + ' 복수전공 인원' + '<br><span style="font-size: 18pt;">' + (p.z) + "</span> 명");
            }
            else {
                d3.select(linklabel).html(rowtext.text() + ' | ' + coltext.text() + '<br><span style="font-size: 18pt;"> ' + (p.z) + "</span> 명");
            }
        }

        function mouseover2(p) {
            var rowtext = d3.selectAll(".row text").filter(function (d, i) { return i == p.y; }),
                coltext = d3.selectAll(".column text").filter(function (d, i) { return i == p.x; });

            d3.selectAll(".row text").classed("active", function (d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function (d, i) { return i == p.x; });

            if (rowtext.text() === coltext.text()) {
                d3.select(linklabel2).html(rowtext.text() + ' 복수전공 인원' + '<br><span style="font-size: 18pt;">' + (p.z) + "</span> 명");
            }
            else {
                d3.select(linklabel2).html(rowtext.text() + ' | ' + coltext.text() + '<br><span style="font-size: 18pt;"> ' + (p.z) + "</span> 명");
            }
        }

        function mouseout() {
            d3.selectAll("text").classed("active", false);
            d3.select(linklabel).html("");
        }

        function mouseout2() {
            d3.selectAll("text").classed("active", false);
            d3.select(linklabel2).html("");
        }

        // take the data output and turn it into a network.
        function createNetwork() {
            nodeHash = {};
            nodes = [];
            edges = [];

            nodeHash2 = {};
            nodes2 = [];
            edges2 = [];
            // clean up the data structure and call it edgelist

            all_nodes.forEach(e => {
                e.count = 0;
                nodeHash2[e.name] = { "count": e.count };
            });

            all_edges = all_edges.map(function (d) {
                if (d.source != d.target) {
                    nodeHash2[d.source].count += d.weight;
                    nodeHash2[d.target].count += d.weight;
                } else {
                    nodeHash2[d.source].count += d.weight;
                }
                return { 'source': d.source, 'target': d.target, 'weight': d.weight };
            });

            all_nodes.forEach(e => e.count = nodeHash2[e.name].count);
            all_nodes.sort((a, b) => { return b.count - a.count; })

            createMatrix();
        }

        function createMatrix() {
            // reset the matrix
            matrix = [];
            matrix2 = [];

            nodes2 = all_nodes;
            edges2 = all_edges;

            //create matrix for upper chart
            for (let i = 0; i < 50; ++i) {
                nodes.push(all_nodes[i]);
                nodeHash[all_nodes[i].name] = i;
            }

            edges = all_edges.filter(e => e.source in nodeHash && e.target in nodeHash);

            n = nodes.length;
            nodes.forEach((e, i) => nodeHash[e.name] = i);
            edges = edges.map(e => { return { "source": nodeHash[e.source], "target": nodeHash[e.target], "weight": e.weight }; });

            // Compute index per node.
            nodes.forEach(function (node, i) {
                matrix[i] = d3.range(n).map(function (j) { return { x: j, y: i, z: 0 }; });
            });

            // Convert edges to a matrix; count major occurrences.
            edges.forEach(function (edge) {
                matrix[edge.source][edge.target].z += edge.weight;
                matrix[edge.target][edge.source].z += edge.weight;
                matrix[edge.source][edge.source].z += edge.weight;
                matrix[edge.target][edge.target].z += edge.weight;
            });


            //create matrix for downer chart
            n2 = nodes2.length;
            nodes2.forEach((e, i) => nodeHash2[e.name] = i);
            edges2 = edges2.map(e => { return { "source": nodeHash2[e.source], "target": nodeHash2[e.target], "weight": e.weight }; });

            // Compute index per node.
            nodes2.forEach(function (node, i) {
                matrix2[i] = d3.range(n2).map(function (j) { return { x: j, y: i, z: 0 }; });
            });

            // Convert edges to a matrix; count major occurrences.
            edges2.forEach(function (edge) {
                matrix2[edge.source][edge.target].z += edge.weight;
                matrix2[edge.target][edge.source].z += edge.weight;
                matrix2[edge.source][edge.source].z += edge.weight;
                matrix2[edge.target][edge.target].z += edge.weight;
            });
        } // end

        function updateMatrix(matrix) {
            orders = {};

            // Precompute the orders.
            orders = {
                name: d3.range(n).sort(function (a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
                count: d3.range(n).sort(function (a, b) { return nodes[b].count - nodes[a].count; }),
                group: d3.range(n).sort(function (a, b) { return nodes[a].group - nodes[b].group; })
            };

            // use the current sort selection
            x.domain(orders[d3.select("#order").property("value")]);

            var rows = svg.selectAll("g.row")
                .data(matrix)
                .each(row);

            rows.select("text")
                .attr("x", -6)
                .attr("y", x.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "end")
                .style("font-size", function (d, i) { return x.bandwidth() - 2 + "px"; })
                .text(function (d, i) {
                    return nodes[i].name.replace(/&amp;/g, '&');
                });

            rows.select("line")
                .attr("x2", width);

            var newrows = rows.enter()
                .append("g")
                .attr("class", "row")
                .each(row);


            newrows.append("line")
                .attr("x2", width);

            newrows.append("text")
                .attr("x", -6)
                .attr("y", x.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "end")
                .style("font-size", x.bandwidth() - 2 + "px")
                .text(function (d, i) {
                    return nodes[i].name.replace(/&amp;/g, '&');
                });

            rows.exit().remove();

            svg.selectAll("g.row text")
                .on("mouseover", mouseover_row)
                .on("mouseout", mouseout_row);

            // each column is also a group containing a line and some text, both rotated -90 degrees
            var columns = svg.selectAll("g.column")
                .data(matrix)

            columns.exit().remove();

            columns.select("line")
                .attr("x1", -width);

            columns.select("text")
                .attr("x", 6)
                .attr("y", x.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "start")
                .text(function (d, i) { return nodes[i].name.replace(/&amp;/g, '&'); })
                .style("font-size", function (d, i) { return x.bandwidth() * 0.9 + "px"; })
                .on("mouseover", mouseover_col)
                .on("mouseout", mouseout_col);

            var newcols = columns.enter()
                .append("g")
                .attr("class", "column")
                .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

            newcols.append("text")
                .attr("x", 6)
                .attr("y", x.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "start")
                .text(function (d, i) { return nodes[i].name.replace(/&amp;/g, '&'); })
                .style("font-size", function (d, i) { return x.bandwidth() * 0.9 + "px"; })
                .on("mouseover", mouseover_col)
                .on("mouseout", mouseout_col);

            newcols.append("line")
                .attr("x1", -width);

            // create the actual colored square cells and color them according to their group.
            function row(row) {
                var cell = d3.select(this).selectAll(".cell")
                    .data(row)
                    .attr("width", x.bandwidth() - 1)
                    .attr("height", x.bandwidth() - 1)
                    .style("fill", function (d) { return d.x == d.y ? "#FFF" : d.z == 0 ? color["0"] : nodes[d.x].group == nodes[d.y].group ? color[nodes[d.x].group + 1] : color["5"]; })
                    .style("fill-opacity", function (d) { return d.z == 0 ? 0.6 : d.z < 10 ? 0.4 : d.z <= 20 ? 0.7 : 1; })
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)

                cell.enter().append("rect")
                    .attr("class", "cell")
                    .attr("width", x.bandwidth() - 1)
                    .attr("height", x.bandwidth() - 1)
                    .style("fill", function (d) { return d.x == d.y ? "#FFF" : d.z == 0 ? color["0"] : nodes[d.x].group == nodes[d.y].group ? color[nodes[d.x].group + 1] : color["5"]; })
                    .style("fill-opacity", function (d) { return d.z == 0 ? 0.6 : d.z < 10 ? 0.4 : d.z <= 20 ? 0.7 : 1; })
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .append("title")

                cell.exit().remove();
            }

            // set up the transition to last a total of 3 seconds
            var t = svg.transition().duration(3000);

            // have each row and column move after a delay that is a function of the index of its location
            t.selectAll(".row")
                .delay(function (d, i) { return x(i) * 5; })
                .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; })
                .selectAll(".cell")
                .delay(function (d) { return x(d.x) * 5; })
                .attr("x", function (d) { return x(d.x); });

            t.selectAll(".column")
                .delay(function (d, i) { return x(i) * 5; })
                .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

            function key(d) { return d.x; }

            order(d3.select("#order").property("value"));
        } //updateMatrix

        function updateMatrix2(matrix) {
            orders = {};

            // Precompute the orders.
            orders = {
                name: d3.range(n2).sort(function (a, b) { return d3.ascending(nodes2[a].name, nodes2[b].name); }),
                count: d3.range(n2).sort(function (a, b) { return nodes2[b].count - nodes2[a].count; }),
                group: d3.range(n2).sort(function (a, b) { return nodes2[a].group - nodes2[b].group; })
            };

            // use the current sort selection
            x2.domain(orders[d3.select("#order").property("value")]);

            var rows = svg2.selectAll("g.row")
                .data(matrix)
                .each(row);

            rows.select("text")
                .attr("x", -6)
                .attr("y", x2.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "end")
                .style("font-size", function (d, i) { return x2.bandwidth() - 2 + "px"; })
                .text(function (d, i) {
                    return nodes2[i].name.replace(/&amp;/g, '&');
                });

            rows.select("line")
                .attr("x2", width);

            var newrows = rows.enter()
                .append("g")
                .attr("class", "row")
                .each(row);


            newrows.append("line")
                .attr("x2", width);

            newrows.append("text")
                .attr("x", -6)
                .attr("y", x2.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "end")
                .style("font-size", x2.bandwidth() - 2 + "px")
                .text(function (d, i) {
                    return nodes2[i].name.replace(/&amp;/g, '&');
                });

            rows.exit().remove();

            svg.selectAll("g.row text")
                .on("mouseover", mouseover_row)
                .on("mouseout", mouseout_row);

            // each column is also a group containing a line and some text, both rotated -90 degrees
            var columns = svg2.selectAll("g.column")
                .data(matrix)

            columns.exit().remove();

            columns.select("line")
                .attr("x1", -width);

            columns.select("text")
                .attr("x", 6)
                .attr("y", x2.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "start")
                .text(function (d, i) { return nodes2[i].name.replace(/&amp;/g, '&'); })
                .style("font-size", function (d, i) { return x2.bandwidth() * 0.9 + "px"; })
                .on("mouseover", mouseover_col)
                .on("mouseout", mouseout_col);

            var newcols = columns.enter()
                .append("g")
                .attr("class", "column")
                .attr("transform", function (d, i) { return "translate(" + x2(i) + ")rotate(-90)"; });

            newcols.append("text")
                .attr("x", 6)
                .attr("y", x2.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "start")
                .text(function (d, i) { return nodes2[i].name.replace(/&amp;/g, '&'); })
                .style("font-size", function (d, i) { return x2.bandwidth() * 0.9 + "px"; })
                .on("mouseover", mouseover_col)
                .on("mouseout", mouseout_col);

            newcols.append("line")
                .attr("x1", -width);

            // svg.selectAll("g.column text")
            //     .on("mouseover", mouseover_col)
            //     .on("mouseout", mouseout_col);


            // create the actual colored square cells and color them according to their group.
            function row(row) {
                var cell = d3.select(this).selectAll(".cell")
                    .data(row)
                    .attr("width", x2.bandwidth() - 1)
                    .attr("height", x2.bandwidth() - 1)
                    .style("fill", function (d) { return d.x == d.y ? "#FFF" : d.z == 0 ? color["0"] : nodes2[d.x].group == nodes2[d.y].group ? color[nodes2[d.x].group + 1] : color["5"]; })
                    .style("fill-opacity", function (d) { return d.z == 0 ? 0.6 : d.z < 10 ? 0.4 : d.z <= 20 ? 0.7 : 1; })
                    .on("mouseover", mouseover2)
                    .on("mouseout", mouseout2)

                cell.enter().append("rect")
                    .attr("class", "cell")
                    .attr("width", x2.bandwidth() - 1)
                    .attr("height", x2.bandwidth() - 1)
                    .style("fill", function (d) { return d.x == d.y ? "#FFF" : d.z == 0 ? color["0"] : nodes2[d.x].group == nodes2[d.y].group ? color[nodes2[d.x].group + 1] : color["5"]; })
                    .style("fill-opacity", function (d) { return d.z == 0 ? 0.6 : d.z < 10 ? 0.4 : d.z <= 20 ? 0.7 : 1; })
                    .on("mouseover", mouseover2)
                    .on("mouseout", mouseout2)
                    .append("title")

                cell.exit().remove();
            }

            // set up the transition to last a total of 3 seconds
            var t = svg2.transition().duration(3000);

            // have each row and column move after a delay that is a function of the index of its location
            t.selectAll(".row")
                .delay(function (d, i) { return x2(i) * 5; })
                .attr("transform", function (d, i) { return "translate(0," + x2(i) + ")"; })
                .selectAll(".cell")
                .delay(function (d) { return x2(d.x) * 5; })
                .attr("x", function (d) { return x2(d.x); });

            t.selectAll(".column")
                .delay(function (d, i) { return x2(i) * 5; })
                .attr("transform", function (d, i) { return "translate(" + x2(i) + ")rotate(-90)"; });

            function key(d) { return d.x; }

            order2(d3.select("#order").property("value"));
            if (document.getElementById("order").selectedIndex == 2) {
                var timeout = setTimeout(function () {
                    svg2.selectAll("svg text").style("font-size", x2.bandwidth() - 2);
                    order2("count");

                    svg2.append("line")
                        .attr("x1", function (d) {
                            return x2.bandwidth() * 43;
                        })
                        .attr("x2", function (d) {
                            return x2.bandwidth() * 43;
                        })
                        .attr("y1", 0)
                        .attr("y2", function (d) {
                            return x2.bandwidth() * 43;
                        })
                        .style("opacity", 0)
                        .attr("class", "subset")
                        .style("stroke-width", 3)
                        .style("stroke", "orange")
                        .attr("id", "xaxis-line");

                    svg2.append("line")
                        .attr("x1", 0)
                        .attr("x2", function (d) {
                            return x2.bandwidth() * 43;
                        })
                        .attr("y1", function (d) {
                            return x2.bandwidth() * 43;
                        })
                        .attr("y2", function (d) {
                            return x2.bandwidth() * 43;
                        })
                        .style("opacity", 0)
                        .attr("class", "subset")
                        .style("stroke-width", 3)
                        .style("stroke", "orange")
                        .attr("id", "yaxis-line");

                    svg2.selectAll("line.subset").transition().duration(2000).style("opacity", 1);
                }, 1000);
            } else {
                d3.select("#xaxis-line").remove();
                d3.select("#yaxis-line").remove();
            }

        } //updateMatrix

    });
}