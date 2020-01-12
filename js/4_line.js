function years2() {
  var start = 2010;
  var end = 2019;
  var condition1 = $("input:radio[name=admit]:checked").val();
  var condition2 = $("select[name=college]").val();
  console.log(condition1, condition2);
  var data1 = [];
  var data2 = [];
  for (var year = start; year <= end; year++) {
    parsing2(year, condition1, condition2, data1, data2);
  }
}

function parsing2(_year, _condition1, _condition2, _data1, _data2) {
  var filename =
    "4page_" + String(_year) + "_colleage_" + _condition1 + ".json";
  var temp1 = { year: _year };
  var temp2 = { year: _year };
  $.getJSON("../../json/" + filename, jsonData => {
    temp1["competition_rate"] = jsonData[_condition2]["competition_rate"];
    temp2["recruitment_rate"] = jsonData[_condition2]["recruitment_rate"];
    _data1.push(temp1);
    _data2.push(temp2);
    if (_data1.length == 10 && _data2.length == 10) {
      drawLineChart(_data1, _data2, _condition1, _condition2);
    }
  });
}

function drawLineChart(_data1, _data2, _condition1, _condition2) {
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    // Create chart instance
    var chart1 = am4core.create("chartdiv2-1", am4charts.XYChart);
    chart1.data = _data1;
    chart1.numberFormatter.numberFormat = "####";
    // var title1 = chart1.titles.create();
    // title1.text = "(단위 : :1)"
    // title1.dx = 430;
    // title1.dy = -10;
    // title1.fontSize = 15;
    // title1.marginBottom = 30;

    var chart2 = am4core.create("chartdiv2-2", am4charts.XYChart);
    chart2.data = _data2;
    chart2.numberFormatter.numberFormat = "####";
    // var title2 = chart2.titles.create();
    // title2.text = "(단위 : %)";
    // title2.dx = 430;
    // title2.dy = -10;
    // title2.fontSize = 15;
    // title2.marginBottom = 30;

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
    categoryAxis1.renderer.grid.template.location = 0;
    categoryAxis1.dataFields.category = "year";
    //categoryAxis.renderer.labels.template.horizontalCenter = "right";

    var categoryAxis2 = chart2.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis2.renderer.minGridDistance = 10;
    categoryAxis2.renderer.grid.template.location = 0;
    categoryAxis2.dataFields.category = "year";
    //categoryAxis.renderer.labels.template.horizontalCenter = "right";

    var max1 = _data1[0]["competition_rate"]; // 경쟁률 최댓값
    var max2 = _data2[0]["recruitment_rate"]; // 충원율 최댓값
    var min1 = _data1[0]["competition_rate"]; // 경쟁률 최솟값
    var min2 = _data2[0]["recruitment_rate"]; // 충원율 최솟값
    for (var i = 1; i < 10; i++) {
      if (max1 < _data1[i]["competition_rate"])
        max1 = _data1[i]["competition_rate"];
      if (max2 < _data2[i]["recruitment_rate"])
        max2 = _data2[i]["recruitment_rate"];
      if (min1 > _data1[i]["competition_rate"])
        min1 = _data1[i]["competition_rate"];
      if (min2 > _data2[i]["recruitment_rate"])
        min2 = _data2[i]["recruitment_rate"];
    }

    createAxisAndSeries(
      chart1,
      "competition_rate",
      "경쟁률",
      "#00a686",
      "경쟁",
      _condition1,
      _condition2,
      max1,
      min1
    );
    createAxisAndSeries(
      chart2,
      "recruitment_rate",
      "충원율",
      "#e8cd05",
      "충원",
      _condition1,
      _condition2,
      max2,
      min2
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
function createAxisAndSeries(
  _chart,
  _value,
  _ko,
  _rgb,
  _title,
  _condition1,
  _condition2,
  _max,
  _min
) {
  var valueAxis = _chart.yAxes.push(new am4charts.ValueAxis());
  var series = _chart.series.push(new am4charts.LineSeries());

  //valueAxis.title.text = _title;
  // valueAxis.min = _min - 1;
  // valueAxis.max = _max + 1;

  series.dataFields.valueY = _value;
  series.dataFields.categoryX = "year";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.tooltip.pointerOrientation = "vertical";
  series.tensionX = 1; // 직선으로 만들어줌
  series.tensionY = 1; // 직선으로 만들어

  series.stroke = _rgb;
  series.fill = _rgb;

  valueAxis.extraMin = 0.15;
  valueAxis.extraMax = 0.15;
  valueAxis.strictMinMax = false;
  // valueAxis.renderer.line.strokeOpacity = 1;
  // valueAxis.renderer.line.strokeWidth = 2;
  // valueAxis.renderer.line.stroke = am4core.color("#ffffff"); //series.stroke;
  // //valueAxis.renderer.labels.template.fill = am4core.color("#ffffff")
  // valueAxis.renderer.opposite = false;
  // valueAxis.renderer.grid.template.disabled = true;

  // 꼭지점 찍기
  var bullet = series.bullets.push(new am4charts.CircleBullet());
  //bullet.circle.stroke = interfaceColors.getFor("background");
  bullet.circle.strokeWidth = 15;
  var check = $("input:radio[name=admit]:checked").val();
  console.log(_condition1, _condition2);
  bullet.tooltipText = "[#000]{year}학년도 ";
  bullet.fill = am4core.color("#fff");
  console.log(check);
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
