function parse(callback, year) {
  $.getJSON(String(year) + ".json", json => {
    console.log(json);
    callback(json);
  });
}
function draw() {
  var year = document.getElementById("years").value;
  console.log(year);
  parse(json => {
    data = [];
    for (var i = 10; i > 0; i--) {
      data.push(json[json.length - i]);
    }

    am4core.ready(function() {
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data
      chart.data = data;

      // Create axes
      var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      yAxis.dataFields.category = "major";
      yAxis.renderer.grid.template.location = 0;
      yAxis.renderer.labels.template.fontSize = 10;
      yAxis.renderer.minGridDistance = 10;

      var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
      xAxis.min = 0;

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = "tuition";
      series.dataFields.categoryY = "major";
      series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
      series.columns.template.strokeWidth = 0;
      //   series.columns.template.adapter.add("fill", function(fill, target) {
      //     if (target.dataItem) {
      //       switch (target.dataItem.dataContext.region) {
      //         case "Central":
      //           return chart.colors.getIndex(0);
      //           break;
      //         case "East":
      //           return chart.colors.getIndex(1);
      //           break;
      //         case "South":
      //           return chart.colors.getIndex(2);
      //           break;
      //         case "West":
      //           return chart.colors.getIndex(3);
      //           break;
      //       }
      //     }
      //     return fill;
      //   });

      // Add ranges

      chart.cursor = new am4charts.XYCursor();
    }); // end am4core.ready()
  }, year);
}
