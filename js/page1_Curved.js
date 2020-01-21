function drawP1Curved(
    _data,
    _divName,
    _cnt,
    _categoryX,
    _valueY,
    _valueY_ko,
    _valueY_RGB,
    _title,
    _numberFormat
) {
    am4core.ready(function () {
        console.log(_divName, _data);
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(_divName, am4charts.XYChart);
        chart.data = _data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        if (_divName == "divchart2") {
            valueAxis.min = 0;
            valueAxis.max = 100.5;
            valueAxis.strictMinMax = true;

            var axisBreak = valueAxis.axisBreaks.create();
            axisBreak.startValue = 0.2;
            axisBreak.endValue = 97.8;
            axisBreak.breakSize = 0.001;
        } else {
            valueAxis.strictMinMax = true;
            valueAxis.min = 0;
            valueAxis.max = 16;

            var axisBreak = valueAxis.axisBreaks.create();
            axisBreak.startValue = 0.3;
            axisBreak.endValue = 5;
            axisBreak.breakSize = 0.08;
        }

        function P1CurvedcreateSeries(value, clr) {
            var value_kr;
            if (value == "society") value_kr = "인문사회계열의";
            else if (value == "artphysical") value_kr = "예체능계열의";
            else if (value == "science") value_kr = "자연과학계열의";
            else if (value == "mech") value_kr = "공학계열의";
            else value_kr = "전체";

            var P1Cseries = chart.series.push(new am4charts.LineSeries());
            P1Cseries.dataFields.valueY = value;
            P1Cseries.strokeDasharray = ["dotted"];
            P1Cseries.strokeOpacity = 1;
            P1Cseries.strokeWidth = 2;
            P1Cseries.dataFields.categoryX = "year";
            if (value != "all") {
                P1Cseries.strokeWidth = 1;
                P1Cseries.strokeDasharray = "2, 2";
            }
            P1Cseries.stroke = am4core.color(clr);
            P1Cseries.strokeWidth = 3;

            var bullet = P1Cseries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fff"); // tooltips grab fill from parent by default
            if (_divName == "divchart1")
                bullet.tooltipText =
                    "[#000 font-size: 15px]{categoryX}학년도 " +
                    value_kr +
                    " 경쟁률은 [bold]{valueY}:1[] 입니다.";
            else
                bullet.tooltipText =
                    "[#000 font-size: 15px]{categoryX}학년도 " +
                    value_kr +
                    " 충원율은 [bold]{valueY}%[] 입니다.";
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.fill = am4core.color(clr);
            circle.strokeWidth = 3;
        }

        P1CurvedcreateSeries("all", "#FE4459"); // 전체
        P1CurvedcreateSeries("science", "#FCFF57"); // 자연과학
        P1CurvedcreateSeries("artphysical", "#52A1FF"); // 예체능
        P1CurvedcreateSeries("mech", "#43E884"); // 공대
        P1CurvedcreateSeries("society", "#E8A343"); // 인문사회
    });
}
