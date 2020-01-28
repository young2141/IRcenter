function chart() {
    $.getJSON("../../../json/studentexp_domestic_company.json", jsonData => {
        var data = jsonData;
        drawCurved("chartdiv1", data);
    });
    $.getJSON("../../../json/studentexp_domestic_student.json", jsonData => {
        var data = jsonData;
        drawCurved("chartdiv2", data);
    });
}

function drawCurved(_div, _data) {
    var typename = [];
    var typename_kr = []
    var color = {
        "season_summer": "#FE4459",
        "season_winter": "#FCFF57",
        "semester_summer": "#52A1FF",
        "semester_winter": "#43E884",
        "always_summer": "#E8A343",
        "always_winter": "#CC66CC"
    };

    $("input[name=process]:checked").each(function () {
        var data1 = $(this).val();
        $("input[name=term]:checked").each(function () {
            var data2 = $(this).val();
            typename_kr.push(data1 + " " + data2);
        });
    });

    $("input[name=process]:checked").each(function () {
        var data1 = $(this).attr("id");
        $("input[name=term]:checked").each(function () {
            var data2 = $(this).attr("id");
            typename.push(data1 + "_" + data2);
        });
    });

    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(_div, am4charts.XYChart);
        chart.data = _data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.15;
        valueAxis.strictMinMax = false;

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
            circle.radius = 4;
            circle.fill = am4core.color(clr);
            circle.strokeWidth = 3;

        }
        for (var i = 0; i < typename.length; i++) {
            CurvedcreateSeries(typename[i], typename_kr[i], color[typename[i]]);
            console.log(typename[i]);
        }
    });
}
