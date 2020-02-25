function lineGraph() {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/groupstack.json", json => {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart);

            // Add data
            chart.data = json;

            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.15;

            // axis break
            var axisBreak = valueAxis.axisBreaks.create();
            axisBreak.startValue = 1500;
            axisBreak.endValue = 3000;

            var span_legend = document.getElementsByName("span_legend");

            // 1번
            var lineSeries1 = chart.series.push(new am4charts.LineSeries());
            lineSeries1.name = "문예";
            lineSeries1.dataFields.valueY = "문예인원";
            lineSeries1.dataFields.categoryX = "year";
            lineSeries1.stroke = am4core.color(span_legend[6].style.color);
            lineSeries1.strokeWidth = 3;
            lineSeries1.strokeDasharray = ["2,2"];
            lineSeries1.tooltip.label.textAlign = "middle";
            var bullet1 = lineSeries1.bullets.push(new am4charts.Bullet());
            bullet1.fill = am4core.color(span_legend[6].style.color); // tooltips grab fill from parent by default
            bullet1.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle1 = bullet1.createChild(am4core.Circle);
            circle1.radius = 4;
            circle1.strokeWidth = 3;

            // 2번
            var lineSeries2 = chart.series.push(new am4charts.LineSeries());
            lineSeries2.name = "체육";
            lineSeries2.dataFields.valueY = "체육인원";
            lineSeries2.dataFields.categoryX = "year";
            lineSeries2.stroke = am4core.color(span_legend[5].style.color);
            lineSeries2.strokeWidth = 3;
            lineSeries2.strokeDasharray = ["2,2"];
            lineSeries2.tooltip.label.textAlign = "middle";
            var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
            bullet2.fill = am4core.color(span_legend[5].style.color); // tooltips grab fill from parent by default
            bullet2.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle2 = bullet2.createChild(am4core.Circle);
            circle2.radius = 4;
            circle2.strokeWidth = 3;

            // 3번
            var lineSeries3 = chart.series.push(new am4charts.LineSeries());
            lineSeries3.name = "취미";
            lineSeries3.dataFields.valueY = "취미인원";
            lineSeries3.dataFields.categoryX = "year";
            lineSeries3.stroke = am4core.color(span_legend[4].style.color);
            lineSeries3.strokeWidth = 3;
            lineSeries3.strokeDasharray = ["2,2"];
            lineSeries3.tooltip.label.textAlign = "middle";
            var bullet3 = lineSeries3.bullets.push(new am4charts.Bullet());
            bullet3.fill = am4core.color(span_legend[4].style.color); // tooltips grab fill from parent by default
            bullet3.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle3 = bullet3.createChild(am4core.Circle);
            circle3.radius = 4;
            circle3.strokeWidth = 3;

            // 4번
            var lineSeries4 = chart.series.push(new am4charts.LineSeries());
            lineSeries4.name = "봉사";
            lineSeries4.dataFields.valueY = "봉사인원";
            lineSeries4.dataFields.categoryX = "year";
            lineSeries4.stroke = am4core.color(span_legend[3].style.color);
            lineSeries4.strokeWidth = 3;
            lineSeries4.strokeDasharray = ["2,2"];
            lineSeries4.tooltip.label.textAlign = "middle";
            var bullet4 = lineSeries4.bullets.push(new am4charts.Bullet());
            bullet4.fill = am4core.color(span_legend[3].style.color); // tooltips grab fill from parent by default
            bullet4.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle4 = bullet4.createChild(am4core.Circle);
            circle4.radius = 4;
            circle4.strokeWidth = 3;

            // 5번
            var lineSeries5 = chart.series.push(new am4charts.LineSeries());
            lineSeries5.name = "종교";
            lineSeries5.dataFields.valueY = "종교인원";
            lineSeries5.dataFields.categoryX = "year";
            lineSeries5.stroke = am4core.color(span_legend[2].style.color);
            lineSeries5.strokeWidth = 3;
            lineSeries5.strokeDasharray = ["2,2"];
            lineSeries5.tooltip.label.textAlign = "middle";
            var bullet5 = lineSeries5.bullets.push(new am4charts.Bullet());
            bullet5.fill = am4core.color(span_legend[2].style.color); // tooltips grab fill from parent by default
            bullet5.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle5 = bullet5.createChild(am4core.Circle);
            circle5.radius = 4;
            circle5.strokeWidth = 3;

            // 6번
            var lineSeries6 = chart.series.push(new am4charts.LineSeries());
            lineSeries6.name = "학술";
            lineSeries6.dataFields.valueY = "학술인원";
            lineSeries6.dataFields.categoryX = "year";
            lineSeries6.stroke = am4core.color(span_legend[1].style.color);
            lineSeries6.strokeWidth = 3;
            lineSeries6.strokeDasharray = ["2,2"];
            lineSeries6.tooltip.label.textAlign = "middle";
            var bullet6 = lineSeries6.bullets.push(new am4charts.Bullet());
            bullet6.fill = am4core.color(span_legend[1].style.color); // tooltips grab fill from parent by default
            bullet6.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle6 = bullet6.createChild(am4core.Circle);
            circle6.radius = 4;
            circle6.strokeWidth = 3;

            // 7번
            var lineSeries7 = chart.series.push(new am4charts.LineSeries());
            lineSeries7.name = "사회";
            lineSeries7.dataFields.valueY = "사회인원";
            lineSeries7.dataFields.categoryX = "year";
            lineSeries7.stroke = am4core.color(span_legend[7].style.color);
            lineSeries7.strokeWidth = 3;
            lineSeries7.strokeDasharray = ["2,2"];
            lineSeries7.tooltip.label.textAlign = "middle";
            var bullet7 = lineSeries7.bullets.push(new am4charts.Bullet());
            bullet7.fill = am4core.color(span_legend[7].style.color); // tooltips grab fill from parent by default
            bullet7.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle7 = bullet7.createChild(am4core.Circle);
            circle7.radius = 4;
            circle7.strokeWidth = 3;

            // 전체
            var lineSeries8 = chart.series.push(new am4charts.LineSeries());
            lineSeries8.name = "전체";
            lineSeries8.dataFields.valueY = "총인원";
            lineSeries8.dataFields.categoryX = "year";
            lineSeries8.stroke = am4core.color(span_legend[0].style.color);
            lineSeries8.strokeWidth = 3;
            lineSeries8.propertyFields.strokeDasharray = "lineDash";
            lineSeries8.tooltip.label.textAlign = "middle";
            var bullet8 = lineSeries8.bullets.push(new am4charts.Bullet());
            bullet8.fill = am4core.color(span_legend[0].style.color); // tooltips grab fill from parent by default
            bullet8.tooltipText = "[#fff font-size: 15px]{categoryX}년\n {name}:[/][#fff font-size: 15px bold] {valueY}명[/]"
            var circle8 = bullet8.createChild(am4core.Circle);
            circle8.radius = 4;
            circle8.strokeWidth = 3;
        });


    }); // end am4core.ready()
}

function stackGraph() {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/groupstack.json", json => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv2", am4charts.XYChart);

            // Add data
            chart.data = json;

            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.15;
            valueAxis.calculateTotals = true;

            // Create series
            function createSeries(field, name) {

                // Set up series
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.name = name;
                series.dataFields.valueY = field;
                series.dataFields.categoryX = "year";
                series.sequencedInterpolation = true;

                // Make it stacked
                series.stacked = true;

                // Configure columns
                // series.columns.template.width = am4core.percent(60);
                var span_legend = document.getElementsByName("span_legend");
                if (name == "학술") {
                    series.fill = am4core.color(span_legend[1].style.color);
                }
                else if (name == "종교") {
                    series.fill = am4core.color(span_legend[2].style.color);
                }
                else if (name == "봉사") {
                    series.fill = am4core.color(span_legend[3].style.color);
                }
                else if (name == "취미") {
                    series.fill = am4core.color(span_legend[4].style.color);
                }
                else if (name == "체육") {
                    series.fill = am4core.color(span_legend[5].style.color);
                }
                else if (name == "문예") {
                    series.fill = am4core.color(span_legend[6].style.color);
                }
                else if (name == "사회") {
                    series.fill = am4core.color(span_legend[7].style.color);
                }
                series.tooltip.label.textAlign = "middle";
                series.columns.template.tooltipText = "[#fff font-size: 15px]{categoryX}년\n{name}:[/][#fff font-size: 15px bold] {valueY}개[/]";

                return series;
            }

            createSeries("사회", "사회");
            createSeries("문예", "문예");
            createSeries("체육", "체육");
            createSeries("취미", "취미");
            createSeries("봉사", "봉사");
            createSeries("종교", "종교");
            createSeries("학술", "학술");

            // Create series for total
            var totalSeries = chart.series.push(new am4charts.ColumnSeries());
            totalSeries.dataFields.valueY = "none";
            totalSeries.dataFields.categoryX = "year";
            totalSeries.stacked = true;
            totalSeries.hiddenInLegend = true;
            totalSeries.columns.template.strokeOpacity = 0;

            var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
            totalBullet.dy = -20;
            totalBullet.label.text = "{valueY.total}";
            totalBullet.label.hideOversized = false;
            totalBullet.label.fontSize = 16;
            // totalBullet.label.background.fill = totalSeries.stroke;
            totalBullet.label.background.fillOpacity = 0.2;
            totalBullet.label.padding(5, 10, 5, 10);
        }); // end am4core.ready()
    })
}