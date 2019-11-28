function years1() {
  var start = 2010;
  var end = 2019;
  var condition = $("input:radio[name=입학안내]:checked").val();
  console.log("레이어", condition);
  var data = [];
  for (var year = start; year <= end; year++) {
    parsing1(year, condition, data);
  }
}

function parsing1(year, condition, data) {
  var filename = "1page_" + String(year) + "_ARA.json";
  var temp = { year: String(year) };
  $.getJSON("../../json/" + filename, jsonData => {
    temp["recruitment"] =
      jsonData[condition]["recruitment_" + condition + "_admission"];
    temp["applied"] =
      jsonData[condition]["applied_" + condition + "_admission"];
    temp["admitted"] =
      jsonData[condition]["admitted_" + condition + "_admission"];
    data.push(temp);
    if (data.length === 10) {
      drawLayeredChart(data);
    }
  });
}

function drawLayeredChart(_data) {
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);

    var chart = am4core.create("chartdiv1", am4charts.XYChart);
    chart.data = _data;
    chart.numberFormatter.numberFormat = "#,###";
    // var title = chart.titles.create();
    // title.text = "(단위 : 명)"
    // title.fontSize = 15;
    // title.marginBottom = 30;
    // title.dx = 450;
    // title.dy = -5;

    // Create axes : 가로축
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    // 세로축
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.title.text = "인원 수 (명)"; // 세로축 설명
    // valueAxis.title.fontWeight = 800; // 걍 글자 굵기
    // valueAxis.unitPosition = "left";

    var values = ["applied", "recruitment", "admitted"];
    var korean = ["지원인원", "모집인원", "입학인원"];
    var RGB = ["#0054ff", "#32a600", "#ff1212"];

    for (var i = 0; i < 3; i++) {
      createSeries(chart, values[i], korean[i], 80 - i * 28, RGB[i]);
    }
    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.lineX.disabled = true;
    // chart.cursor.lineY.disabled = true;

    //chart.legend = new am4charts.Legend();
  }); // end iter callback function
}

function createSeries(_chart, value, ko, percent, rgb) {
  var series = _chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = value; // 총 지원자 수
  series.dataFields.categoryX = "year";
  series.name = ko;
  series.clustered = false;
  series.columns.template.width = am4core.percent(percent);
  series.columns.template.stroke = am4core.color(rgb); // color
  series.columns.template.fill = am4core.color(rgb); // color
}
