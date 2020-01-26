var color = {
    "season": "#FE4459",
    "semester": "#52A1FF",
    "dispatch": "#E8A343",
};

function chart1() {
    $.getJSON("../../../json/studentexp_oversea_current.json", jsonData => {
        var data = jsonData;
        drawCurved("chartdiv1", data);
    });
}

function chart2() {
    $.getJSON("../../../json/studentexp_oversea_by_year.json", jsonData => {
        var year = document.getElementById("years").value;
        var data = jsonData[year];
        drawStacked("chartdiv2", data);
    });
}

function drawCurved(_div, _data) {
    var typename = [];
    var typename_kr = []

    $("input[name=process]:checked").each(function () {
        var data = $(this).val();
        typename_kr.push(data);
    });

    $("input[name=process]:checked").each(function () {
        var data = $(this).attr("id");
        typename.push(data);
    });

    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(_div, am4charts.XYChart);
        chart.data = _data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.15;
        valueAxis.strictMinMax = false;
        valueAxis.strictMatrix = true;
        //valueAxis.max = 100.5;

        function CurvedcreateSeries(value, value_kr, clr) {
            var P1Cseries = chart.series.push(new am4charts.LineSeries());
            P1Cseries.dataFields.valueY = value;
            P1Cseries.strokeOpacity = 1;
            P1Cseries.strokeWidth = 2;
            P1Cseries.dataFields.categoryX = "year";
            P1Cseries.stroke = am4core.color(clr);

            var bullet = P1Cseries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fff"); // tooltips grab fill from parent by default
            bullet.tooltipText = "[#000 font-size: 15px]{categoryX}학년도 " + value_kr + "는 [bold]{valueY}명[] 입니다.";

            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 2;
            circle.fill = am4core.color(clr);
            circle.strokeWidth = 3;

        }
        for (var i = 0; i < typename.length; i++) {
            CurvedcreateSeries(typename[i], typename_kr[i], color[typename[i]]);
        }
    });
}

function drawStacked(_div, _data) {
    var typename = [];
    var typename_kr = []

    $("input[name=process]:checked").each(function () {
        var data = $(this).val();
        typename_kr.push(data);
    });

    $("input[name=process]:checked").each(function () {
        var data = $(this).attr("id");
        typename.push(data);
    });
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    var chart = am4core.create(_div, am4charts.XYChart);

    // Add data
    chart.data = _data;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.renderer.inside = true;
    valueAxis.min = 0;
    valueAxis.extraMax = 0.15;
    valueAxis.strictMinMax = false;
    // Create series
    function createSeries(field, name, color) {
        // Set up series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "country";
        series.stroke = color;
        series.fill = color;
        //series.sequencedInterpolation = true;

        // Make it stacked
        series.stacked = true;

        // Configure columns
        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipText = "[bold]" + name + "[/]\n[font-size:14px]{categoryX}: {valueY}";
       
        /* Add label
        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{valueY}";
        labelBullet.locationY = 0.5;
        labelBullet.label.hideOversized = true;
        */
        return series;
    }

    for (var i = 0; i < typename.length; i++) {
        createSeries(typename[i], typename_kr[i], color[typename[i]]);
    }
}