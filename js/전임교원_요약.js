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
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j] == "year")
                        jdata[keys[j]] = json[i][keys[j]]
                    else {
                        jdata[keys[j] + "_" + _sort1 + "_" + _sort2] = json[i][keys[j]][_sort1 + "_" + _sort2]
                    }
                }
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

            // Create series
            function createSeries(name) {
                if (_sort2 == "1인당학생수") {
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
                }
            }

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "year") continue
                createSeries(keys[i])
            }

            // Legend
            // chart.legend = new am4charts.Legend();

        }); // end am4core.ready()
    })
}