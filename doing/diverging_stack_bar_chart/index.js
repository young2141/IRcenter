function drawDivergingStackChart(chartid) {
    var margin = { top: 50, right: 300, bottom: 10, left: 100 },
        width = 1000 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    var flag = false;
    var y = d3.scale.ordinal().rangeRoundBands([0, height], .4);

    var x = d3.scale.linear()
        .rangeRound([0, width]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        
    var color = d3.scale.ordinal()
        .range(["#990000", "#cc3333", "ff9999", "#99ccff", "#6699ff", "#3366ff"]);

    var svg = d3.select("#" + chartid).append("svg")
        .attr("width", width + margin.left + margin.right + 300)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(["Strongly disagree", "Disagree", "Somewhat disagree", "Somewhat agree", "Agree", "Strongly agree"]);

    d3.json("data.json", function (error, data) {
        rate_arr = [];
        data.forEach(function (d) {
            // 퍼센티지를 구해서 다시 json에 추가한다.
            d["Strongly disagree"] = +d[1] * 100 / d.N;
            d["Disagree"] = +d[2] * 100 / d.N;
            d["Somewhat disagree"] = +d[3] * 100 / d.N;
            d["Somewhat agree"] = +d[4] * 100 / d.N;
            d["Agree"] = +d[5] * 100 / d.N;
            d["Strongly agree"] = +d[6] * 100 / d.N;
            rate_arr = { "dr": d["Somewhat disagree"] + d["Disagree"] + d["Strongly disagree"], "ar": d["Somewhat agree"] + d["Agree"] + d["Strongly agree"] }
            var x0 = -1 * (d["Somewhat disagree"] + d["Disagree"] + d["Strongly disagree"]);
            var idx = 0;
            d.boxes = color.domain().map(function (name) { return { name: name, x0: x0, x1: x0 += +d[name], N: + d.N, n: +d[idx += 1] }; });
        });
        var min_val = d3.min(data, function (d) {
            return d.boxes["0"].x0;
        });

        var max_val = d3.max(data, function (d) {
            return d.boxes["5"].x1;
        });

        x.domain([min_val, max_val]).nice();
        y.domain(data.map(function (d) { return d.year; }));

        var vakken = svg.selectAll(".year")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) { return "translate(180," + y(d.year) + ")"; });

        var bars = vakken.selectAll("rect")
            .data(function (d) { return d.boxes; })
            .enter().append("g").attr("class", "subbar");

        bars.append("rect")
            //.attr("class", function (d) { return d.name})
            .attr("height", y.rangeBand())
            .attr("value", "false")
            .attr("x", function (d) { return x(d.x0); })
            .attr("width", function (d) { return x(d.x1) - x(d.x0); })
            .style("fill", function (d) { return color(d.name); })
            .on("mouseover", function () { tooltip.style("display", null); })
            .on("mouseout", function () { tooltip.style("display", "none"); })
            .on("mousemove", function (d) {
                tooltip.style("left", (d3.event.pageX) + "px");
                tooltip.style("top", (d3.event.pageY + 20) + "px");
                tooltip.html("<strong><p style='font:15px'>" + d.name + "</strong>" + "<br><strong>" + d.n + "(" + Math.round(d.n / d.N * 100) + "%)" + "</strong><br>기말고사 성적에 만족하시나요. 그리고 툴팁길이는 어느정도까지 늘어나나요");
            })
            .on("click", function (d) {
                d3.selectAll("g").select("rect").style("opacity", 0.3);
                d3.select(this).style("border-coloer", "#ffffff").style("opacity", 1);
            });

        var tooltip = d3.select("body").append("div")
            .attr("class", "toolTip")
            .style("display", "none");
        /*
        bars.append("text")
            .attr("x", function (d) { return x(d.x0); })
            .attr("y", y.rangeBand() / 2)
            .attr("dy", "0.5em")
            .attr("dx", "0.5em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "begin")
            .text(function (d) { return d.n !== 0 && (d.x1 - d.x0) > 3 ? d.n : "" });
        */

        vakken.append("text")
            .attr("x", -150)
            .attr("y", y.rangeBand() / 2)
            .attr("dy", "0.5em")
            .attr("dx", "-1em")
            .style("fill", "#000000")
            .text(function (data) { return "N = " + String(data.N) });

        vakken.append("text")
            .attr("x", -30)
            .attr("y", y.rangeBand() / 2)
            .attr("dy", "0.5em")
            .attr("dx", "-1em")
            .style("fill", "#cc3333")
            .text(function (data) {return String(Math.round((data["1"] + data["2"] + data["3"]) / data.N * 100)) + "%"});

        vakken.append("text")
            .attr("x", 650)
            .attr("y", y.rangeBand() / 2)
            .attr("dy", "0.5em")
            .attr("dx", "0.5em")
            .style("fill", "#6699ff")
            .text(function (data) {return String(Math.round((data["4"] + data["5"] + data["6"]) / data.N * 100)) + "%" });

        //중앙선
        svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height)
            .attr("transform", function (d) { return "translate(180," + y(2019) + ")"; });
        
        //y축
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        /*
        var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
        // this is not nice, we should calculate the bounding box and use that
        var legend_tabs = [0, 120, 200, 340, 450, 520];
        var legend = startp.selectAll(".legend")
            .data(color.domain().slice())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });
    
        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);
    
        legend.append("text")
            .attr("x", 22)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "begin")
            .style("font", "10px sans-serif")
            .text(function (d) { return d; });
        */

        d3.selectAll(".axis path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")

        d3.selectAll(".axis line")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")
    });
}