am4core.ready(function () {

    jQuery.getJSON("../json/research.json", json => {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;

        /* Create value axis */
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMax = 0.1;

        chart.data = data;

        function createLineSeries(field, name) {

            /* Create series */
            var lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.name = name;
            lineSeries.dataFields.valueY = field;
            lineSeries.dataFields.categoryX = "year";

            lineSeries.strokeWidth = 3;
            if (name == "전체")
                lineSeries.strokeDasharray = "lineDash";
            else
                lineSeries.strokeDasharray = "5,5";
            lineSeries.tooltip.label.textAlign = "middle";
            // lineSeries.strokeDasharray = "5,5";

            var bullet = lineSeries.bullets.push(new am4charts.Bullet());
            bullet.tooltipText = "[#fff font-size: 15px]{name}: [/][#fff font-size: 15px bold]{valueY} 천원[/]"
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.strokeWidth = 3;

            return lineSeries;
        }

        createLineSeries("전체", "전체");
        createLineSeries("인문사회", "인문사회");
        createLineSeries("자연과학", "자연과학");
        createLineSeries("공학", "공학");
        createLineSeries("예체능", "예체능");
        createLineSeries("의학", "의학");

        // Legend
        chart.legend = new am4charts.Legend();
    });
}); // end am4core.ready()