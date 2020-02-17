var width = 850;
var height = 600;
var radius = Math.min(width, height) / 2;

function drawSunburst() {
    var totalSize = 0;
    var b = {
        w: 140, h: 30, s: 3, t: 10
    };
    var x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);
    var y = d3.scaleSqrt()
        .range([0, radius]);
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var partition = d3.partition();
    var arc = d3.arc()
        .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
        .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
        .innerRadius(function (d) { return Math.max(0, y(d.y0)); })
        .outerRadius(function (d) { return Math.max(0, y(d.y1)); });

    var svg = d3.select("#chartdiv2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "container")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    d3.json("../../../json/sunburst_department.json", function (error, root) {
        if (error) throw error;
        initializeBreadcrumbTrail();
        root = d3.hierarchy(root["2019"]);
        root.sum(function (d) { return d.male+d.female; });
        var path = svg.selectAll("path")
            .data(partition(root).descendants())
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function (d) { return d.data.color; })
            .on("click", click)
            .on("mouseover", mouseover);
        d3.select("#container").on("mouseleave", mouseleave);
        updateBreadcrumbs(getParents(root), root.value);
        totalSize = path.datum().value;
    });

    function mouseover(d) {
        var percentage = (100 * d.value / totalSize).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) {
            percentageString = "< 0.1%";
        }
        /*
        tooltip
            .style("display", null)
            .html(d.data.name + "의 사람수는 " + d.data.size + "입니다.")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        */
        var sequenceArray = d.ancestors().reverse();
        sequenceArray.shift(); // remove root node from the array
        updateBreadcrumbs(sequenceArray, percentageString);

        d3.select("#percentage")
            .html(d.value + "명<br><br>" + percentageString)

        d3.select("#explanation")
            .style("visibility", "");

        // Fade all the segments.
        d3.selectAll("path")
            .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        svg.selectAll("path")
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
            .on("end", function () {
                d3.select(this).on("mouseover", mouseover);
            });

        d3.select("#explanation")
            .style("visibility", "hidden");
    }

    function getParents(a) {
        var nodeArray = [a];
        while (a.parent) {
            nodeArray.push(a.parent);
            a = a.parent
        }
        return nodeArray.reverse();
    }

    function click(d) {
        updateBreadcrumbs(getParents(d), d.value);
        svg.transition()
            .duration(750)
            .tween("scale", function () {
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
            .selectAll("path")
            .attrTween("d", function (d) { return function () { return arc(d); }; });
    }

    function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select("#sequence").append("svg:svg")
            .attr("width", width)
            .attr("height", width / 10)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
    }

    function updateBreadcrumbs(nodeArray, percentageString) {
        // Data join; key function combines name and depth (= position in sequence).
        var g = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function (x) { return percentageString + x.data.name + x.depth; });

        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function (d) { return d.data.color; });

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function (x) { return x.data.name; });

        entering.attr("transform", function (x, i) { return "translate(" + i * (b.w + b.s) + ", 0)"; });


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

    function breadcrumbPoints(x, i) {
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
    d3.select(self.frameElement).style("height", height + "px");
}