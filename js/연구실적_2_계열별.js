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

function check_data(json, major_dict) {
    var result = []
    var obj_temp = {}
    var majors = Object.keys(json[0]["전임교원_남자"])

    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "논문_전체": 0,
            "논문_인문사회계열": 0,
            "논문_자연과학계열": 0,
            "논문_공학계열": 0,
            "논문_예체능계열": 0,
            "논문_의학계열": 0,
            "저역서_전체": 0,
            "저역서_인문사회계열": 0,
            "저역서_자연과학계열": 0,
            "저역서_공학계열": 0,
            "저역서_예체능계열": 0,
            "저역서_의학계열": 0,
        }

        for (var j = 0; j < majors.length; j++) {
            if (json[i]["국내_연구재단_남자"][majors[j]] != "" && json[i]["국내_연구재단_남자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국내_연구재단_남자"][majors[j]]
            if (json[i]["국내_연구재단_여자"][majors[j]] != "" && json[i]["국내_연구재단_여자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국내_연구재단_여자"][majors[j]]
            if (json[i]["국내_기타_남자"][majors[j]] != "" && json[i]["국내_기타_남자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국내_기타_남자"][majors[j]]
            if (json[i]["국내_기타_여자"][majors[j]] != "" && json[i]["국내_기타_여자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국내_기타_여자"][majors[j]]

            if (json[i]["국제_SCI_남자"][majors[j]] != "" && json[i]["국제_SCI_남자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국제_SCI_남자"][majors[j]]
            if (json[i]["국제_SCI_여자"][majors[j]] != "" && json[i]["국제_SCI_여자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국제_SCI_여자"][majors[j]]
            if (json[i]["국제_기타_남자"][majors[j]] != "" && json[i]["국제_기타_남자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국제_기타_남자"][majors[j]]
            if (json[i]["국제_기타_여자"][majors[j]] != "" && json[i]["국제_기타_여자"][majors[j]] != 0)
                obj_temp["논문_" + major_dict[majors[j]]] += json[i]["국제_기타_여자"][majors[j]]

            if (json[i]["저서_남자"][majors[j]] != "" && json[i]["저서_남자"][majors[j]] != 0)
                obj_temp["저역서_" + major_dict[majors[j]]] += json[i]["저서_남자"][majors[j]]
            if (json[i]["저서_여자"][majors[j]] != "" && json[i]["저서_여자"][majors[j]] != 0)
                obj_temp["저역서_" + major_dict[majors[j]]] += json[i]["저서_여자"][majors[j]]
            if (json[i]["역서_남자"][majors[j]] != "" && json[i]["역서_남자"][majors[j]] != 0)
                obj_temp["저역서_" + major_dict[majors[j]]] += json[i]["역서_남자"][majors[j]]
            if (json[i]["역서_여자"][majors[j]] != "" & json[i]["역서_여자"][majors[j]] != 0)
                obj_temp["저역서_" + major_dict[majors[j]]] += json[i]["역서_여자"][majors[j]]
        }
            
        obj_temp["논문_전체"] = obj_temp.논문_인문사회계열 + obj_temp.논문_자연과학계열 + obj_temp.논문_공학계열 + obj_temp.논문_예체능계열 + obj_temp.논문_의학계열
        obj_temp["저역서_전체"] = obj_temp.저역서_인문사회계열 + obj_temp.저역서_자연과학계열 + obj_temp.저역서_공학계열 + obj_temp.저역서_예체능계열 + obj_temp.저역서_의학계열

        result.push(obj_temp)
    }

    return result
}

function draw_graph(_sort1) {
    parse1(json1=> {

        parse2(json2 => {
                
            if (jdata.length == 0) {
                jdata = check_data(json2, json1)
            }

            am4core.ready(function () {
                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                var _gpindex = (_sort1 == "논문" ? 1 : 2)
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
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.name = name
                    series.dataFields.categoryX = "year"
                    series.dataFields.valueY = name
                    series.strokeWidth = 3;

                    series.sequencedInterpolation = true;

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 4;
                    bullet.circle.strokeWidth = 3;
                    bullet.tooltipText = "{categoryX}학년도 " + message + "은 [bold]{valueY}" + (_sort1 == "논문" ? "편" : "권") + "[/]입니다.";

                    series.strokeDasharray = ["dotted"];
                    if (name.indexOf("전체") == -1)
                        series.strokeDasharray = "2, 2";

                    series.stroke = am4core.color(span_legend[index].style.color)
                    bullet.circle.stroke = am4core.color(span_legend[index].style.color)
                    bullet.circle.fill = am4core.color(span_legend[index].style.color)
                    bullet.fill = am4core.color(span_legend[index++].style.color)
                            
                }

                if (_sort1 == "논문") {
                    createSeries("논문_전체", "전체 계열 논문 실적")
                    createSeries("논문_인문사회계열", "인문사회 계열 논문 실적")
                    createSeries("논문_자연과학계열", "자연과학 계열 논문 실적")
                    createSeries("논문_공학계열", "공학 계열 논문 실적")
                    createSeries("논문_예체능계열", "예체능 계열 논문 실적")
                    createSeries("논문_의학계열", "의학 계열 논문 실적")
                }
                else {
                    createSeries("저역서_전체", "전체 계열 저·역서 실적")
                    createSeries("저역서_인문사회계열", "인문사회 계열 저·역서 실적")
                    createSeries("저역서_자연과학계열", "자연과학 계열 저·역서 실적")
                    createSeries("저역서_공학계열", "공학 계열 저·역서 실적")
                    createSeries("저역서_예체능계열", "예체능 계열 저·역서 실적")
                    createSeries("저역서_의학계열", "의학 계열 저·역서 실적")
                }

                // Legend
                // chart.legend = new am4charts.Legend();

            }); // end am4core.ready()
        })
    })
}

draw_graph("논문")
draw_graph("저·역서")