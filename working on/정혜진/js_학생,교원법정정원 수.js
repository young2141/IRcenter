function parse(callback) {
    $.getJSON("student1.json", json => {
        callback(json);
    });
}
    function drawChart(value) {
    parse(json => {

        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
                // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.width = am4core.percent(100);
            chart.height = am4core.percent(100);
            // Add data
            
            var data=[]
            for (var i = 0; i < json.length; i++) {
                if(json[i].기준==value){
                    data.push(json[i])
                }
            }
                
            chart.data = data

            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.numberFormatter.numberFormat = "#";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;
            
            var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); 
            valueAxis.extraMax = 0.15;
            //valueAxis.renderer.minGridDistance = 80;
            

            // Create series
            function createSeries(field, name,color) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = field;
                series.dataFields.categoryX = "year";
                series.name = name;
                series.columns.template.tooltipText = "{year} {name}: [bold]{valueY}[/]명";
                series.columns.template.height = am4core.percent(40);
                series.sequencedInterpolation = true;
                series.columns.template.stroke = am4core.color(color);
                series.columns.template.fill = am4core.color(color);
                
            
                
            }
            
            createSeries("학생", "학생","red");
            createSeries("교원법정정원", "교원법정정원","blue");
        }); // end am4core.ready()
    



    });
}