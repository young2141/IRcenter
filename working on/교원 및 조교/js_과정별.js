function parse(callback) {
  $.getJSON("professor4.json", json => {
      callback(json);
  });
}

function drawChart() {
  parse(json => {

    am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);
      
      // Add data
      chart.data = json;
      
      // Create category axis
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.minGridDistance = 5;
      
      // Create value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      //valueAxis.title.text = "Place taken";
      valueAxis.renderer.minLabelPosition = 0.01;
      valueAxis.renderer.grid.template.disabled = true;
      
      
      // Create series
      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "학사";
      series1.dataFields.categoryX = "year";
      series1.name = "학사";
      series1.strokeWidth = 3;
      series1.bullets.push(new am4charts.CircleBullet());
      series1.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
      series1.legendSettings.valueText = "{valueY}";
      series1.visible  = false;
      
      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "석사";
      series2.dataFields.categoryX = "year";
      series2.name = '석사';
      series2.strokeWidth = 3;
      series2.bullets.push(new am4charts.CircleBullet());
      series2.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
      series2.legendSettings.valueText = "{valueY}";
      
      var series3 = chart.series.push(new am4charts.LineSeries());
      series3.dataFields.valueY = "박사";
      series3.dataFields.categoryX = "year";
      series3.name = '박사';
      series3.strokeWidth = 3;
      series3.bullets.push(new am4charts.CircleBullet());
      series3.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
      series3.legendSettings.valueText = "{valueY}";
      
      
      // Add legend
      chart.legend = new am4charts.Legend();
      
      }); // end am4core.ready()

  });
}
