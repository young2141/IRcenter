function parse(callback) {
    $.getJSON("../../../json/full_time_teacher.json", json => {
        callback(json);
    });
}

function draw_graph(_sort1, _sort2, _sorts) {
    parse(json => {
        

        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            if (_sort2 == "수")
                var _gpindex = 1
            else if (_sort2 == "1인당학생수")
                var _gpindex = 2
            else
                var _gpindex = 3

            // Create chart instance
            var chart = am4core.create("chartdiv" + _gpindex, am4charts.XYChart);

            // Add data
            chart.data = []

            var keys = Object.keys(json[0])
            var jdata = new Object()
            for (var i = 0; i < json.length; i++) {
                jdata = new Object()
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j] == "year")
                        jdata[keys[j]] = json[i][keys[j]]
                    else {
                        if ($.inArray(keys[j], _sorts) == -1) continue

                        if ($.inArray(_sort1 + "_학생", Object.keys(jdata)) == -1) {
                            jdata[_sort1 + "_학생"] = json[i][keys[j]][_sort1 + "_학생"]
                            jdata[_sort1 + "_전임교원"] = json[i][keys[j]][_sort1 + "_전임교원"]
                            jdata[_sort1 + "_교원법정정원"] = json[i][keys[j]][_sort1 + "_교원법정정원"]
                        }
                        else {
                            jdata[_sort1 + "_학생"] += json[i][keys[j]][_sort1 + "_학생"]
                            jdata[_sort1 + "_전임교원"] += json[i][keys[j]][_sort1 + "_전임교원"]
                            jdata[_sort1 + "_교원법정정원"] += json[i][keys[j]][_sort1 + "_교원법정정원"]
                        }
                    }
                }

                if (_sort2 == "1인당학생수") {
                    jdata[_sort1 + "_" + _sort2] = (jdata[_sort1 + "_학생"] / jdata[_sort1 + "_전임교원"]).toFixed(2)
                    delete jdata[_sort1 + "_학생"]
                    delete jdata[_sort1 + "_전임교원"]
                    delete jdata[_sort1 + "_교원법정정원"]
                }
                else if (_sort2 == "확보율") {
                    jdata[_sort1 + "_" + _sort2] = (100 * jdata[_sort1 + "_전임교원"] / jdata[_sort1 + "_교원법정정원"]).toFixed(2)
                    delete jdata[_sort1 + "_학생"]
                    delete jdata[_sort1 + "_전임교원"]
                    delete jdata[_sort1 + "_교원법정정원"]
                }
                chart.data.push(jdata)
            }

            // console.log(JSON.stringify(chart.data))
            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.cellStartLocation = 0.15;
            categoryAxis.renderer.cellEndLocation = 0.85;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            // valueAxis.renderer.inside = true;
            // valueAxis.renderer.labels.template.disabled = true;
            valueAxis.extraMax = 0.15;
            // min 설정
            if (_sort2 == "확보율")
                valueAxis.extraMin = 0.15;
            else
                valueAxis.min = 0;

            // break 설정
            /*
            if (_sort2 == "수") {
                var axisBreak = valueAxis.axisBreaks.create();
                axisBreak.startValue = 4000;
                axisBreak.endValue = 24000;
                axisBreak.breakSize = 0.03;
                valueAxis.extraMax = 0.03;
                chart.zoomOutButton.disabled = true;
            }
            */

            var span_legend = document.getElementsByName("span_legend")
            var index = 0
            // Create series
            function createSeries(name) {
                if (_sort2 == "수") {
                    // Set up series
                    var series = chart.series.push(new am4charts.ColumnSeries());
                    series.name = name
                    series.dataFields.categoryX = "year";
                    series.dataFields.valueY = name
                    series.sequencedInterpolation = true;

                    // Make it stacked
                    // series.stacked = true;

                    // Configure columns
                    series.columns.template.width = am4core.percent(100);
                    series.columns.template.tooltipText = "{categoryX}학년도 " + _sort1 + " " + name.slice(_sort1.length + 1) + " 수는 [bold]{valueY}명 [/]입니다.";

                    series.columns.template.stroke = am4core.color(span_legend[index].style.color)
                    series.columns.template.fill = am4core.color(span_legend[index++].style.color)

                    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                    labelBullet.label.text = "{valueY}";
                    labelBullet.label.fontSize = 16;
                    labelBullet.label.rotation = 270
                    labelBullet.label.truncate = false;
                    // labelBullet.label.hideOversized = false;
                    labelBullet.label.horizontalCenter = "center"
                    labelBullet.label.verticalCenter = "middle"
                    labelBullet.label.dy = -2


                    // return series;
                }
                else if (_sort2 == "1인당학생수") {
                    // Set up series
                    var series = chart.series.push(new am4charts.ColumnSeries());
                    series.name = name
                    series.dataFields.categoryX = "year";
                    series.dataFields.valueY = name

                    series.sequencedInterpolation = true;

                    // Make it stacked
                    // series.stacked = true;

                    // Configure columns
                    series.columns.template.width = am4core.percent(100);
                    series.columns.template.tooltipText = "{categoryX}학년도 " + _sort1 + " 전임교원 1인 당 학생 수는 [bold]{valueY}명 [/]입니다.";
                }
                else {
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.name = name
                    series.dataFields.categoryX = "year"
                    series.dataFields.valueY = name
                    series.strokeWidth = 3;

                    series.sequencedInterpolation = true;

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 4;
                    bullet.circle.strokeWidth = 3;
                    bullet.tooltipText = "{categoryX}학년도 " + _sort1 + " 전임교원 확보율은 [bold]{valueY}% [/]입니다.";
                }
            }

            keys = Object.keys(chart.data[0])
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "year") continue
                createSeries(keys[i])
            }

            // Legend
            // chart.legend = new am4charts.Legend();

        }); // end am4core.ready()
    })
}