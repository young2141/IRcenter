function chart() {
    /*
    $.getJSON("../../../json/student_exp_domestic_company.json", jsonData => {
        var data = jsonData;
        //drawCurved("chartdiv1", data);
    });
    */
    $.getJSON("../../../json/studentexp_oversea_by_year.json", jsonData => {
        var year = document.getElementById("years").value;
        var data = jsonData[year];
        drawStacked("chartdiv2", data);
    });
}

function drawCurved(_div, _data) {
    var typename = ["season_summer", "season_winter", "semester_summer", "semester_winter", "always_summer", "always_winter"];
    var typename_kr = ["계절제(7주) 하계", "계절제(7주) 동계", "학기제(24주) 하계", "계절제(24주) 동계", "수시제(4주) 하계", "수시제(4주) 동계"]
    var color = {
        "season_summer": "#FE4459",
        "season_winter": "#FCFF57",
        "semester_summer": "#52A1FF",
        "semester_winter": "#43E884",
        "always_summer": "#E8A343",
        "always_winter": "#26DE74"
    };
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
    $("#chartdiv2").empty();
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

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

    createSeries("season", "계절제", "#FE4459");
    createSeries("semester", "학기제", "#52A1FF");
    createSeries("dispatch", "파견회사", "#E8A343");
}