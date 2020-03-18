function parse(callback) {
    $.getJSON("cwts.json", json => {
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
        var data=[]
            for (var i = 0; i < json.length; i++) {
                if(json[i].분류=="world"){
                    var temp = {}
                    temp["year"] = json[i].Period.toString()
                    //if(json[i].year=="2020")
                    temp["Rworld"] = json[i].Rworld
                    data.push(temp)
                }
            }
                
            chart.data = data
        
        // Create category axis
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.inversed = true;
        
        // Create value axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.title.text = "Place taken";
        //valueAxis.renderer.minLabelPosition = 0.01;
        valueAxis.extraMin = 0.15;
        valueAxis.extraMax = 0.15;
        

        function P1CurvedcreateSeries(value, clr) {

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
            bullet.tooltipText = value+" {valueY}"
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.fill = am4core.color(clr);
            circle.strokeWidth = 3;
        }

        P1CurvedcreateSeries("Rworld", "#FE4459"); // 전체
        


        
    
        
        }); // end am4core.ready()

    });
}