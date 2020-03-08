var jdata = []

function parse1(callback) {
    $.getJSON("../../../json/전공분류.json", json1 => {
        callback(json1);
    });
}

function parse2(callback) {
    $.getJSON("../../../json/research.json", json2 => {
        callback(json2);
    });
}

function check_data(json, major_dict, affiliation, sex) {
    var result = []
    var obj_temp = {}
    var majors = Object.keys(json[0]["전임교원_남자"])
    var prof_num = 0

    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "저서": 0,
            "역서": 0,
            "저서_1인당": 0,
            "역서_1인당": 0
        }

        prof_num = 0

        for (var j = 0; j < majors.length; j++) {
            if ($.inArray(major_dict[majors[j]], affiliation) == -1) continue

            if (sex == "(전체)") {
                if (json[i]["전임교원_남자"][majors[j]] != "" && json[i]["전임교원_남자"][majors[j]] != 0)
                    prof_num += json[i]["전임교원_남자"][majors[j]]
                if (json[i]["전임교원_여자"][majors[j]] != "" && json[i]["전임교원_여자"][majors[j]] != 0)
                    prof_num += json[i]["전임교원_여자"][majors[j]]

                if (json[i]["저서_남자"][majors[j]] != "" && json[i]["저서_남자"][majors[j]] != 0)
                    obj_temp["저서"] += json[i]["저서_남자"][majors[j]]
                if (json[i]["저서_여자"][majors[j]] != "" && json[i]["저서_여자"][majors[j]] != 0)
                    obj_temp["저서"] += json[i]["저서_여자"][majors[j]]

                if (json[i]["역서_남자"][majors[j]] != "" && json[i]["역서_남자"][majors[j]] != 0)
                    obj_temp["역서"] += json[i]["역서_남자"][majors[j]]
                if (json[i]["역서_여자"][majors[j]] != "" && json[i]["역서_여자"][majors[j]] != 0)
                    obj_temp["역서"] += json[i]["역서_여자"][majors[j]]
            }
            else {
                if (json[i]["전임교원_" + sex][majors[j]] != "" && json[i]["전임교원_" + sex][majors[j]] != 0)
                    prof_num += json[i]["전임교원_" + sex][majors[j]]

                if (json[i]["저서_" + sex][majors[j]] != "" && json[i]["저서_" + sex][majors[j]] != 0)
                    obj_temp["저서"] += json[i]["저서_" + sex][majors[j]]

                if (json[i]["역서_" + sex][majors[j]] != "" && json[i]["역서_" + sex][majors[j]] != 0)
                    obj_temp["역서"] += json[i]["역서_" + sex][majors[j]]
            }
        }
            
        obj_temp["저서_1인당"] = (obj_temp["저서"] / prof_num).toFixed(4)
        obj_temp["역서_1인당"] = (obj_temp["역서"] / prof_num).toFixed(4)

        result.push(obj_temp)
    }

    return result
}

function draw_graph(_sort1, _affiliation, _sex) {
    parse1(json1=> {

        parse2(json2 => {
                
            jdata = check_data(json2, json1, _affiliation, _sex)

            am4core.ready(function () {
                if (_sort1 == "") am4core.disposeAllCharts();

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                var _gpindex = (_sort1 == "" ? 1 : 2)
                // Create chart instance
                var chart = am4core.create("chartdiv" + _gpindex, am4charts.XYChart);

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

                var span_legend = document.getElementsByName("span_legend")
                // console.log(span_legend_all.id)
                var index = 0

                // Create series
                function createSeries(name) {
                    // Set up series
                    var series = chart.series.push(new am4charts.ColumnSeries());
                    series.name = name
                    series.dataFields.categoryX = "year";
                    series.dataFields.valueY = name

                    series.sequencedInterpolation = true;

                    // Make it stacked
                    series.stacked = true;

                    // Configure columns
                    series.columns.template.width = am4core.percent(60);
                    series.columns.template.stroke = am4core.color(span_legend[index].style.color)
                    series.columns.template.fill = am4core.color(span_legend[index++].style.color)
                    series.columns.template.tooltipText = "{categoryX}학년도 " + (_sort1 == "" ? "" : "전임교원 1인당 ") + name + " 실적은 [bold]{valueY}편 [/]입니다.";

                    // Add label
                    /*
                    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                    labelBullet.label.text = "{valueY}";
                    labelBullet.locationY = 0.5;
                    // labelBullet.label.hideOversized = true;
                    */

                    // return series;
                }

                createSeries("저서")
                createSeries("역서")

                // Legend
                // chart.legend = new am4charts.Legend();

            }); // end am4core.ready()
        })
    })
}