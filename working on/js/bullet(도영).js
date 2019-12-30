function parsing(){
    
}

function drawBullet(){
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var container1 = am4core.create("chartdiv1", am4core.Container);
        container1.width = am4core.percent(90);
        container1.height = am4core.percent(90);
        container1.layout = "vertical";

        var container2 = am4core.create("chartdiv2", am4core.Container);
        container2.width = am4core.percent(90);
        container2.height = am4core.percent(90);
        container2.layout = "vertical";
        
      
        createBulletChart(container1, "평균연령", "solid", {"category" : "행정직", "value" : {"9" : 32, "8" : 33, "7" : 42, "6" : 47, "5" : 54, "4" : 57, "고위공무원" : 61}});
        createBulletChart(container1, "평균연령", "solid", {"category" : "사서직", "value" : {"9" : 30, "8" : 31, "7" : 34, "6" : 52, "5" : 57, "4" : 60}});
        createBulletChart(container1, "평균연령", "solid", {"category" : "기술직", "value" : {"9" : 35, "8" : 41, "7" : 47, "6" : 49, "5" : 58, "4" : 59}});
        createBulletChart(container1, "평균연령", "solid", {"category" : "전산직", "value" : {"8" : 40, "7" : 41, "6" : 53, "5" : 57}});
        createBulletChart(container1, "평균연령", "solid", {"category" : "전문경력관", "value" : {"7" : 56}});
        createBulletChart(container1, "평균연령", "solid", {"category" : "관리운영", "value" : {"8" : 52, "7" : 54, "6" : 57}});

        createBulletChart(container2, "평균근속년수", "solid", {"category" : "행정직", "value" : {"9" : 2, "8" : 5, "7" : 13, "6" : 19, "5" : 29, "4" : 32, "고위공무원" : 25}});
        createBulletChart(container2, "평균근속년수", "solid", {"category" : "사서직", "value" : {"9" : 3, "8" : 6, "7" : 12, "6" : 28, "5" : 33, "4" : 37}});
        createBulletChart(container2, "평균근속년수", "solid", {"category" : "기술직", "value" : {"9" : 2, "8" : 7, "7" : 16, "6" : 20, "5" : 32, "4" : 39}});
        createBulletChart(container2, "평균근속년수", "solid", {"category" : "전산직", "value" : {"8" : 8, "7" : 9,  "5" : 13, "6" : 25}});
        createBulletChart(container2, "평균근속년수", "solid", {"category" : "전문경력관", "value" : {"7" : 14}});
        createBulletChart(container2, "평균근속년수", "solid", {"category" : "관리운영", "value" : {"8" : 12, "7" : 27, "6" : 29}});
        
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
        function createBulletChart(parent, dataType, colorType, data) {
          var colors = {
            "9" : "#19d228", 
            "8" : "#b4dd1e", 
            "7" : "#f4fb16", 
            "6" : "#f6d32b", 
            "5" : "#fb7116",
            "4" : "#a93700",
            "고위공무원" : "#ff0000"
          };
        
          /* Create chart instance */
          if(dataType == "평균연령") var chart = container1.createChild(am4charts.XYChart);
          else var chart = container2.createChild(am4charts.XYChart);
          
          chart.paddingRight = 25;

          var keys = Object.keys(data["value"]);

          keys.sort(function(a,b) {
            return data["value"][a] - data["value"][b];
          })

          // data["value"]["end"] = data["value"][keys[keys.length - 1]] + 2;
          // keys.push("end");
          
          console.log(data["value"])
          var s = 0;
          for(var k=0; k<keys.length; k++){
            if(keys[k] == "end") continue;
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
          valueAxis.min = data["value"][keys[0]];
          valueAxis.max = data["value"][keys[keys.length-1]];
          valueAxis.strictMinMax = true; // 세로 가로 간격맞추기
          valueAxis.numberFormatter.numberFormat = "#";
          valueAxis.renderer.baseGrid.disabled = true;
        
          /* 
            In order to create separate background colors for each range of values, 
            you have to create multiple axisRange objects each with their own fill color 
          */
          if (colorType === "solid") {
            var start, end;
            for (var i = 0; i < keys.length; i++) {
              start = data["value"][keys[i]];
              end = data["value"][keys[i+1]];
              createRange(valueAxis, start, end, am4core.color(colors[keys[i]]));
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
          if(dataType == "평균연령") series.tooltipText = "{category}의 평균 연령은 {value}세 입니다."
          else series.tooltipText = "{category}의 평균 근속연수는 {value}년 입니다."
        
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