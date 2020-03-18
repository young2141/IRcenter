function parse(callback) {
    $.getJSON("../../../json/t_job.json", json => {
        callback(json);
    });
}
function drawChart(value) {
    console.log("start")
    parse(json => {
        am4core.ready(function () {
            am4core.useTheme(am4themes_animated);
            chart = am4core.create("chartdiv", am4charts.XYChart);

            var data=[]
            for (var i = 0; i < json.length; i++) {
                if(json[i].job==value){
                    json[i].year = json[i].year.toString();
                    json[i].difference = json[i].in+json[i].out
                    data.push(json[i])
                }
            }
                
            chart.data = data
            
            var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "year";
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.inversed = true;
            //xAxis.renderer.grid.template.disabled = true;
            xAxis.renderer.minGridDistance = 5;
            

            var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.renderer.minGridDistance = 50;
            yAxis.extraMax = 0.1;
            yAxis.extraMin = 0.1;

            var series1 = chart.series.push(new am4charts.ColumnSeries());
            series1.dataFields.categoryX = "year";
            series1.dataFields.valueY = "in";
            series1.stacked = true;
            series1.name = "admin/tech Service";
            series1.columns.template.fill = am4core.color("#FCD12A");
            series1.columns.template.tooltipText = "[bold]신규채용+전입[/]\n[font-size:14px]{valueY}명";


            var series2 = chart.series.push(new am4charts.ColumnSeries());
            series2.dataFields.categoryX = "year";
            series2.dataFields.valueY = "out";
            series2.name = "All Other Units";
            series2.stacked = true;
            series2.columns.template.fill = am4core.color("#000080");
            series2.columns.template.fillOpacity = 0.7;
            series2.columns.template.tooltipText = "[bold]전출+퇴직[/]\n[font-size:14px]{valueY}명";



            var series3 = chart.series.push(new am4charts.LineSeries());
            series3.dataFields.categoryX = "year";
            series3.dataFields.valueY = "difference";
            series3.strokeWidth = 4;
            series3.name = "Net Difference";
            series3.stroke = am4core.color("#58641D");
            
        
        });
    });
}