function parse(callback) {
    $.getJSON("professor2.json", json => {
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
            chart.data = json
            
            chart.legend = new am4charts.Legend();
            chart.legend.position = "right";
            
            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "colledge";
            categoryAxis.renderer.grid.template.opacity = 0;
            categoryAxis.renderer.minGridDistance = 10;
            
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.renderer.grid.template.opacity = 0;
            valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
            valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
            valueAxis.renderer.ticks.template.length = 10;
            valueAxis.renderer.line.strokeOpacity = 0.5;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.minGridDistance = 40;
            
            // Create series
            function createSeries(field, name) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = field;
                series.dataFields.categoryX = "colledge";
                series.stacked = true;
                series.name = name;
                
                var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                labelBullet.locationX = 0.5;
                labelBullet.locationY = 0.5;
                labelBullet.label.text = "{valueY}";
                labelBullet.label.fill = am4core.color("#fff");
            }
            
            createSeries("교수", "교수");
            createSeries("부교수", "부교수");
            createSeries("조교수", "조교수");
            createSeries("조교", "조교");
            }); // end am4core.ready()



    });
    
}

