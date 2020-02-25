function parsing() {
  $.getJSON("../json/1번_등록금_데이터(도영).json", (jsonData) => {
    draw(jsonData);
  })
}

function draw(_data) {
  am4core.ready(function () {

    console.log(_data);
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data
    chart.data = _data;
    // Create axes
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "college";
    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;

    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());


    // Create line series
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = "all average";
    lineSeries.dataFields.valueX = "avg";
    lineSeries.dataFields.categoryY = "college";

    lineSeries.stroke = am4core.color("#fdd400");
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    lineSeries.tooltip.label.textAlign = "middle";

    var bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
    bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    var circle = bullet.createChild(am4core.Circle);
    circle.radius = 4;
    circle.fill = am4core.color("#fff");
    circle.strokeWidth = 3;

    // Create column series
    var columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.valueX = "value";
    columnSeries.dataFields.categoryY = "college";
    columnSeries.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    columnSeries.columns.template.strokeWidth = 0;
    columnSeries.columns.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem) {
        switch (target.dataItem.dataContext.year) {
          case "2010":
            return chart.colors.getIndex(0);
            break;
          case "2011":
            return chart.colors.getIndex(1);
            break;
          case "2012":
            return chart.colors.getIndex(2);
            break;
          case "2013":
            return chart.colors.getIndex(3);
            break;
          case "2014":
            return chart.colors.getIndex(4);
            break;
          case "2015":
            return chart.colors.getIndex(5);
            break;
          case "2016":
            return chart.colors.getIndex(6);
            break;
          case "2017":
            return chart.colors.getIndex(7);
            break;
          case "2018":
            return chart.colors.getIndex(8);
            break;
          case "2019":
            return chart.colors.getIndex(9);
            break;
        }
      }
      return fill;
    });

    // Add ranges
    function addRange(label, start, end, color) {
      var range = yAxis.axisRanges.create();
      range.category = start;
      range.endCategory = end;
      range.label.text = label;
      range.label.disabled = false;
      range.label.fill = color;
      range.label.location = 0;
      range.label.dx = -130;
      range.label.dy = 12;
      range.label.fontWeight = "bold";
      range.label.fontSize = 12;
      range.label.horizontalCenter = "left"
      range.label.inside = true;

      range.grid.stroke = am4core.color("#396478");
      range.grid.strokeOpacity = 1;
      range.tick.length = 200;
      range.tick.disabled = false;
      range.tick.strokeOpacity = 0.6;
      range.tick.stroke = am4core.color("#396478");
      range.tick.location = 0;

      range.locations.category = 1;
    }

    for (var i = 2019; i >= 2010; i--) {
      addRange(String(i), "IT대학", "간호대학", chart.colors.getIndex(i - 2010));
      console.log(String(i))
    }

    chart.cursor = new am4charts.XYCursor();

  }); // end am4core.ready()
}

parsing();