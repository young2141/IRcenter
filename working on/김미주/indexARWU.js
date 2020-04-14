
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv2", am4charts.RadarChart);

        chart.data = [{
            "country": "Alumni",
            "litres": 0
          }, {
            "country": "Award",
            "litres": 0
          }, {
            "country": "HiCi",
            "litres": 10.4
          }, {
            "country": "N&S",
            "litres": 3.6
          }, {
            "country": "PUB",
            "litres": 38.6
          }, {
            "country": "PCP",
            "litres": 16.8
          }];

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.axisFills.template.fill = chart.colors.getIndex(2);
        valueAxis.renderer.axisFills.template.fillOpacity = 0.05;
        valueAxis.renderer.gridType = "polygons"

        /* Create and configure series */
        var series = chart.series.push(new am4charts.RadarSeries());
        series.dataFields.valueY = "litres";
        series.dataFields.categoryX = "country";
        series.strokeWidth = 3;
        // series.fill = am4core.color("#0066CC");
        series.fillOpacity = 1;
        

    }); // end am4core.ready()

am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv3", am4charts.RadarChart);

    chart.data = [{
        "country": "Alumni",
        "litres": 0
      }, {
        "country": "Award",
        "litres": 0
      }, {
        "country": "HiCi",
        "litres": 10.4
      }, {
        "country": "N&S",
        "litres": 3.6
      }, {
        "country": "PUB",
        "litres": 38.6
      }, {
        "country": "PCP",
        "litres": 16.8
      }];

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.axisFills.template.fill = chart.colors.getIndex(2);
    valueAxis.renderer.axisFills.template.fillOpacity = 0.05;
    valueAxis.renderer.gridType = "polygons"

    /* Create and configure series */
    var series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = "litres";
    series.dataFields.categoryX = "country";
    series.strokeWidth = 3;
    // series.fill = am4core.color("#0066CC");
    series.fillOpacity = 1;
    

}); // end am4core.ready()

am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv4", am4charts.XYChart);
    
    
    // Add data
    chart.data = [{
      "year": "2015",
      "Alumni": 0,
      "Award": 0,
      "HiCi": 2.08,
      "N&S": 0.72,
      "PUB": 7.72,
      "PCP": 1.68
    }];
    
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;
    
    // Create series
    function createSeries(field, name) {
      
      // Set up series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.sequencedInterpolation = true;
      
      // Make it stacked
      series.stacked = true;
      
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
      
      // Add label
      var labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;
      
      return series;
    }
    
    createSeries("Alumni", "Alumni");
    createSeries("Award", "Award");
    createSeries("HiCi", "HiCi");
    createSeries("N&S", "N&S");
    createSeries("PUB", "PUB");
    createSeries("PCP", "PCP");
    
    // Legend
    chart.legend = new am4charts.Legend();
    
    }); // end am4core.ready()

    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chartdiv5", am4charts.XYChart);
        
        
        // Add data
        chart.data = [{
          "year": "2015",
          "Alumni": 0,
          "Award": 0,
          "HiCi": 2.08,
          "N&S": 0.72,
          "PUB": 7.72,
          "PCP": 1.68
        }];
        
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;
        
        // Create series
        function createSeries(field, name) {
          
          // Set up series
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.name = name;
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "year";
          series.sequencedInterpolation = true;
          
          // Make it stacked
          series.stacked = true;
          
          // Configure columns
          series.columns.template.width = am4core.percent(60);
          series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
          
          // Add label
          var labelBullet = series.bullets.push(new am4charts.LabelBullet());
          labelBullet.label.text = "{valueY}";
          labelBullet.locationY = 0.5;
          labelBullet.label.hideOversized = true;
          
          return series;
        }
        
        createSeries("Alumni", "Alumni");
        createSeries("Award", "Award");
        createSeries("HiCi", "HiCi");
        createSeries("N&S", "N&S");
        createSeries("PUB", "PUB");
        createSeries("PCP", "PCP");
        
        // Legend
        chart.legend = new am4charts.Legend();
        
        }); // end am4core.ready()


