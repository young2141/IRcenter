function drawChart2_1() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv2_1", am4charts.XYChart);

        var height = document.getElementById("chartdiv2_1").clientHeight;
        var width = document.getElementById("chartdiv2_1").clientWidth;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        xAxis.dataFields.category = "x";
        
        xAxis.renderer.opposite = true;
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.ticks.template.disabled = false;
        xAxis.renderer.ticks.template.strokeOpacity = 0.8;
        xAxis.renderer.ticks.template.length = height - 185;
        xAxis.renderer.ticks.template.dy = height - 213;
        xAxis.renderer.ticks.template.location = 0;
        xAxis.title.text = "구직활동 기간";

        yAxis.dataFields.category = "y";
        yAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.inversed = true;
        yAxis.renderer.ticks.template.disabled = false;
        yAxis.renderer.ticks.template.strokeOpacity = 0.8;
        yAxis.renderer.ticks.template.location = 0;
        yAxis.renderer.ticks.template.length = width - 50;
        yAxis.renderer.ticks.template.dx = width - 150;
        yAxis.title.text = "취업상태";
        yAxis.height = am4core.percent(60);

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
        let color_seeking = document.getElementById("color_seeking").getAttribute("value");
        let color_fulltime = document.getElementById("color_fulltime").getAttribute("value");
        // define colors
        var colors = {
            "seeking": am4core.color(color_seeking),
            "fulltime": am4core.color(color_fulltime)
        };

        chart.data = [{
            "y": "정규직 고용",
            "x": "졸업 6개월 전",
            "color": colors.fulltime,
            "value": 90,
            "radius": 35
        }, {
            "y": "정규직 고용",
            "x": "졸업 3-6개월 전",
            "color": colors.fulltime,
            "value": 75,
            "radius": 30
        }, {
            "y": "정규직 고용",
            "x": "졸업 3개월 전",
            "color": colors.fulltime,
            "value": 63,
            "radius": 27
        }, {
            "y": "정규직 고용",
            "x": "졸업 후 또는 구직활동 미시작",
            "color": colors.fulltime,
            "value": 63,
            "radius": 27
        },{
            "y": "구직 활동중",
            "x": "졸업 6개월 전",
            "color": colors.seeking,
            "value": 10,
            "radius": 18
        }, {
            "y": "구직 활동중",
            "x": "졸업 3-6개월 전",
            "color": colors.seeking,
            "value": 25,
            "radius": 24
        }, {
            "y": "구직 활동중",
            "x": "졸업 3개월 전",
            "color": colors.seeking,
            "value": 37,
            "radius": 27
        },{
            "y": "구직 활동중",
            "x": "졸업 후 또는 구직활동 미시작",
            "color": colors.seeking,
            "value": 63,
            "radius": 27
        }];

    });
}