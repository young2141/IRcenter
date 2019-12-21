// set the dimensions and margins of the graph
var margin = { top: 10, right: 230, bottom: 100, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

function firstselect() {
    d3.selectAll("svg").remove();
    th = height;
    if ($(":input:radio[name=graphtype]:checked").val() == 'multiples') {
        var check_cnt = 0;
        if ($(":input:checkbox[id=graduate]").is(":checked")) {
            if ($(":input:checkbox[id=male]").is(":checked")) check_cnt++;
            if ($(":input:checkbox[id=female]").is(":checked")) check_cnt++;
        }
        if ($(":input:checkbox[id=undergraduate]").is(":checked")) {
            if ($(":input:checkbox[id=male]").is(":checked")) check_cnt++;
            if ($(":input:checkbox[id=female]").is(":checked")) check_cnt++;
        }
        th = height / (check_cnt - 1)
        var svg2 = d3.select("#chart2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var svg3 = d3.select("#chart3")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var svg4 = d3.select("#chart4")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }
    
    // append the svg object to the body of the page
    var svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    

    var keys = []
    var cls = []

    if ($(":input:checkbox[id=graduate]").is(":checked")) {
        if ($(":input:checkbox[id=male]").is(":checked")) {
            keys.push('graduate_male')
            cls.push('#EAD27A')
            if ($(":input:radio[name=graphtype]:checked").val() == 'multiples') {
                d3.json("../json/area_chart_data.json", function (data) {
                    var stackedData = d3.stack()
                        .keys(['graduate_male'])
                        (data)
                    drawAreaChart(svg, data, stackedData, ['graduate_male'], ['#EAD27A'], 17000);
                });
            }
        }
        if ($(":input:checkbox[id=female]").is(":checked")) {
            keys.push('graduate_female')
            cls.push('#FFD173')
            if ($(":input:radio[name=graphtype]:checked").val() == 'multiples') {
                d3.json("../json/area_chart_data.json", function (data) {
                    var stackedData = d3.stack()
                        .keys(['graduate_female'])
                        (data)
                    drawAreaChart(svg2, data, stackedData, ['graduate_female'], ['#FFD173'], 17000);
                });
            }
        }
    }
    if ($(":input:checkbox[id=undergraduate]").is(":checked")) {
        if ($(":input:checkbox[id=male]").is(":checked")) {
            keys.push('undergraduate_male')
            cls.push('#8FB0C1')
            if ($(":input:radio[name=graphtype]:checked").val() == 'multiples') {
                d3.json("../json/area_chart_data.json", function (data) {
                    var stackedData = d3.stack()
                        .keys(['undergraduate_male'])
                        (data)
                    drawAreaChart(svg3, data, stackedData, ['undergraduate_male'], ['#8FB0C1'], 17000);
                });
            }
        }
        if ($(":input:checkbox[id=female]").is(":checked")) {
            keys.push('undergraduate_female')
            cls.push('#87B6C8')
            if ($(":input:radio[name=graphtype]:checked").val() == 'multiples') {
                d3.json("../json/area_chart_data.json", function (data) {
                    var stackedData = d3.stack()
                        .keys(['undergraduate_female'])
                        (data)
                    drawAreaChart(svg4, data, stackedData, ['undergraduate_female'], ['#87B6C8'], 17000);
                });
            }
        }
    }
    if ($(":input:radio[name=graphtype]:checked").val() == 'stacked') {
        d3.json("../json/area_chart_data.json", function (data) {
            //stack the data?
            var stackedData = d3.stack()
                .keys(keys)
                (data)
            drawAreaChart(svg, data, stackedData, keys, cls, 30000);
        });
    }

}


function drawAreaChart(svg, data, stackedData, keys, cls, max_val) {
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(cls) //key 순서대로 색상 결정
    console.log(stackedData)
    //////////
    // AXIS //
    //////////
    // Add X axis
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, width]);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, max_val])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))


    // Create the scatter variable: where both the circles and the brush take place
    var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")

    // Area generator
    var area = d3.area()
        .x(function (d) { return x(d.data.year); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })

    // Show the areas
    areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", function (d) { return "myArea " + d.key })
        .style("fill", function (d) { return color(d.key); })
        .attr("d", area)

    //////////
    // HIGHLIGHT GROUP //
    //////////
    // What to do when one group is hovered
    var highlight = function (d) {
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .1)
        // expect the one that is hovered
        d3.select("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function (d) {
        d3.selectAll(".myArea").style("opacity", 1)
    }
    //////////
    // LEGEND //
    //////////
    // Add one dot in the legend for each name.
    var size = 20
    svg.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 640)
        .attr("y", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) { return color(d) })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 640 + size * 1.2)
        .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) { return color(d) })
        .text(function (d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
}