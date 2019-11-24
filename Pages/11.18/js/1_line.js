function years2() {
  var start = 2010;
  var end = 2019;
  var condition = $("input:radio[name=입학안내]:checked").val();
  var data1 = [];
  var data2 = [];
  console.log("라인", condition);
  for (var year = start; year <= end; year++) {
    parsing2(year, condition, data1, data2);
  }
}

function parsing2(year, condition, data1, data2) {
  var filename = "1page_" + String(year) + "_rates.json";
  var temp1 = { year: year };
  var temp2 = { year: year };
  $.getJSON("../../json/" + filename, jsonData => {
    temp1["competition_rate"] =
      jsonData[condition][condition + "_competition_rate"];
    temp2["recruitment_rate"] =
      jsonData[condition][condition + "_recruitment_rate"];
    data1.push(temp1);
    data2.push(temp2);
    if (data1.length == 10 && data2.length == 10) {
      drawLineChart(data1, data2, condition);
    }
  });
}

function drawLineChart(_data1, _data2, _condition) {
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    // Create chart instance
    var chart1 = am4core.create("chartdiv2-1", am4charts.XYChart);
    chart1.data = _data1;
    chart1.numberFormatter.numberFormat = "####";
    var title1 = chart1.titles.create();
    title1.text = "(단위 : χ:1)";
    title1.dx = 430;
    title1.dy = -10;
    title1.fontSize = 15;
    title1.marginBottom = 30;

    var chart2 = am4core.create("chartdiv2-2", am4charts.XYChart);
    chart2.data = _data2;
    chart2.numberFormatter.numberFormat = "####";
    var title2 = chart2.titles.create();
    title2.text = "(단위 : %)";
    title2.dx = 430;
    title2.dy = -10;
    title2.fontSize = 15;
    title2.marginBottom = 30;

    // var title1 = chart1.titles.create();
    // title1.text = "경쟁률"
    // title1.fontSize = 25;
    // title1.marginBottom = 30;

    // var title2 = chart2.titles.create();
    // title2.text = "충원율"
    // title2.fontSize = 25;
    // title2.marginBottom = 30;

    // Create axes
    var categoryAxis1 = chart1.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis1.renderer.minGridDistance = 10;
    categoryAxis1.dataFields.category = "year";
    //categoryAxis.renderer.labels.template.horizontalCenter = "right";

    var categoryAxis2 = chart2.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis2.renderer.minGridDistance = 10;
    categoryAxis2.dataFields.category = "year";
    //categoryAxis.renderer.labels.template.horizontalCenter = "right";

    createAxisAndSeries(
      chart1,
      "competition_rate",
      "경쟁률",
      "#00a686",
      "경쟁",
      _condition
    );
    createAxisAndSeries(
      chart2,
      "recruitment_rate",
      "충원율",
      "#e8cd05",
      "충원",
      _condition
    );
    // // Add legend
    // chart.legend = new am4charts.Legend();
    // // Add cursor
    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.lineX.disabled = true;
    // chart.cursor.lineY.disabled = true;
  });
}

// _valueY_ko, _valueY_ko_title, _min, _max
function createAxisAndSeries(_chart, _value, _ko, _rgb, _title, _condition) {
  var valueAxis = _chart.yAxes.push(new am4charts.ValueAxis());
  var series = _chart.series.push(new am4charts.LineSeries());

  //valueAxis.title.text = _title;

  console.log(_condition);
  if (_condition == "over") {
    if (_ko == "경쟁률") {
      valueAxis.min = 0;
      valueAxis.max = 9;
    } else {
      valueAxis.min = 70;
      valueAxis.max = 125;
    }
  } else if (_condition == "total") {
    if (_ko == "경쟁률") {
      valueAxis.min = 5;
      valueAxis.max = 13;
    } else {
      valueAxis.min = 95;
      valueAxis.max = 102;
    }
  } else {
    // 정원내
    if (_ko == "경쟁률") {
      valueAxis.min = 5;
      valueAxis.max = 14;
    } else {
      valueAxis.min = 98;
      valueAxis.max = 101;
    }
  }

  series.dataFields.valueY = _value;
  series.dataFields.categoryX = "year";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.tooltip.pointerOrientation = "vertical";
  series.tensionX = 1; // 직선으로 만들어줌
  series.tensionY = 1; // 직선으로 만들어

  series.stroke = _rgb;
  series.fill = _rgb;

  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = am4core.color("#ffffff"); //series.stroke;
  //valueAxis.renderer.labels.template.fill = am4core.color("#ffffff")
  valueAxis.renderer.opposite = false;
  valueAxis.renderer.grid.template.disabled = true;

  // 꼭지점 찍기
  var bullet = series.bullets.push(new am4charts.CircleBullet());
  //bullet.circle.stroke = interfaceColors.getFor("background");
  bullet.circle.strokeWidth = 15;
  var check = $("input:radio[name=입학안내]:checked").val();
  bullet.tooltipText = "[#000]{year}학년도 ";
  bullet.fill = am4core.color("#fff");
  if (check == "within") bullet.tooltipText += "정원내 ";
  else if (check == "total") bullet.tooltipText += "전체 ";
  else if (check == "over") bullet.tooltipText += "정원외 ";
  bullet.tooltipText +=
    "신입생 " +
    _ko +
    "은 [bold]{valueY}" +
    (_ko == "경쟁률" ? ":1" : "%") +
    "[] 입니다.";
}
