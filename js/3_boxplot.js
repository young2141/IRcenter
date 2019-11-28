function years1() {
  // var start = 2015;
  // var end = 2019;
  // for (var year = start, cnt = 1; year <= end; year++ , cnt++) {
  //     parsing1(year, cnt)
  // }
  parsing1(2019);
}

function parsing1(_year) {
  var filename = "3page_" + String(_year) + ".json";
  $.getJSON("../../json/" + filename, jsonData => {
    drawBoxplotChart(jsonData, _year);
  });
}

function drawBoxplotChart(_data, _year) {
  am4core.ready(function() {
    //Themes begin
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv1", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.lineX.disabled = true;

    // var title = chart.titles.create();
    // title.text = "(단위 : 등급)";
    // title.fontSize = 15;
    // title.dx = 450;
    // title.dy = -11;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "category";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.inversed = true;
    valueAxis.min = 1;
    valueAxis.max = 4.5;

    chart.data = _data;
    var series = chart.series.push(new am4charts.CandlestickSeries());
    series.dataFields.categoryX = "category";
    series.dataFields.categoryX.fontSize = 17;
    series.dataFields.valueY = "sf";
    series.dataFields.openValueY = "tf";
    series.dataFields.lowValueY = "low";
    series.dataFields.highValueY = "high";
    series.simplifiedProcessing = true;
    series.tooltip.getFillFromObject = false;
    series.tooltip.label.fill = am4core.color("#000000");
    series.tooltipText = "2019학년도 {categoryX}전형";
    series.tooltipText += "\n최고등급은 [bold]{highValueY}등급[]입니다.";
    series.tooltipText += "\n상위 25% 등급은 [bold]{openValueY}등급[]입니다.";
    series.tooltipText += "\n평균등급은 [bold]{avg}등급[]입니다.";
    series.tooltipText += "\n상위 75% 등급은 [bold]{valueY}등급[]입니다.";
    series.tooltipText += "\n상위 85% 등급은 [bold]{lowValueY}등급[]입니다.";
    series.riseFromOpenState = undefined;
    series.dropFromOpenState = undefined;

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
    topSeries.stroke = am4core.color("#ccc");
    topSeries.strokeWidth = 2;

    var bottomSeries = chart.series.push(new am4charts.StepLineSeries());
    bottomSeries.noRisers = true;
    bottomSeries.startLocation = 0.2;
    bottomSeries.endLocation = 0.8;
    bottomSeries.dataFields.valueY = "low";
    bottomSeries.dataFields.categoryX = "category";
    bottomSeries.stroke = am4core.color("#ccc");
    bottomSeries.strokeWidth = 2;

    series.columns.template.adapter.add("stroke", function(stroke, target) {
      if (target.dataItem.categoryX == "학생부교과")
        return am4core.color("#a9cbe4");
      else if (target.dataItem.categoryX == "논술")
        return am4core.color("#fac18e");
      else if (target.dataItem.categoryX == "학생부종합 일반")
        return am4core.color("#96caac");
      else if (target.dataItem.categoryX == "학생부종합 농어촌")
        return am4core.color("#fc9e96");
      else if (target.dataItem.categoryX == "정시 일반")
        return am4core.color("#e1b3fa");
    });
    series.columns.template.adapter.add("fill", function(fill, target) {
      if (target.dataItem.categoryX == "학생부교과")
        return am4core.color("#a9cbe4");
      else if (target.dataItem.categoryX == "논술")
        return am4core.color("#fac18e");
      else if (target.dataItem.categoryX == "학생부종합 일반")
        return am4core.color("#96caac");
      else if (target.dataItem.categoryX == "학생부종합 농어촌")
        return am4core.color("#fc9e96");
      else if (target.dataItem.categoryX == "정시 일반")
        return am4core.color("#e1b3fa");
    });

    /*addMediana();
        function addMediana() {
            for (var i = 0; i < chart.data.length; i++) {
                var dataItem = chart.data[i];
                dataItem.mediana = Number(dataItem.low) + (Number(dataItem.high) - Number(dataItem.low)) / 2;
            }
        }*/
  }); // end am4core.ready()
}
