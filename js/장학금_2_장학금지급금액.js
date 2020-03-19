var jdata = []

function parse1(callback) {
    $.getJSON("../../../json/전공분류.json", json1 => {
        callback(json1);
    });
}

function parse2(callback, path) {
    $.getJSON("../../../json/" + path, json2 => {
        callback(json2);
    });
}

function check_data(json, major_dict, semester, affiliation, type) {
    var result = []
    var obj_temp = {}
    var keys = []
    var keys2 = []

    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "재학생": 0,
            "총" : 0,
            "1인당" : 0
        }

        keys = Object.keys(json[i])

        for (var j = 0; j < keys.length; j++) {
            if (keys[j] == "year" || (major_dict[keys[j]] != affiliation + "계열" && affiliation != "(전체)")) continue

            obj_temp["재학생"] += json[i][keys[j]]["재학생"]

            keys2 = Object.keys(json[i][keys[j]])
            for (var k = 0; k < keys2.length; k++) {
                if (keys2[k] != "재학생" && keys2[k] != "수혜인원") {
                    if ($.inArray(keys2[k], type) != -1)
                        obj_temp["총"] += json[i][keys[j]][keys2[k]]
                }
            }
        }

        obj_temp["1인당"] = (obj_temp["총"] / obj_temp["재학생"]).toFixed(2)

        result.push(obj_temp)
    }

    return result
}

function draw_graph(_sort1, _sem, _aff, _type) {
    parse1(json1=> {

        parse2(json2 => {

            if (_sort1 == 1)
                jdata = check_data(json2, json1, _sem, _aff, _type)

            am4core.ready(function () {
                if (_sort1 == 1) am4core.disposeAllCharts();

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // Create chart instance
                var chart = am4core.create("chartdiv" + _sort1, am4charts.XYChart);

                // Add data
                chart.data = jdata

                console.log(JSON.stringify(chart.data))

                // Create axes
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "year";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 30;

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                // valueAxis.renderer.inside = true;
                // valueAxis.renderer.labels.template.disabled = true;
                valueAxis.min = 0;
                valueAxis.extraMax = 0.15;
                // valueAxis.extraMin = 0.15;

                if (_sort1 == 1) { // 장학금 지급 현황
                    // Set up series
                    var series = chart.series.push(new am4charts.ColumnSeries());
                    series.name = name
                    series.dataFields.categoryX = "year";
                    series.dataFields.valueY = "총"

                    // series.sequencedInterpolation = true;

                    // Make it stacked
                    // series.stacked = true;

                    // Configure columns
                    series.columns.template.width = am4core.percent(60);
                    // series.columns.template.stroke = am4core.color(span_legend[index].style.color)
                    // series.columns.template.fill = am4core.color(span_legend[index++].style.color)
                    series.columns.template.tooltipText = "{categoryX}학년도에 지급된 장학금은 [bold]{valueY}천원 [/]입니다.";

                    // Add label
                    /*
                    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                    labelBullet.label.text = "{valueY}";
                    labelBullet.locationY = 0.5;
                    // labelBullet.label.hideOversized = true;
                    */

                    // return series;
                }
                else { // 재학생 1인당 장학금
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.name = name
                    series.dataFields.categoryX = "year"
                    series.dataFields.valueY = "1인당"
                    series.strokeWidth = 3;

                    // series.sequencedInterpolation = true;

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 4;
                    bullet.circle.strokeWidth = 3;
                    bullet.tooltipText = "{categoryX}학년도 재학생 1인당 장학금은 [bold]{valueY}천원 [/]입니다.";
                }

                // Legend
                // chart.legend = new am4charts.Legend();

            }); // end am4core.ready()
        }, "scholarship_" + _sem + ".json")
    })
}