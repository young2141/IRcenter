function drawChart(){
    am4core.ready(function () {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // Create chart instance
                var chart = am4core.create("chartdiv", am4charts.XYChart);
                chart.colors.step = 3;

                // Add data
                chart.data = [{
                    "y": 10,
                    "x": 14,
                    "value": 59,
                    "y2": -5,
                    "x2": -3,
                    "value2": 44
                }, {
                    "y": 5,
                    "x": 3,
                    "value": 50,
                    "y2": -15,
                    "x2": -8,
                    "value2": 12
                }, {
                    "y": -10,
                    "x": 8,
                    "value": 19,
                    "y2": -4,
                    "x2": 6,
                    "value2": 35
                }, {
                    "y": -6,
                    "x": 5,
                    "value": 65,
                    "y2": -5,
                    "x2": -6,
                    "value2": 168
                }, {
                    "y": 15,
                    "x": -4,
                    "value": 92,
                    "y2": -10,
                    "x2": -8,
                    "value2": 102
                }, {
                    "y": 13,
                    "x": 1,
                    "value": 8,
                    "y2": -2,
                    "x2": 0,
                    "value2": 41
                }, {
                    "y": 1,
                    "x": 6,
                    "value": 35,
                    "y2": 0,
                    "x2": -3,
                    "value2": 16
                }];

                // Create axes
                var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
                xAxis.renderer.minGridDistance = 50;

                var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
                yAxis.renderer.minGridDistance = 50;

                // Create series #1
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = "y";
                series.dataFields.valueX = "x";
                series.dataFields.value = "value";
                series.strokeOpacity = 0;
                series.name = "Series 1";

                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.strokeOpacity = 0.2;
                bullet.stroke = am4core.color("#ffffff");
                bullet.nonScalingStroke = true;
                bullet.tooltipText = "x:{valueX} y:{valueY}";
                series.heatRules.push({
                    target: bullet.circle,
                    min: 10,
                    max: 60,
                    property: "radius"
                });

                // Create series #2
                var series2 = chart.series.push(new am4charts.LineSeries());
                series2.dataFields.valueY = "y2";
                series2.dataFields.valueX = "x2";
                series2.dataFields.value = "value2";
                series2.strokeOpacity = 0;
                series2.name = "Series 2";

                var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
                bullet2.tooltipText = "x:{valueX} y:{valueY}";
                bullet2.layout = "absolute";
                bullet2.rotation = 45;
                bullet2.width = 10;
                bullet2.height = 10;

                series2.heatRules.push({
                    target: bullet2.circle,
                    min: 20,
                    max: 40,
                    property: "radius"
                });

            }); // end am4core.ready()
}