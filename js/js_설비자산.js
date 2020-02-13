function parse2(callback) {
    $.getJSON("../../../json/공동연구_2.json", json => {
        callback(json);
    });
}
function drawChart(value) {
    parse2(json => {
        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
                // Create chart instance
            var chart = am4core.create("chartdiv2", am4charts.XYChart);
            chart.width = am4core.percent(96);
            chart.height = am4core.percent(100);
            // Add data
            var data=[]
            for (var i = 0; i < json.length; i++) {
                if(json[i].year==value){
                    data.push(json[i])
                }
            }
                
            chart.data = data

            // Create axes
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "name";
            categoryAxis.numberFormatter.numberFormat = "#,###";
            categoryAxis.renderer.inversed = true;
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.cellStartLocation = 0.1;
            categoryAxis.renderer.cellEndLocation = 0.9;

            var label = categoryAxis.renderer.labels.template;
            label.wrap = true;
            label.maxWidth = 150;
            
            var  valueAxis = chart.xAxes.push(new am4charts.ValueAxis()); 
            //valueAxis.renderer.opposite = true;
            //valueAxis.logarithmic = true;
            valueAxis.extraMax = 0.1;
            valueAxis.min=0
            valueAxis.renderer.minGridDistance = 100;
            //valueAxis.renderer.labels.template.rotation = 15;
            

            // Create series
            function createSeries(field, name,color) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueX = field;
                series.dataFields.categoryY = "name";
                series.name = name;
                series.columns.template.tooltipText = "{name}: [bold]{valueX}[/] 천원";
                series.columns.template.height = am4core.percent(40);
                series.sequencedInterpolation = true;
                series.columns.template.stroke = am4core.color(color);
                series.columns.template.fill = am4core.color(color);

                var valueLabel = series.bullets.push(new am4charts.LabelBullet());
                valueLabel.label.text = "{valueX}";
                valueLabel.label.horizontalCenter = "middle";
                //valueLavel.label.maxLabelPosition = 0.99;
                //valueLabel.label.dx = 10;
                valueLabel.label.inside = true;
                valueLabel.label.hideOversized = false;
                valueLabel.label.truncate = false;
                //valueLabel.label.isMeasured = false;
                
            
                
            }
            
        createSeries("수익", "실비자산 사용료 수익","red");
        
        }); // end am4core.ready()
    



    });
}