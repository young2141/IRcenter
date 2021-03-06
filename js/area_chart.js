﻿// set the dimensions and margins of the graph
var margin = { top: 10, right: 230, bottom: 100, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

function drawChart() {
    d3.selectAll("svg").remove();
    if ($(":input:radio[name=Gtype]:checked").attr('id') == 'stacked')
        stackedAreaChart()
    else 
        multiplesAreaChart()

}

function mouseOver(key) {
    d3.selectAll(".myArea").style("opacity", .1)
    // expect the one that is hovered
    d3.select("." + key).style("opacity", 1)
}

function mouseLeave() {
    d3.selectAll(".myArea").style("opacity", 1)
}

function stackedAreaChart() {
    // append the svg object to the body of the page
    var svg = d3.select("#divchart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var keys = []
    var cls = []

    if ($("select[name=grad] option:selected").attr('id') == 'all') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') {
            keys.push('graduate_male')
            keys.push('graduate_female')
            keys.push('undergraduate_male')
            keys.push('undergraduate_female')
            cls.push('#FE4459')
            cls.push('#E8A343')
            cls.push('#FCFF57')
            cls.push('#43E884')
        }
        else if ($("select[id=male] option:selected").attr('id') == 'male') {
            keys.push('graduate_male')
            keys.push('undergraduate_male')
            cls.push('#FE4459')
            cls.push('#FCFF57')
        }
        else if ($("select[id=female] option:selected").attr('id') == 'female') {
            keys.push('graduate_female')
            keys.push('undergraduate_female')
            cls.push('#E8A343')
            cls.push('#43E884')
        }
    }
    else if ($("select[name=grad] option:selected").attr('id') == 'graduate') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') {
            keys.push('graduate_male')
            keys.push('graduate_female')
            cls.push('#FE4459')
            cls.push('#E8A343')
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'male') {
            keys.push('graduate_male')
            cls.push('#FE4459')
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'female') {
            keys.push('graduate_female')
            cls.push('#E8A343')
        }
    }
    else if ($("select[name=grad] option:selected").attr('id') == 'undergraduate') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') {
            keys.push('undergraduate_male')
            keys.push('undergraduate_female')
            cls.push('#FCFF57')
            cls.push('#43E884')
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'male') {
            keys.push('undergraduate_male')
            cls.push('#FCFF57')
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'female') {
            keys.push('undergraduate_female')
            cls.push('#43E884')
        }
    }

    d3.json("../../../json/area_chart_data.json", function (data) {
        var max_val = d3.max(data, function (d) {
            return d["undergraduate_male"] + d["undergraduate_female"] + d["graduate_male"] + d["graduate_female"];
        })*1.15;
        max_val += (5000 - (max_val % 5000))
        var stackedData = d3.stack()
            .keys(keys.reverse())
            (data)
        console.log(stackedData);
        drawAreaChart(svg, data, stackedData, keys, cls.reverse(), max_val, height, max_val / 5000);
    });
}

function prevmultiplechart(cnt, svgarr, keys, colors) {
    var h = height / cnt;
    d3.json("../../../json/area_chart_data.json", function (data) {
        for (var i = 0; i < cnt; i++) {
            var max_val = d3.max(data, function (d) {
                return d[keys[i]];
            }) + 1000;
            var stackedData = d3.stack()
                .keys([keys[i]])
                (data)
            drawAreaChart(svgarr[i], data, stackedData, [keys[i]], [colors[i]], 25000, h, 5);
        }
    });
}
function multiplesAreaChart() {
    var check_cnt = 0; // 몇개의 영역이 그려져야되는지
    var svg_arr = [], svg1, svg2, svg3, svg4;
    var svg_index = 0;
    if ($("select[name=grad] option:selected").attr('id') == 'all') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') check_cnt = 4;
        if ($("select[name=gender] option:selected").attr('id') == 'male') check_cnt = 2;
        if ($("select[name=gender] option:selected").attr('id') == 'female') check_cnt = 2;
    }
    else if ($("select[name=grad] option:selected").attr('id') == 'graduate') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') check_cnt = 2;
        if ($("select[name=gender] option:selected").attr('id') == 'male') check_cnt = 1;
        if ($("select[name=gender] option:selected").attr('id') == 'female') check_cnt = 1;
    }
    else if ($("select[name=grad] option:selected").attr('id') == 'undergraduate') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') check_cnt = 2;
        if ($("select[name=gender] option:selected").attr('id') == 'male') check_cnt = 1;
        if ($("select[name=gender] option:selected").attr('id') == 'female') check_cnt = 1;
    }
    var h = height / check_cnt
    //선택된 갯수만큼만만 svg영역을 잡는다.
    if (check_cnt > 0) {
        svg1 = d3.select("#divchart2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", (height + margin.top + margin.bottom) / check_cnt)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        svg_arr.push(svg1)
    }
    if (check_cnt > 1) {
        svg2 = d3.select("#divchart3")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", (height + margin.top + margin.bottom) / check_cnt)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg_arr.push(svg2)
    }
    if (check_cnt > 2) {
        svg3 = d3.select("#divchart4")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", (height + margin.top + margin.bottom) / check_cnt)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg_arr.push(svg3)
    }
    if (check_cnt > 3) {
        svg4 = d3.select("#divchart5")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", (height + margin.top + margin.bottom) / check_cnt)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg_arr.push(svg4)
    }

    if ($("select[name=grad] option:selected").attr('id') == 'all') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') {
            prevmultiplechart(check_cnt, svg_arr, ['graduate_male', 'graduate_female', 'undergraduate_male', 'undergraduate_female'], ['#FE4459', '#E8A343', '#FCFF57', '#43E884']);
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'male') {
            prevmultiplechart(check_cnt, svg_arr, ['graduate_male', 'undergraduate_male'], ['#FE4459', '#FCFF57']);
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'female') {
            prevmultiplechart(check_cnt, svg_arr, ['graduate_female', 'undergraduate_female'], ['#E8A343', '#43E884']);
        }
    }
    else if ($("select[name=grad] option:selected").attr('id') == 'graduate') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') {
            prevmultiplechart(check_cnt, svg_arr, ['graduate_male', 'graduate_female'], ['#FE4459', '#E8A343']);
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'male') {
            prevmultiplechart(check_cnt, svg_arr, ['graduate_male'], ['#FE4459']);
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'female') {
            prevmultiplechart(check_cnt, svg_arr, ['graduate_female'], ['#E8A343']);
        }
    }
    else if ($("select[name=grad] option:selected").attr('id') == 'undergraduate') {
        if ($("select[name=gender] option:selected").attr('id') == 'all') {
            prevmultiplechart(check_cnt, svg_arr, ['undergraduate_male', 'undergraduate_female'], ['#FCFF57', '#43E884']);
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'male') {
            prevmultiplechart(check_cnt, svg_arr, ['undergraduate_male'], ['#FCFF57']);
        }
        else if ($("select[name=gender] option:selected").attr('id') == 'female') {
            prevmultiplechart(check_cnt, svg_arr, ['undergraduate_female'], ['#43E884']);
        }
    }
}

function drawAreaChart(svg, data, stackedData, keys, cls, max_val, h, tick) {
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(cls) //key 순서대로 색상 결정

    //////////
    // AXIS //
    //////////
    // Add X axis
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return String(d.year); }))
        .range([0, width]);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + h + ")") 
        .call(d3.axisBottom(x).tickValues([1946, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2019,]).tickFormat(d3.format("d")))

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, max_val])
        .range([h, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y).ticks(tick))

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
        .attr("stroke", "#000000")
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
}