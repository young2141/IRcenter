function drawChart() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add data
        chart.data = [{
            "Employed Full-Time": 88,
            "Seeking Employment": 12,
            "x": "2+ Internships"
        }, {
            "Employed Full-Time": 75,
            "Seeking Employment": 25,
            "x": "1+ Internships"
        }, {
            "Employed Full-Time": 61,
            "Seeking Employment": 39,
            "x": "0 Internships"
        }];

        // Create axes
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "x";
        categoryAxis.renderer.grid.template.location = 0;


        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;
        valueAxis.max = 100;

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
            labelBullet.label.text = "{valueX}";
            labelBullet.locationX = 0.5;

            return series;
        }

        createSeries("Seeking Employment", "Seeking Employment", am4core.color("#FCD12A"));
        createSeries("Employed Full-Time", "Employed Full-Time", chart.colors.getIndex(1).brighten(0));

        // Legend
        chart.legend = new am4charts.Legend();

    }); // end am4core.ready()
}