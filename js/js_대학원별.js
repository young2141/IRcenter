function parse2(callback) {
    $.getJSON("../../../json/professor1.json", json => {
        callback(json);
    });
}

function drawChart2(value) {
    parse2(json => {
        am4core.ready(function() {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            // Create chart instance
            var chart = am4core.create("chartdiv2", am4charts.XYChart);


            var data=[]
            for (var i = 0; i < json.length; i++) {
                if(json[i].year==value){
                    data.push(json[i])
                }
            }
            
            // Add data
            chart.data = data
            
            // Create axes
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "colledge";
            //categoryAxis.renderer.grid.template.opacity = 0;
            categoryAxis.renderer.minGridDistance = 10;
            categoryAxis.renderer.inversed = true;
            categoryAxis.renderer.grid.template.location = 0;
            
            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            //valueAxis.renderer.grid.template.opacity = 0;
            valueAxis.renderer.ticks.template.strokeOpacity = 0.1;
            valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
            valueAxis.renderer.ticks.template.length = 10;
            valueAxis.renderer.line.strokeOpacity = 0.1;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.minGridDistance = 60;
            valueAxis.extraMax = 0.1;
            
            // Create series
            function createSeries(field, name,color) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueX = field;
                series.dataFields.categoryY = "colledge";
                series.stacked = true;
                series.name = name;
                series.columns.template.stroke = am4core.color(color);
                series.columns.template.fill = am4core.color(color);

                series.columns.template.width = am4core.percent(60);
                series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{valueX}명";

                
                var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                labelBullet.locationX = 0.5;
                labelBullet.locationY = 0.5;
                //labelBullet.label.text = "{valueX}";
                labelBullet.label.fill = am4core.color("#fff");
            }
            
            createSeries("교수", "교수","red");
            createSeries("부교수", "부교수","blue");
            createSeries("조교수", "조교수","green");
            createSeries("조교", "조교","yellow");

            var totalSeries = chart.series.push(new am4charts.ColumnSeries());
            totalSeries.dataFields.valueX = "none";
            totalSeries.dataFields.categoryY = "colledge";
            totalSeries.stacked = true;
            totalSeries.hiddenInLegend = true;
            totalSeries.columns.template.strokeOpacity = 0;

            var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
            totalBullet.dy = -20;
            totalBullet.label.text = "{valueX.total}";
            totalBullet.label.hideOversized = false;
            totalBullet.label.fontSize = 16;
            totalBullet.label.background.fill = totalSeries.stroke;
            totalBullet.label.background.fillOpacity = 0.2;
            totalBullet.label.padding(5, 10, 5, 10);
            }); // end am4core.ready()



    });
    
}