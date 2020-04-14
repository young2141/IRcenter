var width_unit = 30
var colorset = {
    "행정직": "#dc67ce",
    "사서직": "#c767dc",
    "기술직": "#a367dc",
    "전산직": "#8067dc",
    "전문경력관": "#6771dc",
    "관리운영직": "#6794dc",
    "대학회계직": "#67b7dc"
}


function parse(callback, _title) {
    $.getJSON("../../../json/직원현황_4_" + _title + ".json", json => {
        callback(json);
    });
}

function filter_year(_json, _year) {
    for (var j = 0; j < _json.length; j++) {
        if (_json[j].year == _year) {
            return _json[j]
        }
    }
}

function find_max(_jdata, _pos) {
    var keys = Object.keys(_jdata)
    var max = 0

    for (var j = 0; j < keys.length; j++) {
        if (_pos.indexOf(keys[j]) != -1) {
            var keys2 = Object.keys(_jdata[keys[j]])

            for (var k = 0; k < keys2.length; k++) {
                if (_jdata[keys[j]][keys2[k]] > max) {
                    max = _jdata[keys[j]][keys2[k]]
                }
            }
        }
    }

    max *= 1.15
    max += (10 - (max % 10))

    return max
}

function get_data(_jdata, _pos1) {
    var result = []
    var obj_temp = {}

    var keys = Object.keys(_jdata)

    for (var j = 0; j < keys.length; j++) {
        if (keys[j] == _pos1) {
            var keys2 = Object.keys(_jdata[keys[j]])

            for (var k = 0; k < keys2.length; k++) {
                result.push({
                    "category" : keys2[k],
                    "value": _jdata[keys[j]][keys2[k]] == 0 ? null : _jdata[keys[j]][keys2[k]]
                })
            }
        }
    }

    return result
}

function draw_graph(_title, _year, _pos) {
    parse(json => {
       
        am4core.ready(function () {
            if (_title == "평균연령") {
                am4core.disposeAllCharts()
            }

            if (_pos.length == 0)
                return

            var jdata = filter_year(json, _year)
            var max_value = find_max(jdata, _pos)

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            for (var i = -1; i < _pos.length; i++) {
                var dv = (_title == "평균연령" ? 2 : 10) + i
                
                var chart = am4core.create("chartdiv" + dv, am4charts.XYChart);
                chart.paddingBottom = 120
                chart.data = (i != -1 ? get_data(jdata, _pos[i]) : []);
                if (i != -1)
                    document.getElementById("chartdiv" + dv).style.width = chart.data.length * width_unit + (_pos[i] == "대학회계직" ? 15 : 0)

                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataFields.category = "category";
                categoryAxis.renderer.minGridDistance = 15;
                categoryAxis.renderer.inside = true
                // categoryAxis.renderer.grid.template.location = 0.5;
                // categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
                categoryAxis.renderer.labels.template.rotation = -90;
                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                categoryAxis.renderer.labels.template.location = 0.5;
                categoryAxis.renderer.dx = -20
                // categoryAxis.renderer.dy = 10
             
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.max = max_value;
                valueAxis.min = 0
                if (i != -1) valueAxis.renderer.labels.template.disabled = true
                if (i == -1) categoryAxis.renderer.grid.template.disabled = true
                // valueAxis.extraMin = 0.15;
                // valueAxis.tooltip.disabled = true;
                // valueAxis.renderer.ticks.template.disabled = true;
                // valueAxis.renderer.axisFills.template.disabled = true;

                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryX = "category";
                series.dataFields.valueY = "value";
                series.sequencedInterpolation = true;
                series.strokeWidth = 3;
                series.stroke = colorset[_pos[i]]
                // series.columns.template.strokeOpacity = 0.5
                series.columns.template.width = 0.01;

                var bullet = series.bullets.create(am4charts.CircleBullet);
                bullet.circle.radius = 4;
                bullet.circle.strokeWidth = 3;
                bullet.fill = colorset[_pos[i]]
                bullet.circle.fill = colorset[_pos[i]]
                bullet.circle.stroke = colorset[_pos[i]]
                // bullet.circle.stroke.fillOpacity = 0
                bullet.tooltipText = _year + "학년도 " + _pos[i] + " 직원의 " + _title + (_title == "평균연령" ? "은 " : "는 ") + "{valueY.value}" + (_title == "평균연령" ? "세 입니다." : "년 입니다.");
                // bullet.tooltip.pointerOrientation = "horizontal";

                var title = chart.titles.create();
                title.text = (i == -1 ? "　" : _pos[i]);
                title.fontSize = 15;
                if (_pos[i] == "대학회계직")
                    title.dx = -15
                title.dy = -12;
                title.textAlign = "middle";


                // chart.cursor = new am4charts.XYCursor();

                // chart.scrollbarX = new am4core.Scrollbar();
                // chart.scrollbarY = new am4core.Scrollbar();
            }
        }); // end am4core.ready()
    }, _title)
}