function parse3(callback) {
    $.getJSON("../../../json/공동연구_3.json", json => {
        callback(json);
    });
}

function drawChart2(value) {
    parse3(json => {

        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
                // Create chart instance
            var chart = am4core.create("chartdiv3", am4charts.XYChart);
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
            valueAxis.extraMax = 0.10;
            //valueAxis.strictMinMax = true;
            valueAxis.renderer.minGridDistance = 100;
            //valueAxis.renderer.labels.template.rotation = 10;
            

            // Create series
            function createSeries(field, name,color) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueX = field;
                series.dataFields.categoryY = "name";
                series.name = name;
                series.columns.template.tooltipText = "{name}: [bold]{valueX}[/] 천원";
                series.columns.template.height = am4core.percent(100);
                series.sequencedInterpolation = true;
                series.columns.template.stroke = am4core.color(color);
                series.columns.template.fill = am4core.color(color);
            
                var valueLabel = series.bullets.push(new am4charts.LabelBullet());
                valueLabel.label.text = "{valueX}";
                valueLabel.label.horizontalCenter = "middle";
                valueLabel.label.dx = 5;
                valueLabel.label.hideOversized = false;
                valueLabel.label.truncate = false;
                
            
                
            }
        
        createSeries("비용", "연구 장비 비용","red");
        createSeries("수익", "실비자산 사용료 수익","blue");
        
        }); // end am4core.ready()
    



    });
}