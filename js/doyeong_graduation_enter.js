function parsing() {
  var filename = "doyeong_graduation_and_enter.json";
  var gender = $('select[name="성별"]').val();
  gender = gender.toLowerCase();

  $.getJSON("../../../json/" + filename, jsonData => {
    var dataColumn = [];
    var dataLine = [];

    for (var i = 0; i < jsonData.length; i++) {
      dataColumn.push({
        category: jsonData[i]["category"],
        value: jsonData[i]["enter_number_" + gender]
      });

      dataLine.push({
        category: jsonData[i]["category"],
        value: jsonData[i]["enter_percentage_" + gender]
      });
    }
    console.log(dataColumn, dataLine);
    drawColumn(dataColumn);
    drawLine(dataLine);
  });
}

function drawColumn(_data) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv1", am4charts.XYChart);

    // Add data
    chart.data = _data;

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }); // end am4core.ready()
}

function drawLine(_data) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv2", am4charts.XYChart);
    chart.data = _data;

    var max = getMaxVal(chart.data);
    var min = getMinVal(chart.data);

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "category";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = min - 2;
    // valueAxis.max = max + 2;
    valueAxis.extraMin = 0.15;
    valueAxis.extraMax = 0.15;
    valueAxis.strictMinMax = false;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.tooltipText = "{value}";

    series.tooltip.pointerOrientation = "vertical";

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 15;
    bullet.fill = am4core.color("#fff");
    bullet.tooltipText = "[#000]{category}학년도 진학률 : [bold]{value}%[/]";
  }); // end am4core.ready()
}

function getMaxVal(data) {
  var result = data[0]["value"];
  for (var i = 1; i < data.length; i++) {
    if (result < data[i]["value"]) result = data[i]["value"];
  }

  return result;
}

function getMinVal(data) {
  var result = data[0]["value"];
  for (var i = 1; i < data.length; i++) {
    if (result > data[i]["value"]) result = data[i]["value"];
  }
  return result;
}
