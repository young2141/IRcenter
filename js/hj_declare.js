var color1 = {
    "인문대학": "#FFD8D8",
    "사회과학대학": "#F15F5F",
    "자연과학대학": "#FAE0D4",
    "경상대학": "#F29661",
    "공과대학": "#FAECC5",
    "IT대학": "#F2CB61",
    "농업생명과학대학": "#FAF4C0",
    "예술대학": "#E5D85C",
    "사범대학": "#34F7BA",
    "의과대학": "#BCE55C",
    "치과대학": "#CEF279",
    "수의과대학": "#9FC93C",
    "생활과학대학": "#B7F0B1",
    "간호대학": "#47C8CE",
    "약학대학": "#B2EBF4",
    "글로벌인재학부": "#5CD1E5",
    "행정학부": "#D9E5FF",
    "법과대학": "#6699FF",
    "자율전공부": "#DAD9FF",
    "No Degree": "#6B66FF"
};

var color2=[]

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
        container.layout = "horizontal";
        container.fixedWidthGrid = false;
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);

        var columContainer = container.createChild(am4core.Container);
        columContainer.layout = "vertical";
        columContainer.width = am4core.percent(80);
        columContainer.height = am4core.percent(100);



        var lineContainer = container.createChild(am4core.Container);
        lineContainer.layout = "vertical";
        lineContainer.width = am4core.percent(20);
        lineContainer.height = am4core.percent(100);
        // Color set
        var colors = new am4core.ColorSet();
        
        // Functions that create various sparklines
        function createLine(title, data, color) {
        
            var chart = lineContainer.createChild(am4charts.XYChart);
            chart.layout = "vertical"
            chart.width = am4core.percent(90);
            chart.height = 16.5;
        
            chart.data = data;
        
            chart.titles.template.fontSize = 10;
            chart.titles.template.textAlign = "left";
            chart.titles.template.isMeasured = false;
            chart.titles.create().text = title;
            
        
            chart.padding(0, 0, 0, 0);

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
            chart.width = am4core.percent(90);
            chart.height = am4core.percent(100);
        
            chart.data = data;
        
            chart.titles.template.fontSize = 10;
            chart.titles.template.textAlign = "left";
            chart.titles.template.isMeasured = false;
            chart.titles.create().text = title;
            chart.dataFields.fromName = "category";

            
        
            chart.padding(0, 0, 0, 0);

            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.minGridDistance = 65;
        
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
            chart.width = am4core.percent(90);
            chart.height = am4core.percent(100);
        
            chart.data = data;
        
        
            chart.padding(5, 5, 2, 5);
        
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.renderer.labels.template.width = 50;
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.minGridDistance = 1;
        
            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.renderer.grid.template.disabled = false;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.labels.template.disabled = false;
            valueAxis.renderer.minGridDistance = 60;
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
            series.columns.template.fill = "color";
            series.columns.template.adapter.add("fill", function(fill, target) {
                clr = color1[target.dataItem.categoryY];
                color2.push(clr)
                return am4core.color(clr);
            });
        
            return chart;
        }
        
        //그리기시작
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
            temp["color"] =   color1[(json[i].from).trim()];          
            data.push(temp)

            var check=0
            if(colorcnt!=0){
                var k
                for(k =0;k<data.length;k++){
                    if(temp.value<=data[k].value){
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
        for(var d=data.length-1 ;d>=0;d--){
            if(d<=0){
                console.log(data[d].category+"는 "+data[d].color)
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
                ], data[d].color);
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
                ], data[d].color);
            }
            
        }
        
        
    
     }); // end am4core.ready()
});