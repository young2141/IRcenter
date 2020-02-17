function parse(callback) {
    $.getJSON("../../../json/full_time_teacher.json", json => {
        callback(json);
    });
}

function draw_graph(_sort1, _sort2) {
    parse(json => {
        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            var _gpindex = (_sort2 == "1인당학생수" ? 1 : 2)
            // Create chart instance
            var chart = am4core.create("chartdiv" + _gpindex, am4charts.XYChart);

            // Add data
            chart.data = []

            var keys = Object.keys(json[0])
            var jdata = new Object()
            for (var i = 0; i < json.length; i++) {
                jdata = new Object()
                jdata["전체_" + _sort1 + "_" + _sort2] = 0
                var quota = 0
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j] == "year")
                        jdata[keys[j]] = json[i][keys[j]]
                    else {
                        jdata["전체_" + _sort1 + "_" + _sort2] += json[i][keys[j]][_sort1 + "_확보율"] * json[i][keys[j]][_sort1 + "_교원법정정원"]
                        quota += json[i][keys[j]][_sort1 + "_교원법정정원"]
                        jdata[keys[j] + "_" + _sort1 + "_" + _sort2] = json[i][keys[j]][_sort1 + "_" + _sort2]
                    }
                }

                jdata["전체_" + _sort1 + "_" + _sort2] = (jdata["전체_" + _sort1 + "_" + _sort2] / quota).toFixed(2)
                chart.data.push(jdata)
            }

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

            var span_legend_all = document.getElementById("span_legend_all")
            var span_legend = document.getElementsByName("span_legend")
            console.log(span_legend.length)
            // console.log(span_legend_all.id)
            var index = 0

            // Create series
            function createSeries(name) {
                if (_sort2 == "1인당학생수") {
                    if (name == "전체") return

                    // Set up series
                    var series = chart.series.push(new am4charts.ColumnSeries());
                    series.name = name
                    series.dataFields.categoryX = "year";
                    series.dataFields.valueY = name + "_" + _sort1 + "_" + _sort2

                    series.sequencedInterpolation = true;

                    // Make it stacked
                    series.stacked = true;

                    // Configure columns
                    series.columns.template.width = am4core.percent(60);
                    series.columns.template.stroke = am4core.color(span_legend[index].style.color)
                    series.columns.template.fill = am4core.color(span_legend[index++].style.color)
                    series.columns.template.tooltipText = "{categoryX}학년도 {name}계열 " + _sort1 + " 전임교원 1인 당 학생 수는 [bold]{valueY}명 [/]입니다.";

                    // Add label
                    /*
                    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                    labelBullet.label.text = "{valueY}";
                    labelBullet.locationY = 0.5;
                    // labelBullet.label.hideOversized = true;
                    */

                    // return series;
                }
                else {
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.name = name
                    series.dataFields.categoryX = "year"
                    series.dataFields.valueY = name + "_" + _sort1 + "_" + _sort2
                    series.strokeWidth = 3;
                    
                    series.sequencedInterpolation = true;

                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 4;
                    bullet.circle.strokeWidth = 3;
                    bullet.tooltipText = "{categoryX}학년도 {name}계열 " + _sort1 + " 전임교원 확보율은 [bold]{valueY}% [/]입니다.";

                    series.strokeDasharray = ["dotted"];
                    if (name == "전체") {
                        series.stroke = am4core.color(span_legend_all.style.color)
                        bullet.circle.stroke = am4core.color(span_legend_all.style.color)
                        bullet.circle.fill = am4core.color(span_legend_all.style.color)
                        bullet.fill = am4core.color(span_legend_all.style.color)
                    }
                    else {
                        series.stroke = am4core.color(span_legend[index].style.color)
                        bullet.circle.stroke = am4core.color(span_legend[index].style.color)
                        bullet.circle.fill = am4core.color(span_legend[index].style.color)
                        bullet.fill = am4core.color(span_legend[index++].style.color)
                        series.strokeDasharray = "2, 2";
                    }
                }
            }

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "year") continue
                createSeries(keys[i])
            }
            createSeries("전체")

            // Legend
            // chart.legend = new am4charts.Legend();

        }); // end am4core.ready()
    })
}