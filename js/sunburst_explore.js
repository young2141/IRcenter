//d3.v3버전으로 작성된 코드임.. 
var width = 850;
var height = 600;
var radius = Math.min(width, height) / 2;
var prevData = [];

function drawSunburst() {
    d3.select("#chartdiv2").select("svg").remove();
    $("#sequence").empty();

    var year = String(document.getElementById("years").value);
    var b = {
        w: 140, h: 30, s: 3, t: 10
    };
    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;

    var vis = d3.select("#chartdiv2").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
        .size([2 * Math.PI, radius * radius])
        .value(function (d) {
            var sex = document.getElementById("sex_selectbar");
            var cond = sex.options[sex.selectedIndex].value;

            if (cond == "all")
                return d.male + d.female;
            else if (cond == "male")
                return d.male;
            else
                return d.female;
        })
        .sort(null);

    var arc = d3.svg.arc()
        .startAngle(function (d) { return d.x; })
        .endAngle(function (d) { return d.x + d.dx; })
        .innerRadius(function (d) { return Math.sqrt(d.y); })
        .outerRadius(function (d) { return Math.sqrt(d.y + d.dy); });

    d3.json("../../../json/sunburst_explore.json", function (json) {
        initializeBreadcrumbTrail();
        createVisualization(json[year])
    });

    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json) {
        // Basic setup of page elements.
        initializeBreadcrumbTrail();

        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        vis.append("svg:circle")
            .attr("r", radius)
            .style("opacity", 0);

        // For efficiency, filter nodes to keep only those large enough to see.
        var nodes = partition.nodes(json)
            .filter(function (d) {
                return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
            });

        var path = vis.data([json]).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", function (d) {return d.depth ? null : "none"; })
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function (d) { return d.color; })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click", click)
            .each(stash)
            .transition()
            .attrTween("d", arcTween);
        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on("mouseleave", mouseleave);
        d3.select("#prevSunburst").on("click", prev);
        // Get total size of the tree = value of root node from partition.
        totalSize = path.node().__data__.value;
    };

    function click(d) {
        if (d.hasOwnProperty("children") == false) return; //맨 마지막 단계에서 안끝나도록 막음.
        d3.select("#container").selectAll("path").remove();
        prevData = d;

        var nodes = partition.nodes(d)
            .filter(function (d) {
                return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
            });

        var path = vis.data([d]).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", function (d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function (d) { return d.color; })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click", click)
            .each(stash)
            .transition()
            .attrTween("d", arcTween);

        // Get total size of the tree = value of root node from partition.
        totalSize = path.node().__data__.value;
    }

    function prev() {
        if (prevData.empty || prevData.parent == null) {
            alert("처음입니다.")
            return;
        }
        prevData = prevData.parent;
        //if (p.hasOwnProperty("children") == false) return; //맨 마지막 단계에서 안끝나도록 막음.
        d3.select("#container").selectAll("path").remove();

        var nodes = partition.nodes(prevData)
            .filter(function (d) {
                return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
            });

        var path = vis.data([prevData]).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", function (d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function (d) { return d.color; })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click", click)
            .each(stash)
            .transition()
            .attrTween("d", arcTween);

        // Get total size of the tree = value of root node from partition.
        totalSize = path.node().__data__.value;
    }

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
        var percentage = (100 * d.value / totalSize).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) {
            percentageString = "< 0.1%";
        }

        d3.select("#percentage")
            .html(d.value + "명<br><br>" + percentageString)

        d3.select("#explanation")
            .style("visibility", "");

        var sequenceArray = getAncestors(d);
        updateBreadcrumbs(sequenceArray, percentageString);

        // Fade all the segments.
        d3.selectAll("path")
            .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        vis.selectAll("path")
            .filter(function (node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

        // Hide the breadcrumb trail
        d3.select("#trail")
            .style("visibility", "hidden");

        // Deactivate all segments during transition.
        d3.selectAll("path").on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
            .transition()
            .style("opacity", 1)
            .each("end", function () {
                d3.select(this).on("mouseover", mouseover);
            });

        d3.select("#explanation")
            .transition()
            .style("visibility", "hidden");
    }

    function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }

    function getParents(node) {
        var path = [];
        var current = node;
        while (current != null) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }
    function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select("#sequence").append("svg:svg")
            .attr("width", width)
            .attr("height", 50)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

        // Data join; key function combines name and depth (= position in sequence).
        var g = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function (d) { return d.name + d.depth; });

        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function (d) { return d.color; });

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function (d) { return d.name; });

        // Set position for entering and updating nodes.
        g.attr("transform", function (d, i) {
            return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Remove exiting nodes.
        g.exit().remove();

        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
            .style("visibility", "");

    }

    function arcTween(a) {
        var i = d3.interpolate({ x: a.x0, dx: a.dx0 }, a);
        return function (t) {
            var b = i(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
        };
    };

    function stash(d) {
        d.x0 = 0; // d.x;
        d.dx0 = 0; //d.dx;
    };
}