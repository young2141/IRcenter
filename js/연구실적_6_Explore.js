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

function check_data(json, major_list, sex) {
    var result = []
    var obj_temp = {}
    var majors = Object.keys(json[0]["전임교원_남자"])
    var prof_num = 0

    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "논문_전체": 0,
            "논문_국내_연구재단": 0,
            "논문_국내_기타": 0,
            "논문_국제_SCI": 0,
            "논문_국제_기타": 0,
            "논문_전체_1인당": 0,
            "논문_국내_연구재단_1인당": 0,
            "논문_국내_기타_1인당": 0,
            "논문_국제_SCI_1인당": 0,
            "논문_국제_기타_1인당": 0,
            "저역서_전체": 0,
            "저역서_저서": 0,
            "저역서_역서": 0,
            "저역서_전체_1인당": 0,
            "저역서_저서_1인당": 0,
            "저역서_역서_1인당": 0
        }

        prof_num = 0

        for (var j = 0; j < majors.length; j++) {
            if ($.inArray(majors[j], major_list) == -1) continue

            if (sex == "(전체)") {
                if (json[i]["전임교원_남자"][majors[j]] != "" && json[i]["전임교원_남자"][majors[j]] != 0)
                    prof_num += json[i]["전임교원_남자"][majors[j]]
                if (json[i]["전임교원_여자"][majors[j]] != "" && json[i]["전임교원_여자"][majors[j]] != 0)
                    prof_num += json[i]["전임교원_여자"][majors[j]]

                if (json[i]["국내_연구재단_남자"][majors[j]] != "" && json[i]["국내_연구재단_남자"][majors[j]] != 0)
                    obj_temp["논문_국내_연구재단"] += json[i]["국내_연구재단_남자"][majors[j]]
                if (json[i]["국내_연구재단_여자"][majors[j]] != "" && json[i]["국내_연구재단_여자"][majors[j]] != 0)
                    obj_temp["논문_국내_연구재단"] += json[i]["국내_연구재단_여자"][majors[j]]

                if (json[i]["국내_기타_남자"][majors[j]] != "" && json[i]["국내_기타_남자"][majors[j]] != 0)
                    obj_temp["논문_국내_기타"] += json[i]["국내_기타_남자"][majors[j]]
                if (json[i]["국내_기타_여자"][majors[j]] != "" && json[i]["국내_기타_여자"][majors[j]] != 0)
                    obj_temp["논문_국내_기타"] += json[i]["국내_기타_여자"][majors[j]]

                if (json[i]["국제_SCI_남자"][majors[j]] != "" && json[i]["국제_SCI_남자"][majors[j]] != 0)
                    obj_temp["논문_국제_SCI"] += json[i]["국제_SCI_남자"][majors[j]]
                if (json[i]["국제_SCI_여자"][majors[j]] != "" && json[i]["국제_SCI_여자"][majors[j]] != 0)
                    obj_temp["논문_국제_SCI"] += json[i]["국제_SCI_여자"][majors[j]]

                if (json[i]["국제_기타_남자"][majors[j]] != "" && json[i]["국제_기타_남자"][majors[j]] != 0)
                    obj_temp["논문_국제_기타"] += json[i]["국제_기타_남자"][majors[j]]
                if (json[i]["국제_기타_여자"][majors[j]] != "" && json[i]["국제_기타_여자"][majors[j]] != 0)
                    obj_temp["논문_국제_기타"] += json[i]["국제_기타_여자"][majors[j]]

                if (json[i]["저서_남자"][majors[j]] != "" && json[i]["저서_남자"][majors[j]] != 0)
                    obj_temp["저역서_저서"] += json[i]["저서_남자"][majors[j]]
                if (json[i]["저서_여자"][majors[j]] != "" && json[i]["저서_여자"][majors[j]] != 0)
                    obj_temp["저역서_저서"] += json[i]["저서_여자"][majors[j]]

                if (json[i]["역서_남자"][majors[j]] != "" && json[i]["역서_남자"][majors[j]] != 0)
                    obj_temp["저역서_역서"] += json[i]["역서_남자"][majors[j]]
                if (json[i]["역서_여자"][majors[j]] != "" && json[i]["역서_여자"][majors[j]] != 0)
                    obj_temp["저역서_역서"] += json[i]["역서_여자"][majors[j]]
            }
            else {
                if (json[i]["전임교원_" + sex][majors[j]] != "" && json[i]["전임교원_" + sex][majors[j]] != 0)
                    prof_num += json[i]["전임교원_" + sex][majors[j]]

                if (json[i]["국내_연구재단_" + sex][majors[j]] != "" && json[i]["국내_연구재단_" + sex][majors[j]] != 0)
                    obj_temp["논문_국내_연구재단"] += json[i]["국내_연구재단_" + sex][majors[j]]

                if (json[i]["국내_기타_" + sex][majors[j]] != "" && json[i]["국내_기타_" + sex][majors[j]] != 0)
                    obj_temp["논문_국내_기타"] += json[i]["국내_기타_" + sex][majors[j]]

                if (json[i]["국제_SCI_" + sex][majors[j]] != "" && json[i]["국제_SCI_" + sex][majors[j]] != 0)
                    obj_temp["논문_국제_SCI"] += json[i]["국제_SCI_" + sex][majors[j]]

                if (json[i]["국제_기타_" + sex][majors[j]] != "" && json[i]["국제_기타_" + sex][majors[j]] != 0)
                    obj_temp["논문_국제_기타"] += json[i]["국제_기타_" + sex][majors[j]]

                if (json[i]["저서_" + sex][majors[j]] != "" && json[i]["저서_" + sex][majors[j]] != 0)
                    obj_temp["저역서_저서"] += json[i]["저서_" + sex][majors[j]]

                if (json[i]["역서_" + sex][majors[j]] != "" && json[i]["역서_" + sex][majors[j]] != 0)
                    obj_temp["저역서_역서"] += json[i]["역서_" + sex][majors[j]]
            }
        }
            
        obj_temp["논문_전체"] = obj_temp["논문_국내_연구재단"] + obj_temp["논문_국내_기타"] + obj_temp["논문_국제_SCI"] + obj_temp["논문_국제_기타"]
        obj_temp["저역서_전체"] = obj_temp["저역서_저서"] + obj_temp["저역서_역서"]
        
        obj_temp["논문_전체_1인당"] = (obj_temp["논문_전체"] / prof_num).toFixed(4)
        obj_temp["논문_국내_연구재단_1인당"] = (obj_temp["논문_국내_연구재단"] / prof_num).toFixed(4)
        obj_temp["논문_국내_기타_1인당"] = (obj_temp["논문_국내_기타"] / prof_num).toFixed(4)
        obj_temp["논문_국제_SCI_1인당"] = (obj_temp["논문_국제_SCI"] / prof_num).toFixed(4)
        obj_temp["논문_국제_기타_1인당"] = (obj_temp["논문_국제_기타"] / prof_num).toFixed(4)

        obj_temp["저역서_전체_1인당"] = (obj_temp["저역서_전체"] / prof_num).toFixed(4)
        obj_temp["저역서_저서_1인당"] = (obj_temp["저역서_저서"] / prof_num).toFixed(4)
        obj_temp["저역서_역서_1인당"] = (obj_temp["저역서_역서"] / prof_num).toFixed(4)

        result.push(obj_temp)
    }

    return result
}

function draw_graph(_sort0, _sort1, _major, _sex) {
    parse1(json1=> {
        parse2(json2 => {
            am4core.ready(function () {
                if (_sort0 == "논문" && _sort1 == "") {
                    jdata = check_data(json2, _major, _sex)
                    am4core.disposeAllCharts();
                }

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                var _gpindex = (_sort0 == "논문" ? 0 : 2)
                _gpindex += (_sort1 == "" ? 1 : 2)
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

                var span_legend = document.getElementsByName("span_legend_" + _sort0)
                // console.log(span_legend_all.id)
                var index = 0

                // Create series
                function createSeries(name, message) {
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.name = name
                    series.dataFields.categoryX = "year"
                    series.dataFields.valueY = name
                    series.strokeWidth = 3;

                    series.sequencedInterpolation = true;

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 4;
                    bullet.circle.strokeWidth = 3;
                    bullet.tooltipText = "{categoryX}학년도 " + (_sort1 == "" ? "" : "전임교원 1인당 ") + message + " 실적은 [bold]{valueY}" + (_sort0 == "논문" ? "편" : "권") + "[/]입니다.";

                    series.strokeDasharray = ["dotted"];
                    if (name.indexOf("전체") == -1)
                        series.strokeDasharray = "2, 2";

                    series.stroke = am4core.color(span_legend[index].style.color)
                    bullet.circle.stroke = am4core.color(span_legend[index].style.color)
                    bullet.circle.fill = am4core.color(span_legend[index].style.color)
                    bullet.fill = am4core.color(span_legend[index++].style.color)

                }

                if (_sort0 == "논문") {
                    createSeries("논문_전체" + _sort1, "전체 논문")
                    createSeries("논문_국내_연구재단" + _sort1, "연구재단등재지(후보포함)")
                    createSeries("논문_국내_기타" + _sort1, "기타국내발간일반학술지")
                    createSeries("논문_국제_SCI" + _sort1, "SCI급/SCOPUS학술지")
                    createSeries("논문_국제_기타" + _sort1, "기타국제발간일반학술지")
                }
                else {
                    createSeries("저역서_전체" + _sort1, "전체 저역서")
                    createSeries("저역서_저서" + _sort1, "저서")
                    createSeries("저역서_역서" + _sort1, "역서")
                }

                // Legend
                // chart.legend = new am4charts.Legend();

            }); // end am4core.ready()
        })
    })
}