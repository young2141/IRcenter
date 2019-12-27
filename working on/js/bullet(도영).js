function parsing(){
    
}

function drawBullet(){
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var container = am4core.create("chartdiv", am4core.Container);
        container.width = am4core.percent(50);
        container.height = am4core.percent(50);
        container.layout = "vertical";
        
        createBulletChart(container, "solid", {"category" : "행정직", "value" : {"4" : 57, "5" : 54, "6" : 47, "7" : 42, "8" : 33, "9" : 32}});
        createBulletChart(container, "solid", {"category" : "사서직", "value" : {"4" : 60, "5" : 57, "6" : 52, "7" : 34, "8" : 31, "9" : 30}});
        createBulletChart(container, "solid", {"category" : "기술직", "value" : {"4" : 59, "5" : 58, "6" : 49, "7" : 47, "8" : 41, "9" : 35}});
        
        /* Create ranges */
        function createRange(axis, from, to, color) {
          var range = axis.axisRanges.create();
          range.value = from;
          range.endValue = to;
          range.axisFill.fill = color;
          range.axisFill.fillOpacity = 0.8;
          range.label.disabled = true;
          range.grid.disabled = true;
        }
        
        /* Create bullet chart with specified color type for background */
        function createBulletChart(parent, colorType, data) {
          var colors = ["#19d228", "#b4dd1e", "#f4fb16", "#f6d32b", "#fb7116"];
        
          /* Create chart instance */
          var chart = container.createChild(am4charts.XYChart);
          chart.paddingRight = 25;

          var keys = Object.keys(data["value"]);
          var s = 0;
          for(var k=0; k<keys.length; k++){
            s += data["value"][keys[k]];
          }

          /* Add data */
          chart.data = [{
            "category": data["category"],
            "value": (s / keys.length).toFixed(1),
            "target": (s / keys.length + 5).toFixed(1)
          }];

          /* Create axes */
          var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "category";
          categoryAxis.renderer.minGridDistance = 30;
          categoryAxis.renderer.grid.template.disabled = true;
        
          var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.minGridDistance = 70;
          valueAxis.renderer.grid.template.disabled = true;
          valueAxis.min = data["value"]["9"];
          valueAxis.max = data["value"]["4"];
          valueAxis.strictMinMax = true; // 세로 가로 간격맞추기
          valueAxis.numberFormatter.numberFormat = "#";
          valueAxis.renderer.baseGrid.disabled = true;
        
          /* 
            In order to create separate background colors for each range of values, 
            you have to create multiple axisRange objects each with their own fill color 
          */
          if (colorType === "solid") {
            var start, end;
            for (var i = 9; i > 4; i--) {
              start = data["value"][String(i)];
              end = data["value"][String(i-1)];
              createRange(valueAxis, start, end, am4core.color(colors[i-5]));
            }
          }
          /*
            In order to create a gradient background, only one axisRange object is needed
            and a gradient object can be assigned to the axisRange's fill property. 
          */
          else if (colorType === "gradient") {
            var gradient = new am4core.LinearGradient();
            for (var i = 0; i < 5; ++i) {
              // add each color that makes up the gradient
              gradient.addColor(am4core.color(colors[i]));
            }
            createRange(valueAxis, 0, 100, gradient);
          }
        
          /* Create series */
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueX = "value";
          series.dataFields.categoryY = "category";
          series.columns.template.fill = am4core.color("#000");
          series.columns.template.stroke = am4core.color("#fff");
          series.columns.template.strokeWidth = 1;
          series.columns.template.strokeOpacity = 0.5;
          series.columns.template.height = am4core.percent(25);
          series.tooltipText = "{category}의 평균 연령은 {value}살입니다."
        
        
          // var series2 = chart.series.push(new am4charts.StepLineSeries());
          // series2.dataFields.valueX = "target";
          // series2.dataFields.categoryY = "category";
          // series2.strokeWidth = 3;
          // series2.noRisers = true;
          // series2.startLocation = 0.15;
          // series2.endLocation = 0.85;
          // series2.tooltipText = "{valueX}"
          // series2.stroke = am4core.color("#000");
        
          chart.cursor = new am4charts.XYCursor()
          chart.cursor.lineX.disabled = true;
          chart.cursor.lineY.disabled = true;
        
          valueAxis.cursorTooltipEnabled = false;
          chart.arrangeTooltips = false;
        }
        }); // end am4core.ready()
}

drawBullet();