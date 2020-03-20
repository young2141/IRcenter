var jdata = []
var type = [["성적우수", "저소득층", "근로", "교직원", "기타", "국가", "지방자치단체", "사설 및 기타"],
    ["성적우수", "저소득층", "근로", "교직원", "기타"],
    ["국가", "지방자치단체", "사설 및 기타"]]
var scholarship = ["전체 장학금", "교내 장학금", "교외 장학금"]

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

function check_data(json, major_dict, sort, year, affiliation) {
    var result = []
    var result_temp = {}
    var obj_temp = {}
    var keys = []
    var keys2 = []

    for (var i = 0; i < type[sort].length; i++) {
        result_temp[type[sort][i]] = 0
    }

    for (var i = 0; i < json.length; i++) {
        if (json[i]["year"] != year) continue

        keys = Object.keys(json[i])

        for (var j = 0; j < keys.length; j++) {
            if (keys[j] == "year" || (major_dict[keys[j]] != affiliation + "계열" && affiliation != "(전체)")) continue

            keys2 = Object.keys(json[i][keys[j]])
            for (var k = 0; k < keys2.length; k++) {
                if (keys2[k] != "재학생" && keys2[k] != "수혜인원") {
                    if ($.inArray(keys2[k], type[sort]) != -1)
                        result_temp[keys2[k]] += json[i][keys[j]][keys2[k]]
                }
            }
        }
    }

    for (var i = 0; i < type[sort].length; i++) {
        obj_temp = {
            "category": type[sort][i],
            "value": result_temp[type[sort][i]]
        }

        result.push(obj_temp)
    }

    return result
}

function draw_graph(_sort1, _year, _sem, _aff) {
    parse1(json1=> {

        parse2(json2 => {

            jdata = check_data(json2, json1, _sort1 - 1, _year, _aff)

            am4core.ready(function () {
                if (_sort1 == 1) am4core.disposeAllCharts();

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // Create chart instance
                var chart = am4core.create("chartdiv" + _sort1, am4charts.PieChart);

                // Add data
                chart.data = jdata
                
                
                console.log(JSON.stringify(chart.data))

                var pieSeries = chart.series.push(new am4charts.PieSeries());
                if (_sort1 != 1) {
                    chart.radius = am4core.percent(40)
                    pieSeries.labels.template.fontSize = 14;
                }
                pieSeries.dataFields.value = "value";
                pieSeries.dataFields.category = "category";
                pieSeries.slices.template.strokeWidth = 2;
                pieSeries.slices.template.strokeOpacity = 1;
                pieSeries.slices.template.stroke = am4core.color("#ffffff");
                pieSeries.tooltip.getFillFromObject = false;
                pieSeries.slices.template.tooltipText =
                  "[#000]" + _year  + "학년도 " + _sem[0] + "학기 " + scholarship[_sort1 - 1] + " 중 {category} 장학금은 [bold]{value.percent.formatNumber('#.#')}%[] 입니다.";
                // 툴팁에 실제 value값도 필요하다면 ({value}명) 추가하기
                pieSeries.tooltip.label.fill = am4core.color("#000000");
                // This creates initial animation
                pieSeries.hiddenState.properties.opacity = 1;
                pieSeries.hiddenState.properties.endAngle = -90;
                pieSeries.hiddenState.properties.startAngle = -90;



            }); // end am4core.ready()
        }, "scholarship_" + _sem + ".json")
    })
}