const path = "../../../json/등록/복수전공/";
var filename = "multidegree.json";
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
    d3_drawChart("#chartdiv2");
    d3_drawChart("#chartdiv");
}

function d3_drawChart(id) {
    d3.json(path + filename, function (data) {
        var innerW = d3.min([window.innerWidth * 0.4, 600]);
        var margin = { top: innerW * 0.35, right: 0, bottom: 10, left: innerW * 0.35 },
            width = innerW,
            height = width;

        var x = d3.scaleBand().range([0, width]);
        var c = d3.scaleOrdinal().range(["#E8A343", "#FCFF57", "#43E884", "#52A1FF"]);

        var svg = d3.select(id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "some")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var explainer = d3.select("svg#some").append("foreignObject")
            .attr("width", 500)
            .attr("height", 200)
            .attr("transform", "translate(0,20)")
            .append("xhtml:text")
            .attr("id", "linklabel")
            .html("");

        var termyear = document.getElementById("termyear").options[(document.getElementById("termyear").selectedIndex)].getAttribute("value");
        var matrix = [];
        var nodeHash = {};
        var all_nodes = data["nodes"].slice(0);
        var all_edges = data["edges"].filter(d => d["termyear"] == termyear).slice(0);
        var nodes = [];
        var edges = [];
        var n;
        var isAll = false;

        if (id == "#chartdiv2") {
            isAll = true;
        }
        // document.getElementsByName("data_range").forEach(e => {
        //     if (e.checked && e.getAttribute("value") == "all") {
        //         isAll = true;
        //     }
        // });

        svg.append("rect")
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

        x.domain(orders.name);

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
            .style("fill", function(d,i) {return color[d[i].x]; })
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
            .style("fill", function(d,i) { return color[d[i].y]; })
            .text(function (d, i) { return nodes[i].name.replace(/&amp;/g, '&'); })
            .style("font-size", x.bandwidth() - 2 + "px")
            .on("mouseover", mouseover_col)
            .on("mouseout", mouseout_col);

        function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function (d) {
                    // console.log(d);
                    return d.z;
                }))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function (d) { return x(d.x); })
                .attr("width", x.bandwidth() - 1)
                .attr("height", x.bandwidth() - 1)
                .style("fill", function (d) { return d.z == 1 ? "C6C6DD" : d.x == d.y ? "#FFF" : nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : "#808080"; })
                .style("fill-opacity", function (d) { return d.z == 1 ? 0.6 : d.z < 10 + 1 ? 0.4 : d.z <= 20 + 1 ? 0.7 : 1; })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .append("title")
                .text(function (d) { return d.x == d.y ? "" : d.z + "복수전공"; });
        }

        if (!isAll) {
            d3.select("#order").on("change", function () {
                // clearTimeout(timeout);
                let idx = this.selectedIndex
                order(this.options[idx].getAttribute("value"));
                updateMatrix(matrix);
            });

            d3.select("#termyear").on("change", function () {
                let idx = document.getElementById("termyear").selectedIndex;
                termyear = document.getElementById("termyear").options[idx].getAttribute("value");
                all_nodes = data["nodes"].slice(0);
                all_edges = data["edges"].filter(element => element["termyear"] === termyear).slice(0);
                createNetwork();
                updateMatrix(matrix);
            });
        }

        d3.selectAll("input[name='data_range']").on("change", function () {
            all_edges = data["edges"].filter(element => element["termyear"] === termyear);
            document.getElementsByName("data_range").forEach(function (e, i) {
                if (e.checked) {
                    if (e.getAttribute("value") == "all") {
                        isAll = true;
                    } else {
                        isAll = false;
                    }
                }
            });

            createNetwork();
            updateMatrix(matrix);
        });

        function order(value) {
            x.domain(orders[value]);
            var t = svg.transition().duration(3000);

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

        function mouseover_row(p) {
            console.log(p);
            d3.selectAll("rect.cell").filter(function (d) {
                if(d.z>1){
                return d.y == p[0].y && d.x != d.y;
                }
            }).style('stroke-width', 3).style('stroke', 'yellow');
        }

        function mouseout_row(p) {
            d3.selectAll("rect.cell").filter(function (d) {
                return d.y == p[0].y && d.x != d.y;
            }).style('stroke-width', 0);
        }

        function mouseover_col(p) {
            console.log(p);
            d3.selectAll("rect.cell").filter(function (d) {
                if(d.z > 1){
                return d.x == p[0].y && d.x != d.y;
                }
            }).style('stroke-width', 3).style('stroke', 'yellow');
        }

        function mouseout_col(p) {
            // console.log(p);
            d3.selectAll("rect.cell").filter(function (d) {
                return d.x == p[0].y && d.x != d.y;
            }).style('stroke-width', 0);
        }

        function mouseover(p) {
            var rowtext = d3.selectAll(".row text").filter(function (d, i) { return i == p.y; }),
                coltext = d3.selectAll(".column text").filter(function (d, i) { return i == p.x; });

            d3.selectAll(".row text").classed("active", function (d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function (d, i) { return i == p.x; });

            if (rowtext.text() === coltext.text()) {
                d3.select("#linklabel").html(rowtext.text() + ' 복수전공 인원' + '<br><span style="font-size: 18pt;">' + (p.z - 1) + "</span> 명");
            }
            else {
                d3.select("#linklabel").html(rowtext.text() + ' | ' + coltext.text() + '<br><span style="font-size: 18pt;"> ' + (p.z - 1) + "</span> 명");
            }
        }

        function mouseout() {
            d3.selectAll("text").classed("active", false);
            d3.select("#linklabel").html("");
        }

        // take the data output and turn it into a network.
        function createNetwork() {
            var nodeHash = {};
            nodes = [];
            edges = [];
            // clean up the data structure and call it edgelist

            all_nodes.forEach(e => {
                e.count = 0;
                nodeHash[e.name] = { "count": e.count };
            });

            all_edges = all_edges.map(function (d) {
                if (d.source != d.target) {
                    nodeHash[d.source].count += d.weight;
                    nodeHash[d.target].count += d.weight;
                } else {
                    nodeHash[d.source].count += d.weight;
                }
                return { 'source': d.source, 'target': d.target, 'weight': d.weight };
            });

            all_nodes.forEach(e => e.count = nodeHash[e.name].count);
            all_nodes.sort((a, b) => { return b.count - a.count; })

            createMatrix();
        }

        function createMatrix() {
            // reset the matrix
            matrix = [];

            nodes = all_nodes;
            edges = all_edges;

            if (!isAll) {
                const size_mtx = 50;
                let nodeHash = {};
                nodes = [];
                edges = [];

                for (let i = 0; i < size_mtx; ++i) {
                    nodes.push(all_nodes[i]);
                    nodeHash[all_nodes[i].name] = i;
                }

                edges = all_edges.filter(e => e.source in nodeHash && e.target in nodeHash);

            }

            n = nodes.length;
            nodes.forEach((e, i) => nodeHash[e.name] = i);
            edges = edges.map(e => { return { "source": nodeHash[e.source], "target": nodeHash[e.target], "weight": e.weight }; });

            // Compute index per node.
            nodes.forEach(function (node, i) {
                matrix[i] = d3.range(n).map(function (j) { return { x: j, y: i, z: 1 }; });
            });

            // Convert edges to a matrix; count major occurrences.
            edges.forEach(function (edge) {
                matrix[edge.source][edge.target].z += edge.weight;
                matrix[edge.target][edge.source].z += edge.weight;
                matrix[edge.source][edge.source].z += edge.weight;
                matrix[edge.target][edge.target].z += edge.weight;
            });
            if (isAll) {
                // if (isAll && document.getElementById("order").selectedIndex == 2) {
                var timeout = setTimeout(function () {
                    svg.selectAll("svg text").style("font-size", x.bandwidth() - 2);
                    order("count");

                    svg.append("line")
                        .attr("x1", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("x2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("y1", 0)
                        .attr("y2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .style("opacity", 0)
                        .attr("class", "subset")
                        .style("stroke-width", 3)
                        .style("stroke", "orange")
                        .attr("id", "xaxis-line");

                    svg.append("line")
                        .attr("x1", 0)
                        .attr("x2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("y1", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("y2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .style("opacity", 0)
                        .attr("class", "subset")
                        .style("stroke-width", 3)
                        .style("stroke", "orange")
                        .attr("id", "yaxis-line");

                    svg.selectAll("line.subset").transition().duration(2000).style("opacity", 1);
                }, 1000);
            } else {
                d3.select("#xaxis-line").remove();
                d3.select("#yaxis-line").remove();
            }
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
                    .data(row.filter(function (d) { return d.z; }))
                    .attr("width", x.bandwidth() - 1)
                    .attr("height", x.bandwidth() - 1)
                    .style("fill", function (d) { return d.z == 1 ? "C6C6DD" : d.x == d.y ? "#FFF" : nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : "#808080"; })
                    .style("fill-opacity", function (d) { return d.z == 1 ? 0.6 : d.z < 10 + 1 ? 0.4 : d.z <= 20 + 1 ? 0.7 : 1; })
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)

                cell.enter().append("rect")
                    .attr("class", "cell")
                    .attr("width", x.bandwidth() - 1)
                    .attr("height", x.bandwidth() - 1)
                    .style("fill", function (d) { return d.z == 1 ? "C6C6DD" : d.x == d.y ? "#FFF" : nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : "#808080"; })
                    .style("fill-opacity", function (d) { return d.z == 1 ? 0.6 : d.z < 10 + 1 ? 0.4 : d.z <= 20 + 1 ? 0.7 : 1; })
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
            if (isAll) {
                // if (isAll && document.getElementById("order").selectedIndex == 2) {
                var timeout = setTimeout(function () {
                    svg.selectAll("svg text").style("font-size", x.bandwidth() - 2);
                    order("count");

                    svg.append("line")
                        .attr("x1", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("x2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("y1", 0)
                        .attr("y2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .style("opacity", 0)
                        .attr("class", "subset")
                        .style("stroke-width", 3)
                        .style("stroke", "orange")
                        .attr("id", "xaxis-line");

                    svg.append("line")
                        .attr("x1", 0)
                        .attr("x2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("y1", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .attr("y2", function (d) {
                            return x.bandwidth() * 43;
                        })
                        .style("opacity", 0)
                        .attr("class", "subset")
                        .style("stroke-width", 3)
                        .style("stroke", "orange")
                        .attr("id", "yaxis-line");

                    svg.selectAll("line.subset").transition().duration(2000).style("opacity", 1);
                }, 1000);
            } else {
                d3.select("#xaxis-line").remove();
                d3.select("#yaxis-line").remove();
            }

        } //updateMatrix

    });
}