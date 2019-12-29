function drawChart1_2() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1_2", am4charts.XYChart);

        // Add data
        chart.data = [{
            "구직 활동중": 12,
            "정규직 고용": 88,
            "x": "2+ Internships"
        }, {
            "구직 활동중": 75,
            "정규직 고용": 25,
            "x": "1 Internships"
        }, {
            "구직 활동중": 61,
            "정규직 고용": 39,
            "x": "0 Internships"
        }];

        // Create axes
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "x";
        categoryAxis.renderer.grid.template.location = 0;
        // categoryAxis.renderer.grid.template.strokeWidth = 2;
        categoryAxis.renderer.grid.template.strokeOpacity = 0.3;


        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        // valueAxis.renderer.grid.template.strokeWidth = 2;
        valueAxis.renderer.grid.template.strokeOpacity = 0.3;
        valueAxis.min = 0;
        valueAxis.max = 100;

        categoryAxis.renderer.labels.template.adapter.add("text", (text, target, key) => {
            if (!target.dataItem.dataContext) return "";
            let xAxisLabelValue = target.dataItem.dataContext["x"];
            if (xAxisLabelValue == "2+ Internships") {
                return "인턴 2번 이상";
            } else if (xAxisLabelValue == "1 Internships") {
                return "인턴 1번";
            } else if (xAxisLabelValue == "0 Internships") {
                return "인턴 0번";
            }
            return "";
        });

        // Create series
        function createSeries(field, name, color) {

            // Set up series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.name = name;
            series.dataFields.valueX = field;
            series.dataFields.categoryY = "x";
            series.sequencedInterpolation = true;
            series.columns.template.fill = color;

            // Make it stacked
            series.stacked = true;

            // Configure columns
            series.columns.template.width = am4core.percent(60);
            series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

            // Add label
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueX}%";
            labelBullet.locationX = 0.5;

            return series;
        }

        // define colors
        let color_seeking = document.getElementById("color_seeking").getAttribute("value");
        let color_fulltime = document.getElementById("color_fulltime").getAttribute("value");
        // define colors
        var colors = {
            "seeking": am4core.color(color_seeking),
            "fulltime": am4core.color(color_fulltime)
        };

        createSeries("구직 활동중", "구직 활동중", colors.seeking);
        createSeries("정규직 고용", "정규직 고용", colors.fulltime);

        // Legend
        let legend = new am4charts.Legend();
        chart.legend = legend;
        legend.dx = 60;
    }); // end am4core.ready()
}