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
            "국내논문_연구재단": 0,
            "국내논문_기타": 0,
            "국내논문_연구재단_1인당": 0,
            "국내논문_기타_1인당": 0
        }

        prof_num = 0

        for (var j = 0; j < majors.length; j++) {
            if ($.inArray(major_dict[majors[j]], affiliation) == -1) continue

            if (sex == "(전체)") {
                if (json[i]["전임교원_남자"][majors[j]] != "" && json[i]["전임교원_남자"][majors[j]] != 0)
                    prof_num += json[i]["전임교원_남자"][majors[j]]
                if (json[i]["전임교원_여자"][majors[j]] != "" && json[i]["전임교원_여자"][majors[j]] != 0)
                    prof_num += json[i]["전임교원_여자"][majors[j]]

                if (json[i]["국내_연구재단_남자"][majors[j]] != "" && json[i]["국내_연구재단_남자"][majors[j]] != 0)
                    obj_temp["국내논문_연구재단"] += json[i]["국내_연구재단_남자"][majors[j]]
                if (json[i]["국내_연구재단_여자"][majors[j]] != "" && json[i]["국내_연구재단_여자"][majors[j]] != 0)
                    obj_temp["국내논문_연구재단"] += json[i]["국내_연구재단_여자"][majors[j]]

                if (json[i]["국내_기타_남자"][majors[j]] != "" && json[i]["국내_기타_남자"][majors[j]] != 0)
                    obj_temp["국내논문_기타"] += json[i]["국내_기타_남자"][majors[j]]
                if (json[i]["국내_기타_여자"][majors[j]] != "" && json[i]["국내_기타_여자"][majors[j]] != 0)
                    obj_temp["국내논문_기타"] += json[i]["국내_기타_여자"][majors[j]]
            }
            else {
                if (json[i]["전임교원_" + sex][majors[j]] != "" && json[i]["전임교원_" + sex][majors[j]] != 0)
                    prof_num += json[i]["전임교원_" + sex][majors[j]]

                if (json[i]["국내_연구재단_" + sex][majors[j]] != "" && json[i]["국내_연구재단_" + sex][majors[j]] != 0)
                    obj_temp["국내논문_연구재단"] += json[i]["국내_연구재단_" + sex][majors[j]]

                if (json[i]["국내_기타_" + sex][majors[j]] != "" && json[i]["국내_기타_" + sex][majors[j]] != 0)
                    obj_temp["국내논문_기타"] += json[i]["국내_기타_" + sex][majors[j]]
            }
        }
            
        obj_temp["국내논문_연구재단_1인당"] = (obj_temp["국내논문_연구재단"] / prof_num).toFixed(4)
        obj_temp["국내논문_기타_1인당"] = (obj_temp["국내논문_기타"] / prof_num).toFixed(4)

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
                function createSeries(name, message) {
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
                    series.columns.template.tooltipText = "{categoryX}학년도 " + (_sort1 == "" ? "" : "전임교원 1인당 ") + message + " 실적은 [bold]{valueY}편 [/]입니다.";

                    // Add label
                    /*
                    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                    labelBullet.label.text = "{valueY}";
                    labelBullet.locationY = 0.5;
                    // labelBullet.label.hideOversized = true;
                    */

                    // return series;
                }

                createSeries("국내논문_연구재단" + _sort1, "연구재단등재지(후보포함)")
                createSeries("국내논문_기타" + _sort1, "기타국내발간일반학술지")

                // Legend
                // chart.legend = new am4charts.Legend();

            }); // end am4core.ready()
        })
    })
}