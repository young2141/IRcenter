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
                if (field == "학술인원") {
                    series.fill = am4core.color(span_legend[0].style.color);
                    series.stroke = am4core.color(span_legend[0].style.color);
                }
                else if (field == "종교인원") {
                    series.fill = am4core.color(span_legend[1].style.color);
                    series.stroke = am4core.color(span_legend[1].style.color);
                }
                else if (field == "봉사인원") {
                    series.fill = am4core.color(span_legend[2].style.color);
                    series.stroke = am4core.color(span_legend[2].style.color);
                }
                else if (field == "취미인원") {
                    series.fill = am4core.color(span_legend[3].style.color);
                    series.stroke = am4core.color(span_legend[3].style.color);
                }
                else if (field == "체육인원") {
                    series.fill = am4core.color(span_legend[4].style.color);
                    series.stroke = am4core.color(span_legend[4].style.color);
                }
                else if (field == "문예인원") {
                    series.fill = am4core.color(span_legend[5].style.color);
                    series.stroke = am4core.color(span_legend[5].style.color);
                }
                else if (field == "사회인원") {
                    series.fill = am4core.color(span_legend[6].style.color);
                    series.stroke = am4core.color(span_legend[6].style.color);
                }
                series.tooltip.label.textAlign = "middle";
                series.columns.template.tooltipText = "[#fff font-size: 15px]{categoryX}년\n{name}:[/][#fff font-size: 15px bold] {valueY}명[/]";

                return series;
            }

            createSeries("사회인원", "사회");
            createSeries("문예인원", "문예");
            createSeries("체육인원", "체육");
            createSeries("취미인원", "취미");
            createSeries("봉사인원", "봉사");
            createSeries("종교인원", "종교");
            createSeries("학술인원", "학술");

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
                if (field == "학술") {
                    series.fill = am4core.color(span_legend[0].style.color);
                    series.stroke = am4core.color(span_legend[0].style.color);
                }
                else if (field == "종교") {
                    series.fill = am4core.color(span_legend[1].style.color);
                    series.stroke = am4core.color(span_legend[1].style.color);
                }
                else if (field == "봉사") {
                    series.fill = am4core.color(span_legend[2].style.color);
                    series.stroke = am4core.color(span_legend[2].style.color);
                }
                else if (field == "취미") {
                    series.fill = am4core.color(span_legend[3].style.color);
                    series.stroke = am4core.color(span_legend[3].style.color);
                }
                else if (field == "체육") {
                    series.fill = am4core.color(span_legend[4].style.color);
                    series.stroke = am4core.color(span_legend[4].style.color);
                }
                else if (field == "문예") {
                    series.fill = am4core.color(span_legend[5].style.color);
                    series.stroke = am4core.color(span_legend[5].style.color);
                }
                else if (field == "사회") {
                    series.fill = am4core.color(span_legend[6].style.color);
                    series.stroke = am4core.color(span_legend[6].style.color);
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