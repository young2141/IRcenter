function chart() {
    $.getJSON("../../../json/professor_and_assistant_summary.json", jsonData => {
        drawCurved(jsonData);
    });
}

function drawCurved(_data) {
    var typename = ["professor", "associateprofessor", "assistantprofessor", "teachingassistant", "concurrently", "invitation", "parttime", "etc"];
    var typename_kr = ["교수", "부교수", "조교수", "조교", "겸임교수", "초빙교수", "시간강사", "기타"]
    var color = {
        "professor": "#ff0000", "associateprofessor": "#ff0000", "assistantprofessor": "#ff0000",
        "teachingassistant": "#00ff00",
        "concurrently": "#0000ff", "invitation": "#0000ff", "parttime": "#0000ff", "etc": "#0000ff"
    };
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(chartdiv, am4charts.XYChart);
        chart.data = _data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.15;
        valueAxis.strictMatrix = false;

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
