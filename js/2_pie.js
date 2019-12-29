function parsing2() {
  var filename = "2page_2019.json";
  $.getJSON("../../json/" + filename, (jsonData) => {
    var result = [];
    var categories = ["normal", "special_intent", "specified", "free", "etc"];
    var categories_ko = ["일반고", "특수목적고", "특성화고", "자율고", "기타"];
    var full_highschool = [
      "일반고등학교",
      "특수목적고등학교",
      "특성화고등학교",
      "자율고등학교",
      "기타"
    ];
    for (var i = 0; i < categories.length; i++) {
      result.push({
        category: categories_ko[i],
        full_name: full_highschool[i],
        value: jsonData[categories[i]]
      });
    }
    drawPieChart(result);
  });
}

function drawPieChart(_data) {
  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    var chart = am4core.create("chartdiv2", am4charts.PieChart);
    // var title = chart.titles.create();
    // title.text = "(단위 : : %)"
    // title.fontSize = 15;
    // title.dx = 140;
    // title.dy = 0;

    chart.data = _data;
    createSeries2(chart);
  });
}

function createSeries2(_chart) {
  var pieSeries = _chart.series.push(new am4charts.PieSeries());
  console.log("?!", pieSeries);
  pieSeries.dataFields.value = "value";
  pieSeries.dataFields.category = "category";
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;
  pieSeries.slices.template.stroke = am4core.color("#ffffff");
  pieSeries.tooltip.getFillFromObject = false;
  pieSeries.slices.template.tooltipText =
    "[#000]2019학년도 전체 신입생 중 {full_name} 출신은 [bold]{value.percent.formatNumber('#.#')}%[] 입니다.";
  // 툴팁에 실제 value값도 필요하다면 ({value}명) 추가하기
  pieSeries.tooltip.label.fill = am4core.color("#000000");
  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;
  pieSeries.colors.list = [
    "#ff3d00",
    "#ef5350",
    "#ff7f27",
    "#ffc102",
    "#fdf5bc"
  ].map(color => {
    return new am4core.color(color);
  });
}