function lineGraph(json) {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/globalchallenger.json", json => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart);

            // Data for both series
            var data = json;
            console.log(json);

            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            /* Create value axis */
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.extraMax = 0.1;

            /* Create series */
            var lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.name = "student";
            lineSeries.dataFields.valueY = "student";
            lineSeries.dataFields.categoryX = "year";

            lineSeries.stroke = am4core.color("#fdd400");
            lineSeries.strokeWidth = 3;
            lineSeries.strokeDasharray = ["2,2"];
            lineSeries.tooltip.label.textAlign = "middle";

            var bullet = lineSeries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
            bullet.tooltipText = "[#fff font-size: 15px]{categoryX}년:[#fff bold] {valueY}명[/][/]"
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.strokeWidth = 3;

            chart.data = data;
        });
    }); // end am4core.ready()
}
function stackGraph(json) {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/globalchallenger.json", json => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv2", am4charts.XYChart);

            // Data for both series
            var data = json;
            console.log(json);

            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            /* Create value axis */
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.extraMax = 0.1;

            /* Create series */
            var columnSeries = chart.series.push(new am4charts.ColumnSeries());
            columnSeries.name = "team";
            columnSeries.dataFields.valueY = "team";
            columnSeries.dataFields.categoryX = "year";

            columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{categoryX}년:[#fff bold] {valueY}팀[/][/]"
            columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
            columnSeries.columns.template.propertyFields.stroke = "stroke";
            columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
            columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
            columnSeries.tooltip.label.textAlign = "middle";

            chart.data = data;
        });
    }); // end am4core.ready()
}
