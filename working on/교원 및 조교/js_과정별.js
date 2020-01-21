function parse(callback) {
    $.getJSON("professor4.json", json => {
        callback(json);
    });
}

function drawChart() {
    parse(json => {

    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        
        // Add data
        chart.data = json;
        
        // Create category axis
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;
        
        // Create value axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.title.text = "Place taken";
        valueAxis.renderer.minLabelPosition = 0.01;
        

        function P1CurvedcreateSeries(value, clr) {
            var value_kr;
            if (value == "학사") value_kr = "학사";
            else if (value == "석사") value_kr = "석사";
            else if (value == "박사") value_kr = "박사";

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
            bullet.tooltipText = value_kr+" {valueY}"
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.fill = am4core.color(clr);
            circle.strokeWidth = 3;
        }

        P1CurvedcreateSeries("학사", "#FE4459"); // 전체
        P1CurvedcreateSeries("석사", "#FCFF57"); // 자연과학
        P1CurvedcreateSeries("박사", "#52A1FF"); // 예체능
        
        
        // Add legend
        chart.legend = new am4charts.Legend();
        
        }); // end am4core.ready()

    });
}
