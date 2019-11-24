function doParsing(filename, callback) {
  $.getJSON("../json/" + filename, jsonData => {
    var data = [];
    for (var i = 0; i < jsonData.length; i++) {
      var temp = {};
      temp["category"] = jsonData[i].category;
      temp["high"] = jsonData[i].high;
      temp["tf"] = jsonData[i].tf;
      temp["avg"] = jsonData[i].avg;
      temp["sf"] = jsonData[i].sf;
      temp["low"] = jsonData[i].low;
      data.push(temp);
    }
    if (data.length == jsonData.length) {
      callback(data);
    }
  });
}

function draw(year) {
  var fileName = "10월_1주차_3_" + String(year) + ".json";
  doParsing(fileName, _data => {
    am4core.ready(function() {
      // Themes begin
      am4core.useTheme(am4themes_material);
      am4core.useTheme(am4themes_animated);
      // Themes end

      var chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.paddingRight = 20;

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "category";

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.inversed = true;
      valueAxis.min = 1;
      valueAxis.max = 8;

      var series = chart.series.push(new am4charts.CandlestickSeries());
      series.dataFields.categoryX = "category";
      series.dataFields.valueY = "sf";
      series.dataFields.openValueY = "tf";
      series.dataFields.lowValueY = "low";
      series.dataFields.highValueY = "high";
      series.simplifiedProcessing = true;
      series.tooltipText =
        "최고등급 : {highValueY.value}\n상위25% : {openValueY.value}\n평균 : {avg}\n상위75% : {valueY.value}\n상위85% : {lowValueY.value}";
      series.riseFromOpenState = undefined;
      series.dropFromOpenState = undefined;

      chart.cursor = new am4charts.XYCursor();

      var medianaSeries = chart.series.push(new am4charts.StepLineSeries());
      medianaSeries.noRisers = true;
      medianaSeries.startLocation = 0.1;
      medianaSeries.endLocation = 0.9;
      medianaSeries.dataFields.valueY = "avg";
      medianaSeries.dataFields.categoryX = "category";
      medianaSeries.strokeWidth = 2;
      medianaSeries.stroke = am4core.color("#fff");

      var topSeries = chart.series.push(new am4charts.StepLineSeries());
      topSeries.noRisers = true;
      topSeries.startLocation = 0.2;
      topSeries.endLocation = 0.8;
      topSeries.dataFields.valueY = "high";
      topSeries.dataFields.categoryX = "category";
      topSeries.stroke = chart.colors.getIndex(0);
      topSeries.strokeWidth = 2;

      var bottomSeries = chart.series.push(new am4charts.StepLineSeries());
      bottomSeries.noRisers = true;
      bottomSeries.startLocation = 0.2;
      bottomSeries.endLocation = 0.8;
      bottomSeries.dataFields.valueY = "low";
      bottomSeries.dataFields.categoryX = "category";
      bottomSeries.stroke = chart.colors.getIndex(0);
      bottomSeries.strokeWidth = 2;

      chart.scrollbarX = new am4core.Scrollbar();

      console.log(_data);
      chart.data = _data;

      /*addMediana();
            function addMediana() {
                for (var i = 0; i < chart.data.length; i++) {
                    var dataItem = chart.data[i];
                    dataItem.mediana = Number(dataItem.low) + (Number(dataItem.high) - Number(dataItem.low)) / 2;
                }
            }*/
    }); // end am4core.ready()
  });
}

draw(2019);
