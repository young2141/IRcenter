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
        var container = am4core.create("chartdeclare2", am4core.Container);
        container.layout = "grid";
        container.fixedWidthGrid = false;
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);
        
        // Color set
        var colors = new am4core.ColorSet();
        
        
        function createColumn(title, data, color) {
        
            var chart = container.createChild(am4charts.XYChart);
            chart.width = am4core.percent(90);
            chart.height = am4core.percent(60);
        
            chart.data = data;
        
        
            chart.padding(5, 5, 2, 5);
        
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.minGridDistance = 1;
        
            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.renderer.grid.template.disabled = false;
            valueAxis.renderer.baseGrid.disabled = false;
            valueAxis.renderer.labels.template.disabled = false;
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
            var nd=0
            var fromvalue = json[i].value;
            var tovalue
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
            if(temp.value>=100)continue;               
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
    
     }); // end am4core.ready()
});