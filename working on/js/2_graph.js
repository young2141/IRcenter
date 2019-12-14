function parse(callback) {
  $.getJSON("../json/grad_info.json", json => {
    callback(json);
  });
}

function bar_graph(data) {
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

    categoryAxis.renderer.labels.template.adapter.add("dy", function(
      dy,
      target
    ) {
      if (target.dataItem && target.dataItem.index & (2 == 2)) {
        return dy + 25;
      }
      return dy;
    });

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "graduate";
    series.dataFields.categoryX = "year";
    series.name = "졸업자 수";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }); // end am4core.ready()
}

function line_graph(data) {
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
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.dataFields.category = "year";

    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 5;
    valueAxis.max = 8;

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
    bullet.tooltipText = "평균 졸업소요시간: {valueY}년";
  }); // end am4core.ready()
}

function call() {
  parse(json => {
    // console.log(json);

    var college = $(":input:radio[name=college]:checked").val();
    var sex = $(":input:radio[name=sex]:checked").val();

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

    bar_graph(data);
    line_graph(data);
    //console.log(data);
  });
}
