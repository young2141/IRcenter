function parse(callback) {
    $.getJSON("../../../working on/json/doyeong_sankey_dumy.json", json => {
        var data = []

        for (var i = 0; i < json.length; i++) {
            var temp = {}
            if(json[i].category.trim()=="전입후졸업"){
                temp["from"] = json[i].from.trim()
                temp["to"] = json[i].to.trim()
                temp["value"] = json[i].value  
                temp["date"]="2010"              
                data.push(temp)
            }
        }
        callback(data);

    });
}


parse(json => {
    am4core.ready(function() {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var container = am4core.create("chartdeclare", am4core.Container);
        container.layout = "grid";
        container.fixedWidthGrid = false;
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);
        
        // Color set
        var colors = new am4core.ColorSet();
        
        // Functions that create various sparklines
        function createLine(title, data, color) {
        
            var chart = container.createChild(am4charts.XYChart);
            chart.width = am4core.percent(10);
            chart.height = 50;
        
            chart.data = data;
        
            chart.titles.template.fontSize = 10;
            chart.titles.template.textAlign = "left";
            chart.titles.template.isMeasured = false;
            chart.titles.create().text = title;
        
            chart.padding(5, 5, 2, 5);
        
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.disabled = false;
            dateAxis.renderer.labels.template.disabled = true;
    
            dateAxis.startLocation = 0.5;
            dateAxis.endLocation = 0.7;
            dateAxis.cursorTooltipEnabled = false;
        
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis.cursorTooltipEnabled = false;
        
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineY.disabled = true;
            chart.cursor.behavior = "none";
        
            var series = chart.series.push(new am4charts.LineSeries());
            series.tooltipText = "{date}: [bold]{value}";
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "value";
            series.tensionX = 0.8;
            series.strokeWidth = 2;
            series.stroke = color;
        
            // render data points as bullets
            var bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.opacity = 0;
            bullet.circle.fill = color;
            bullet.circle.propertyFields.opacity = "opacity";
            bullet.circle.radius = 3;
        
            return chart;
        }
        
        function createColumn(title, data, color) {
        
            var chart = container.createChild(am4charts.XYChart);
            chart.width = am4core.percent(60);
            chart.height = 50;
        
            chart.data = data;
        
        
            chart.padding(5, 5, 2, 5);
        
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.min = 0;
            categoryAxis.max = 2;
            categoryAxis.dataFields.category = "category";
        
            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis.cursorTooltipEnabled = false;
        
            //chart.cursor = new am4charts.XYCursor();
            //chart.cursor.lineY.disabled = true;
        
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryY = "category";
            series.dataFields.valueX = "value";
            series.columns.template.tooltipText = "{valueX} %";
            series.strokeWidth = 0;
            series.fillOpacity = 0.5;
            series.columns.template.propertyFields.fillOpacity = "opacity";
            series.columns.template.fill = color;
        
            return chart;
        }
        
        //그리기시작
        colorcnt=0;
        var data=[]
        for (var i = 0; i < json.length; i++) {
            var fromvalue = json[i].value;
            var tovalue
            while(1){
                if(json[i].from == json[i].to){
                    tovalue = json[i].value;
                }
                if(i==json.length-1)break;
                if(json[i+1].from != json[i].from)break;
                i+=1
                fromvalue+=json[i].value;
            }
            var temp = {}
            temp["category"] = json[i].from
            temp["value"] = Math.floor(tovalue/fromvalue*100)               
            data.push(temp)

            var check=0
            if(colorcnt!=0){
                var k
                for(k =0;k<data.length;k++){
                    if(temp.value>data[k].value){
                        check=1
                        break;
                    }
                    if(k==data.length-1)break;
                }
                var j=data.length-1
                if(check==1){
                    for(j;j>k;j--){
                        data[j]=data[j-1]
                    }
                    data[k] = temp
                }
            }
            colorcnt++
            
        }
    
        for(var d=0 ;d<10;d++){
            createColumn("",[{"category":data[d].category,"value":data[d].value}],colors.getIndex(d));
            createLine("", [
                { "date": new Date(2018, 0, 1, 8, 0, 0), "value": 57 },
                { "date": new Date(2018, 0, 1, 9, 0, 0), "value": 27 },
                { "date": new Date(2018, 0, 1, 10, 0, 0), "value": 24 },
                { "date": new Date(2018, 0, 1, 11, 0, 0), "value": 59 },
                { "date": new Date(2018, 0, 1, 12, 0, 0), "value": 33 },
                { "date": new Date(2018, 0, 1, 13, 0, 0), "value": 46 },
                { "date": new Date(2018, 0, 1, 14, 0, 0), "value": 20 },
                { "date": new Date(2018, 0, 1, 15, 0, 0), "value": 42 },
                { "date": new Date(2018, 0, 1, 16, 0, 0), "value": 59, "opacity": 1}
            ], colors.getIndex(d));
        }
        
        
    
     }); // end am4core.ready()
});