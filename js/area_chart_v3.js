// set the dimensions and margins of the graph
var margin = { top: 10, right: 230, bottom: 100, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var colorArray12 = ['#FE4459', '#FCFF57', '#006400', '#E8A343', '#43E884', '#46FFFF', '#0078FF', '#3D0099', '#F261AA', '#030066', '#990085', '#A6A6A6']
var colorArray6 = ['#FE4459', '#E8A343', '#FCFF57', '#43E884', '#006400', '#46FFFF']
var gradArray = ['graduate_', 'undergraduate_']
var genderArray = ['male_', 'female_']
var degreeArray = ['doctor', 'master', 'college']

var draw_code
var draw_mode

function drawChart(mode) {
    draw_mode = mode
    var chartTypeBox = document.getElementById("chartTypeBox")
    d3.selectAll("svg").remove();
    if ($(":input:radio[name='Gtype']:checked").attr('id') == 'stacked') {
        chartTypeBox.innerHTML = "누적 영역형 차트"
        height = 600 - margin.top - margin.bottom;
        stackedAreaChart()
    }
    else {
        chartTypeBox.innerHTML = "영역형 차트"
        multiplesAreaChart()
    }
}

function mouseOver(key) {
    d3.selectAll(".myArea").style("opacity", .1)
    // expect the one that is hovered
    d3.select("." + key).style("opacity", 1)
}

function mouseLeave() {
    d3.selectAll(".myArea").style("opacity", 1)
}

function GetDrawCode() {
    var result = 0;

    if ($("#grad option:selected").val() == 'all') {
        result += Math.pow(2, 0) + Math.pow(2, 1)
    }
    else if ($("#grad option:selected").val() == 'graduate') {
        result += Math.pow(2, 0)
    }
    else if ($("#grad option:selected").val() == 'undergraduate') {
        result += Math.pow(2, 1)
    }

    // 학위 코드 부여
    if ($('input:checkbox[id="doctor"]').is(":checked") == true) {
        result += Math.pow(2, 2)
    }
    if ($('input:checkbox[id="master"]').is(":checked") == true) {
        result += Math.pow(2, 3)
    }
    if ($('input:checkbox[id="college"]').is(":checked") == true) {
        result += Math.pow(2, 4)
    }

    // 성별 코드 부여
    if ($("#gender option:selected").val() == 'all') {
        result += Math.pow(2, 5) + Math.pow(2, 6)
    }
    else if ($("#gender option:selected").val() == 'male') {
        result += Math.pow(2, 5)
    }
    else if ($("#gender option:selected").val() == 'female') {
        result += Math.pow(2, 6)
    }

    return result
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

    if (draw_mode == 'explore') {
        draw_code = GetDrawCode();

        for (var i = 0; i < 2; i++) { // 졸업 여부 확인
            if ((draw_code & Math.pow(2, i)) == 0) continue

            for (var j = 0; j < 3; j++) { // 학위 확인
                if ((draw_code & Math.pow(2, j + 2)) == 0) continue

                for (var k = 0; k < 2; k++) { // 성별 확인
                    if ((draw_code & Math.pow(2, k + 5)) == 0) continue

                    keys.push(gradArray[i] + genderArray[k] + degreeArray[j])
                    cls.push(colorArray12[6 * i + 3 * k + j])
                }
            }
        }
    }
    else {
        for (var i = 0; i < 2; i++) { // 졸업 여부 확인
            for (var j = 0; j < 3; j++) { // 학위 확인
                keys.push(gradArray[i] + degreeArray[j])
                cls.push(colorArray6[3 * i + j])
            }
        }
    }
    
    d3.json("../../../json/area_chart_data_v2.json", function (data) {
        var max_val = d3.max(data, function (d) {
            if (draw_mode == 'explore') {
                return d["undergraduate_male_doctor"] +
                d["undergraduate_female_doctor"] +
                d["undergraduate_male_master"] +
                d["undergraduate_female_master"] +
                d["undergraduate_male_college"] +
                d["undergraduate_female_college"] +
                d["graduate_male_doctor"] +
                d["graduate_female_doctor"] +
                d["graduate_male_master"] +
                d["graduate_female_master"] +
                d["graduate_male_college"] +
                d["graduate_female_college"]
            }
            else {
                return d["graduate_doctor"] +
                    d["graduate_master"] +
                    d["graduate_college"] +
                    d["undergraduate_doctor"] +
                    d["undergraduate_master"] +
                    d["undergraduate_college"]
            }
        }) + 500;
        var stackedData = d3.stack()
            .keys(keys)
            (data)
        drawAreaChart(svg, data, stackedData, keys, cls, max_val, height);
    });
}

function prevmultiplechart(cnt, svgarr, keys, colors) {
    var h = height / cnt;
    d3.json("../../../json/area_chart_data_v2.json", function (data) {
        var max_val = 0;
        for (var i = 0; i < cnt; i++) {
            var max_temp = d3.max(data, function (d) {
                return d[keys[i]];
            });
            
            if (max_temp > max_val)
                max_val = max_temp
        }

        max_val += 1000

        for (var i = 0; i < cnt; i++) {
            var stackedData = d3.stack()
                .keys([keys[i]])
                (data)
            drawAreaChart(svgarr[i], data, stackedData, [keys[i]], [colors[i]], max_val, h);
        }
    });
}
function multiplesAreaChart() {
    var check_cnt = 0; // 몇개의 영역이 그려져야되는지
    var svg_arr = [];
    
    var svg_index = 0;
    var keyArrayMult = []
    var colorArrayMult = []

    if (draw_mode == 'explore') {
        draw_code = GetDrawCode();

        for (var i = 0; i < 2; i++) { // 졸업 여부 확인
            if ((draw_code & Math.pow(2, i)) == 0) continue

            for (var j = 0; j < 3; j++) { // 학위 확인
                if ((draw_code & Math.pow(2, j + 2)) == 0) continue

                for (var k = 0; k < 2; k++) { // 성별 확인
                    if ((draw_code & Math.pow(2, k + 5)) == 0) continue

                    keyArrayMult[check_cnt] = gradArray[i] + genderArray[k] + degreeArray[j]
                    colorArrayMult[check_cnt] = colorArray12[6 * i + 3 * k + j]
                    check_cnt++
                }
            }
        }
    }
    else {
        for (var i = 0; i < 2; i++) { // 졸업 여부 확인
            for (var j = 0; j < 3; j++) { // 학위 확인
                keyArrayMult[check_cnt] = gradArray[i] + degreeArray[j]
                colorArrayMult[check_cnt] = colorArray6[3 * i + j]
                check_cnt++
            }
        }
    }
    
    
    height = 150 * check_cnt - margin.top - margin.bottom;
    // var h = height / check_cnt

    /*
    if ($(":input:radio[name=grad]:checked").attr('id') == 'all') {
        if ($(":input:radio[name=gender]:checked").attr('id') == 'all') check_cnt = 4;
        if ($(":input:radio[name=gender]:checked").attr('id') == 'male') check_cnt = 2;
        if ($(":input:radio[name=gender]:checked").attr('id') == 'female') check_cnt = 2;
    }
    else if ($(":input:radio[name=grad]:checked").attr('id') == 'graduate') {
        if ($(":input:radio[name=gender]:checked").attr('id') == 'all') check_cnt = 2;
        if ($(":input:radio[name=gender]:checked").attr('id') == 'male') check_cnt = 1;
        if ($(":input:radio[name=gender]:checked").attr('id') == 'female') check_cnt = 1;
    }
    else if ($(":input:radio[name=grad]:checked").attr('id') == 'undergraduate') {
        if ($(":input:radio[name=gender]:checked").attr('id') == 'all') check_cnt = 2;
        if ($(":input:radio[name=gender]:checked").attr('id') == 'male') check_cnt = 1;
        if ($(":input:radio[name=gender]:checked").attr('id') == 'female') check_cnt = 1;
    }
    */
    
    //선택된 갯수만큼만만 svg영역을 잡는다.
    for (var i = 0; i < check_cnt; i++) {
        var svg_temp = d3.select('#divchart' + (2 + i))
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", (height + margin.top + margin.bottom) / check_cnt)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        svg_arr.push(svg_temp)
    }

    prevmultiplechart(check_cnt, svg_arr, keyArrayMult, colorArrayMult);
}

function drawAreaChart(svg, data, stackedData, keys, cls, max_val, h) {
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
        .call(d3.axisBottom(x).tickValues([1949, 1960, 1970, 1980, 1990, 2000, 2010, 2019,]).tickFormat(d3.format("d")))

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, max_val])
        .range([h, 0]);

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