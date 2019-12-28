function parse(callback) {
    $.getJSON("../../../working on/json/doyeong_sankey_dumy.json", json => {
        var data = []

        for (var i = 0; i < json.length; i++) {
            var temp = {}
            if(json[i].category.trim()=="입학후전입"){
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
        var container = am4core.create("chartdeclare3", am4core.Container);
        container.layout = "horizontal";
        container.fixedWidthGrid = false;
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);

        var columContainer = container.createChild(am4core.Container);
        columContainer.layout = "horizontal";
        columContainer.width = am4core.percent(60);
        columContainer.height = am4core.percent(100);



        var lineContainer = container.createChild(am4core.Container);
        lineContainer.layout = "vertical";
        lineContainer.width = am4core.percent(10);
        lineContainer.height = am4core.percent(100);
        // Color set
        var colors = new am4core.ColorSet();
        
        // Functions that create various sparklines
        function createLine(title, data, color) {
        
            var chart = lineContainer.createChild(am4charts.XYChart);
            chart.layout = "vertical"
            chart.width = am4core.percent(100);
            chart.height = 35;
        
            chart.data = data;
        
            chart.titles.template.fontSize = 10;
            chart.titles.template.textAlign = "left";
            chart.titles.template.isMeasured = false;
            chart.titles.create().text = title;
            
        
            chart.padding(0, 0, 0, 0);
        
            /* var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.disabled = true;
            dateAxis.renderer.labels.template.disabled = true;
            dateAxis.renderer.baseGrid.disabled = false;
    
            dateAxis.startLocation = 0.5;
            dateAxis.endLocation = 0.7;
            dateAxis.cursorTooltipEnabled = false; */

            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = true;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.dataFields.category = "category";
        
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
            series.tooltipText = "{category}: [bold]{value}";
            series.dataFields.categoryX = "category";
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




        function createLine2(title, data, color) {
        
            var chart = lineContainer.createChild(am4charts.XYChart);
            chart.layout = "vertical"
            chart.width = am4core.percent(100);
            chart.height = am4core.percent(100);;
        
            chart.data = data;
        
            chart.titles.template.fontSize = 10;
            chart.titles.template.textAlign = "left";
            chart.titles.template.isMeasured = false;
            chart.titles.create().text = title;
            
        
            chart.padding(5, 5, 2, 5);
        
            /* var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.disabled = true;
            dateAxis.renderer.labels.template.disabled = true;
            dateAxis.renderer.baseGrid.disabled = false;
    
            dateAxis.startLocation = 0.5;
            dateAxis.endLocation = 0.7;
            dateAxis.cursorTooltipEnabled = false; */

            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.dataFields.category = "category";
        
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
            series.tooltipText = "{category}: [bold]{value}";
            series.dataFields.categoryX = "category";
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
        
            var chart = columContainer.createChild(am4charts.XYChart);
            chart.width = am4core.percent(100);
            chart.height = am4core.percent(100);
        
            chart.data = data;
        
        
            chart.padding(5, 20, 2, 5);
        
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.renderer.labels.template.width = 50;
            categoryAxis.dataFields.category = "category";
        
            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 100;
            // valueAxis.title.text = "(%)";
            valueAxis.renderer.grid.template.disabled = false;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.labels.template.disabled = false;
            valueAxis.cursorTooltipEnabled = false;
        
            // chart.cursor = new am4charts.XYCursor();
            // chart.cursor.lineY.disabled = true;
        
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryY = "category";
            series.dataFields.valueX = "value";
            series.columns.template.tooltipText = "{categoryY} : {valueX} %";
            series.strokeWidth = 0;
            series.fillOpacity = 0.5;
            series.columns.template.propertyFields.fillOpacity = "opacity";
            series.columns.template.fill = color;
        
            return chart;
        }

        colorcnt=0;
        var data=[]
        for (var i = 0; i < json.length; i++) {
            var fromvalue = json[i].value;
            var tovalue
            var nd=0
            while(1){
                if(json[i].from == json[i].to){
                    tovalue = json[i].value;
                    nd=1
                }
                if(nd!=1&&json[i].to=="No Degree"){
                    tovalue = 0;
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
                    if(temp.value<data[k].value){
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
        createColumn("",data,colors.getIndex(1));
        for(var d=0 ;d<data.length;d++){
            if(d>=data.length-1){
                createLine2("", [
                    { "category": "'06", "value": 57 },
                    { "category": "'07", "value": 27 },
                    { "category": "'08", "value": 24 },
                    { "category": "'09", "value": 59 },
                    { "category": "'10", "value": 33 },
                    { "category": "'11", "value": 46 },
                    { "category": "'12", "value": 20 },
                    { "category": "'13", "value": 42 },
                    { "category": "'14", "value": 59,},
                    { "category": "'15", "value": 70,}
                ], colors.getIndex(d));
            }
            else{
                createLine("", [
                    { "category": "'06", "value": 57 },
                    { "category": "'07", "value": 27 },
                    { "category": "'08", "value": 24 },
                    { "category": "'09", "value": 59 },
                    { "category": "'10", "value": 33 },
                    { "category": "'11", "value": 46 },
                    { "category": "'12", "value": 20 },
                    { "category": "'13", "value": 42 },
                    { "category": "'14", "value": 59,},
                    { "category": "'15", "value": 70,}
                ], colors.getIndex(d));
            }
            
        }
        
        
    
     }); // end am4core.ready()
});