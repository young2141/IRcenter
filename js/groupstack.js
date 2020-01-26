am4core.ready(function () {
    jQuery.getJSON("../../../json/groupstack.json", json => {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        // Add data
        chart.data = json;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;

        // Create series
        function createSeries(field, name) {

            // Set up series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.name = name;
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "year";
            series.sequencedInterpolation = true;

            // Make it stacked
            series.stacked = true;

            // Configure columns
            // series.columns.template.width = am4core.percent(60);
            series.tooltip.label.textAlign = "middle";
            series.columns.template.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]";

            // Add label
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.locationY = 0.5;
            labelBullet.label.hideOversized = true;

            return series;
        }

        createSeries("문예", "문예");
        createSeries("체육", "체육");
        createSeries("취미", "취미");
        createSeries("봉사", "봉사");
        createSeries("종교", "종교");
        createSeries("학술", "학술");

        // function createLineSeries(field, name) {

        //     var lineSeries = chart.series.push(new am4charts.LineSeries());
        //     lineSeries.name = name;
        //     lineSeries.dataFields.valueY = field;
        //     lineSeries.dataFields.categoryX = "year";
        //     // lineSeries.stroke = am4core.color("#fdd400");
        //     lineSeries.strokeWidth = 3;
        //     lineSeries.propertyFields.strokeDasharray = "lineDash";
        //     lineSeries.tooltip.label.textAlign = "middle";

        //     var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        //     bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        //     bullet.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 20px]: {valueY}명[/]"

        //     var circle = bullet.createChild(am4core.Circle);
        //     circle.radius = 4;
        //     circle.fill = am4core.color("#fff");
        //     circle.strokeWidth = 3;

        //     return lineSeries;
        // }

        // createLineSeries("문예인원", "문예인원");
        // createLineSeries("체육인원", "체육인원");
        // createLineSeries("취미인원", "취미인원");
        // createLineSeries("봉사인원", "봉사인원");
        // createLineSeries("종교인원", "종교인원");
        // createLineSeries("학술인원", "학술인원");





        // 1번
        var lineSeries1 = chart.series.push(new am4charts.LineSeries());
        lineSeries1.name = "문예";
        lineSeries1.dataFields.valueY = "문예인원";
        lineSeries1.dataFields.categoryX = "year";
        lineSeries1.stroke = am4core.color("#67b7dc");
        lineSeries1.strokeWidth = 3;
        lineSeries1.propertyFields.strokeDasharray = "lineDash";
        lineSeries1.tooltip.label.textAlign = "middle";
        var bullet1 = lineSeries1.bullets.push(new am4charts.Bullet());
        bullet1.fill = am4core.color("#67b7dc"); // tooltips grab fill from parent by default
        bullet1.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]"
        var circle1 = bullet1.createChild(am4core.Circle);
        circle1.radius = 4;
        circle1.fill = am4core.color("#fff");
        circle1.strokeWidth = 3;

        // 2번
        var lineSeries2 = chart.series.push(new am4charts.LineSeries());
        lineSeries2.name = "체육";
        lineSeries2.dataFields.valueY = "체육인원";
        lineSeries2.dataFields.categoryX = "year";
        lineSeries2.stroke = am4core.color("#6794dc");
        lineSeries2.strokeWidth = 3;
        lineSeries2.propertyFields.strokeDasharray = "lineDash";
        lineSeries2.tooltip.label.textAlign = "middle";
        var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
        bullet2.fill = am4core.color("#6794dc"); // tooltips grab fill from parent by default
        bullet2.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]"
        var circle2 = bullet2.createChild(am4core.Circle);
        circle2.radius = 4;
        circle2.fill = am4core.color("#fff");
        circle2.strokeWidth = 3;

        // 3번
        var lineSeries3 = chart.series.push(new am4charts.LineSeries());
        lineSeries3.name = "취미";
        lineSeries3.dataFields.valueY = "취미인원";
        lineSeries3.dataFields.categoryX = "year";
        lineSeries3.stroke = am4core.color("#6771dc");
        lineSeries3.strokeWidth = 3;
        lineSeries3.propertyFields.strokeDasharray = "lineDash";
        lineSeries3.tooltip.label.textAlign = "middle";
        var bullet3 = lineSeries3.bullets.push(new am4charts.Bullet());
        bullet3.fill = am4core.color("#6771dc"); // tooltips grab fill from parent by default
        bullet3.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]"
        var circle3 = bullet3.createChild(am4core.Circle);
        circle3.radius = 4;
        circle3.fill = am4core.color("#fff");
        circle3.strokeWidth = 3;

        // 4번
        var lineSeries4 = chart.series.push(new am4charts.LineSeries());
        lineSeries4.name = "봉사";
        lineSeries4.dataFields.valueY = "봉사인원";
        lineSeries4.dataFields.categoryX = "year";
        lineSeries4.stroke = am4core.color("#8067dc");
        lineSeries4.strokeWidth = 3;
        lineSeries4.propertyFields.strokeDasharray = "lineDash";
        lineSeries4.tooltip.label.textAlign = "middle";
        var bullet4 = lineSeries4.bullets.push(new am4charts.Bullet());
        bullet4.fill = am4core.color("#8067dc"); // tooltips grab fill from parent by default
        bullet4.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]"
        var circle4 = bullet4.createChild(am4core.Circle);
        circle4.radius = 4;
        circle4.fill = am4core.color("#fff");
        circle4.strokeWidth = 3;

        // 5번
        var lineSeries5 = chart.series.push(new am4charts.LineSeries());
        lineSeries5.name = "종교";
        lineSeries5.dataFields.valueY = "종교인원";
        lineSeries5.dataFields.categoryX = "year";
        lineSeries5.stroke = am4core.color("#a367dc");
        lineSeries5.strokeWidth = 3;
        lineSeries5.propertyFields.strokeDasharray = "lineDash";
        lineSeries5.tooltip.label.textAlign = "middle";
        var bullet5 = lineSeries5.bullets.push(new am4charts.Bullet());
        bullet5.fill = am4core.color("#a367dc"); // tooltips grab fill from parent by default
        bullet5.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]"
        var circle5 = bullet5.createChild(am4core.Circle);
        circle5.radius = 4;
        circle5.fill = am4core.color("#fff");
        circle5.strokeWidth = 3;

        // 6번
        var lineSeries6 = chart.series.push(new am4charts.LineSeries());
        lineSeries6.name = "학술";
        lineSeries6.dataFields.valueY = "학술인원";
        lineSeries6.dataFields.categoryX = "year";
        lineSeries6.stroke = am4core.color("#c767dc");
        lineSeries6.strokeWidth = 3;
        lineSeries6.propertyFields.strokeDasharray = "lineDash";
        lineSeries6.tooltip.label.textAlign = "middle";
        var bullet6 = lineSeries6.bullets.push(new am4charts.Bullet());
        bullet6.fill = am4core.color("#c767dc"); // tooltips grab fill from parent by default
        bullet6.tooltipText = "[#fff font-size: 15px]{categoryX}년\n[/][#fff font-size: 15px]{name}: {valueY}명[/]"
        var circle6 = bullet6.createChild(am4core.Circle);
        circle6.radius = 4;
        circle6.fill = am4core.color("#fff");
        circle6.strokeWidth = 3;
    });


}); // end am4core.ready()