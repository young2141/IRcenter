function parsing1() {
  var year = document.getElementById("years").value;
  var cnt = 1;
  var num = 1;
  var tmpYear = year;
  while (cnt <= 3) {
    var categories = ["normal", "special_intent", "specified", "free", "etc"];
    var categories_ko = ["일반고", "특수목적고", "특성화고", "자율고", "기타"];
    var full_highschool = [
      "일반고등학교",
      "특수목적고등학교",
      "특성화고등학교",
      "자율고등학교",
      "기타"
    ];
    var filename = "2page_" + String(year) + ".json";
    var colors = ["#ff3d00", "#ef5350", "#ff7f27", "#ffc102", "#fdf5bc"];
    $.getJSON("../../json/" + filename, jsonData => {
      var data = [];
      for (var i = 0; i < 5; i++) {
        data.push({
          category: categories_ko[i],
          full_name: full_highschool[i],
          value: jsonData[categories[i]],
          color: colors[i]
        });
      }
      drawColumnChart(data, num++, tmpYear--);
    });
    cnt++;
    year--;
  }
}

async function drawColumnChart(_data, _cnt, _year) {
  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    var chart = am4core.create("chartdiv1-" + String(_cnt), am4charts.XYChart);
    chart.data = _data;

    var tit = chart.titles.create();
    tit.text = String(_year) + "학년도";
    tit.marginBottom = 10;
    tit.fontSize = 15;
    tit.paddingLeft = 50;
    // var title = chart.titles.create();
    // title.text = "(단위 : 명)"
    // title.fontSize = 15;
    // title.dx = 120;
    // title.dy = -10;
    // if (_cnt != 3) {
    //     title.fillOpacity = 0;
    // }

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = -90;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 4000;
    if (_cnt >= 2) {
      // valueAxis.renderer.line.stroke = am4core.color("#ffffff")//series.stroke;
      // valueAxis.renderer.labels.template.fill = am4core.color("#ffffff")
      valueAxis.renderer.labels.template.fillOpacity = 0;
    }
    createSeries1(chart, _year);
  });
}

function createSeries1(_chart, _year) {
  var series = _chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = "value";
  series.dataFields.categoryX = "category";
  series.name = "학생수";

  series.tooltip.getFillFromObject = false;
  series.tooltip.label.fill = am4core.color("#000000");
  series.columns.template.tooltipText =
    "[#000]" +
    String(_year) +
    "학년도 전체 신입생 중 {full_name} 출신은 [bold]{valueY}명[] 입니다.";
  series.columns.template.fillOpacity = 0.8;
  series.columns.template.adapter.add("fill", function (fill, target) {
    if (target.dataItem.categoryX == "일반고") {
      return am4core.color("#ff3d00");
    }
    else if (target.dataItem.categoryX == "특수목적고") {
      return am4core.color("#ef5350");
    }

    else if (target.dataItem.categoryX == "특성화고") {
      return am4core.color("#ff7f27");
    }

    else if (target.dataItem.categoryX == "자율고") {
      return am4core.color("#ffc102");
    }

    else if (target.dataItem.categoryX == "기타") {
      return am4core.color("#fdf5bc");
    }
  });
  series.columns.template.stroke = "#ffffff";

  var columnTemplate = series.columns.template;
  columnTemplate.strokeWidth = 2;
  columnTemplate.strokeOpacity = 1;
}
