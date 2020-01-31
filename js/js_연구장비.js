function parse(callback) {
    $.getJSON("../../../json/공동연구_1.json", json => {
        callback(json);
    });
}

parse(json => {

    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
            // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        
        // Add data
        
        var max=0
        for(var i=0;i<json.length;i++){
            if(json[i].비용>max){
                max = json[i].비용
            }
            json[i].dif = json[i].dif/2
        }
        chart.data = json

        // Create axes
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.numberFormatter.numberFormat = "#";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;
        
        var  valueAxis = chart.xAxes.push(new am4charts.ValueAxis()); 
        //valueAxis.renderer.opposite = true;
        //valueAxis.logarithmic = true;
        valueAxis.max = max*1.15; 
        //valueAxis.renderer.minGridDistance = 100;
        
        // Create series
        function createSeries(field, name,color) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field;
            series.dataFields.categoryY = "year";
            series.name = name;
            series.columns.template.tooltipText = "{name}: [bold]{valueX}[/] 천원";
            series.columns.template.height = am4core.percent(100);
            series.sequencedInterpolation = true;
            series.columns.template.stroke = am4core.color(color);
            series.columns.template.fill = am4core.color(color);
        
            var valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{valueX}";
            valueLabel.label.horizontalCenter = "left";
            valueLabel.label.dx = 10;
            valueLabel.label.hideOversized = false;
            valueLabel.label.truncate = false;
            
        
            
        }
        
        createSeries("비용", "연구 장비 비용","red");
        createSeries("수익", "실비자산 사용료 수익","blue");

        
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "dif";
        lineSeries.dataFields.valueX = "dif";
        lineSeries.dataFields.categoryY = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#fff font-size: 15px]{name} :\n[/][#fff font-size: 20px]{valueX}[/] [#fff][/]"
        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.fill = am4core.color("#fdd400");
        circle.strokeWidth = 3;
        
        }); // end am4core.ready()
    



    });