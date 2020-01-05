function parse(callback) {
  $.getJSON("../../../json/grad_info.json", json => {
    callback(json);
  });
}

function bar_graph(data, college) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv1", am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    // categoryAxis.renderer.labels.template.adapter.add("dy", function(
    //   dy,
    //   target
    // ) {
    //   if (target.dataItem && target.dataItem.index & (2 == 2)) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "graduate";
    series.dataFields.categoryX = "year";
    series.name = "졸업자 수";
    series.columns.template.tooltipText =
      "{categoryX}" + " " + college + " 졸업생 : [bold]{valueY}[/] 명";
    series.columns.template.fillOpacity = 0.8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }); // end am4core.ready()
}

function line_graph(data, college) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv2", am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "year";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = parseFloat(small) - 0.5;
    // valueAxis.max = parseFloat(big) + 0.5;
    valueAxis.strictMinMax = false;
    valueAxis.extraMin = 0.15;
    valueAxis.extraMax = 0.15;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "time";
    series.dataFields.categoryX = "year";
    series.strokeWidth = 2;
    series.yAxis = valueAxis;
    series.tooltip.pointerOrientation = "vertical";
    series.tensionX = 1; // 직선으로 만들어줌
    series.tensionY = 1; // 직선으로 만들어
    series.stroke = "#00a686";
    series.fill = "#00a686";

    // Add simple bullet
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 15;
    bullet.fill = am4core.color("#00a686");
    bullet.tooltipText =
      "{categoryX} " + college + " 평균 졸업소요시간: {valueY}년";
  }); // end am4core.ready()
}

function call() {
  parse(json => {
    var college = $("#college").val();
    var sex = $("#sex").val();

    data = [];
    for (var i = 0; i < json.length; i++) {
      year_data = {};
      year_data["year"] = json[i]["year"];
      year_data["graduate"] = json[i][college][sex];
      year_data["time"] = (
        json[i][college]["time taken"] / json[i][college]["count"]
      ).toFixed(2);

      data.push(year_data);
    }
    if (college == "society") college = "인문사회계열의";
    else if (college == "artphysical") college = "예체능계열의";
    else if (college == "science") college = "자연과학계열의";
    else if (college == "mech") college = "공학계열의";
    else college = "전체";

    bar_graph(data, college);
    line_graph(data, college);
  });
}
