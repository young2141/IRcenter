﻿var jdata = []

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

function check_data(json, major_dict, semester, affiliation) {
    var result = []
    var obj_temp = {}
    var keys = []
    var keys2 = []

    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "재학생": 0,
            "수혜인원": 0,
            "수혜율": 0
        }

        keys = Object.keys(json[i])

        for (var j = 0; j < keys.length; j++) {
            if (keys[j] == "year" || (major_dict[keys[j]] != affiliation + "계열" && affiliation != "(전체)")) continue

            obj_temp["재학생"] += json[i][keys[j]]["재학생"]
            obj_temp["수혜인원"] += json[i][keys[j]]["수혜인원"]
        }

        obj_temp["수혜율"] = (obj_temp["수혜인원"] * 100 / obj_temp["재학생"]).toFixed(2)

        result.push(obj_temp)
    }

    return result
}

function draw_graph(_sort1, _sem, _aff) {
    parse1(json1=> {

        parse2(json2 => {

            if (_sort1 == 1)
                jdata = check_data(json2, json1, _sem, _aff)

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
                valueAxis.extraMax = 0.15;
                valueAxis.extraMin = 0.15;

                if (_sort1 == 1) { // 장학금 지급 현황
                    var span_legend = document.getElementsByName("span_legend")
                    // console.log(span_legend_all.id)
                    var index = 0

                    function createSeries(name) {
                        // Set up series
                        var series = chart.series.push(new am4charts.ColumnSeries());
                        series.name = name
                        series.dataFields.categoryX = "year";
                        series.dataFields.valueY = name
                        series.clustered = false;

                        // series.sequencedInterpolation = true;

                        // Make it stacked
                        // series.stacked = true;

                        // Configure columns
                        series.columns.template.width = am4core.percent(name == "재학생" ? 70 : 40);
                        series.columns.template.stroke = am4core.color(span_legend[index].style.color)
                        series.columns.template.fill = am4core.color(span_legend[index++].style.color)
                        series.columns.template.tooltipText = "{categoryX}학년도 " + name + " 수는 [bold]{valueY}명 [/]입니다.";

                        // Add label
                        /*
                        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                        labelBullet.label.text = "{valueY}";
                        labelBullet.locationY = 0.5;
                        // labelBullet.label.hideOversized = true;
                        */

                        // return series;
                    }

                    createSeries("재학생")
                    createSeries("수혜인원")
                    
                }
                else { // 재학생 1인당 장학금
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.name = name
                    series.dataFields.categoryX = "year"
                    series.dataFields.valueY = "수혜율"
                    series.strokeWidth = 3;

                    // series.sequencedInterpolation = true;

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 4;
                    bullet.circle.strokeWidth = 3;
                    bullet.tooltipText = "{categoryX}학년도 장학금 수혜율은 [bold]{valueY}% [/]입니다.";
                }

                // Legend
                // chart.legend = new am4charts.Legend();

            }); // end am4core.ready()
        }, "scholarship_" + _sem + ".json")
    })
}