function drawChart2() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv2", am4charts.XYChart);
        // chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        // chart.maskBullets = false;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        xAxis.dataFields.category = "x";
        yAxis.dataFields.category = "y";

        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.opposite = true;

        yAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.inversed = true;
        xAxis.renderer.grid.template.minGridDistance = 1;
        xAxis.renderer.labels.template.width = 100;
        xAxis.width = 700;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "x";
        series.dataFields.categoryY = "y";
        series.dataFields.value = "value";

        series.columns.template.fill = am4core.color("#ffffff");
        series.columns.template.strokeWidth = 0;
        
        var circleBullet = series.bullets.push(new am4charts.CircleBullet());
        // circleBullet.tooltip = "{x}, {y}: {value.workingValue.formatNumber('#.')}";
        circleBullet.circle.propertyFields.fill = "color";
        circleBullet.circle.propertyFields.radius = "radius";
        circleBullet.circle.strokeWidth = 0;

        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{value}%";
        labelBullet.label.maxWidth = 50;
        labelBullet.fontSize = 15;
        labelBullet.label.dx = 55;
        // labelBullet.interactionsEnabled = false;

        // define colors
        var colors = {
            "yellow": am4core.color("#FCD12A"),
            "blue": chart.colors.getIndex(1).brighten(0)
        };

        chart.data = [{
            "y": "Employed Full-Time",
            "x": "> 6 Months Before Grad",
            "color": colors.yellow,
            "value": 90,
            "radius": 35
        }, {
            "y": "Employed Full-Time",
            "x": "3-6 Months Before Grad",
            "color": colors.yellow,
            "value": 75,
            "radius": 30
        }, {
            "y": "Employed Full-Time",
            "x": "< 3 Months Before Grad",
            "color": colors.yellow,
            "value": 63,
            "radius": 27
        }, {
            "y": "Seeking Employment",
            "x": "> 6 Months Before Grad",
            "color": colors.blue,
            "value": 10,
            "radius": 18
        }, {
            "y": "Seeking Employment",
            "x": "3-6 Months Before Grad",
            "color": colors.blue,
            "value": 25,
            "radius": 24
        }, {
            "y": "Seeking Employment",
            "x": "< 3 Months Before Grad",
            "color": colors.blue,
            "value": 37,
            "radius": 27
        }];

    });
}