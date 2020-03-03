function parsing() {
  var year = "2019";
  $.getJSON("../../../working on/json/4번_등록금(도영)/" + year + "년도_등록금_데이터4.json", (jsonData) => {
    draw(jsonData);
  })
}
function draw(_data) {
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    console.log(_data);
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.data = _data;

    //create category axis for years
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "college";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;

    //create value axis for income and expenses
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;


    //create columns
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "college";
    series.dataFields.valueX = "value";
    series.name = "학과별 등록금 평균";
    series.columns.template.fillOpacity = 0.5;
    series.columns.template.strokeOpacity = 0;
    series.tooltipText = "{categoryY}학과 : {valueX.value}원";

    //create line
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryY = "college";
    lineSeries.dataFields.valueX = "allAvg";
    lineSeries.name = "Avg";
    lineSeries.strokeWidth = 3;
    lineSeries.tooltipText = "학교 전체 평균 : {valueX.value}";

    // //add bullets
    // var circleBullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    // circleBullet.circle.fill = am4core.color("#fff");
    // circleBullet.circle.strokeWidth = 2;

    //add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    //add legend
    chart.legend = new am4charts.Legend();

  }); // end am4core.ready()
}

parsing();