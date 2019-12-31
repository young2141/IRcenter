function parse(callback, filename) {
  $.getJSON("../../../json/" + filename, json => {
    callback(json);
  });
}

function line_graph(data, div, chartName, college, sex, color) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create(div, am4charts.XYChart);
    console.log(data);
    // Add data
    chart.data = data;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "year";

    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = min;
    // valueAxis.max = max;
    valueAxis.strictMinMax = false;
    valueAxis.extraMin = 0.15;
    valueAxis.extraMax = 0.15;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "rate";
    series.dataFields.categoryX = "year";
    series.strokeWidth = 2;
    series.yAxis = valueAxis;
    series.tooltip.pointerOrientation = "vertical";
    series.tensionX = 1; // 직선으로 만들어줌
    series.tensionY = 1; // 직선으로 만들어
    series.stroke = color;
    series.fill = color;

    // Add simple bullet
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    if (sex == "all") sex = "";
    if (sex == "male") sex = "남학생";
    if (sex == "female") sex = "여학생";
    if (college == "society") college = "인문사회계열의";
    else if (college == "artphysical") college = "예체능계열의";
    else if (college == "science") college = "자연과학계열의";
    else if (college == "mech") college = "공학계열의";
    else college = "전체";

    bullet.circle.strokeWidth = 15;
    bullet.fill = am4core.color(color);
    bullet.tooltipText = college + " " + sex + " " + chartName + ": {valueY}%";
  }); // end am4core.ready()
}

function stackGraph(data, show) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    console.log(data);
    var chart = am4core.create("chartdiv3", am4charts.XYChart);

    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = data;

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    // valueAxis.max = 100;
    //valueAxis.renderer.inside = true;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    // valueAxis.renderer.minWidth = 50;

    var series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%\n학생수 : {valueY}";
    series1.name = "1-4년 이내 졸업";
    series1.dataFields.categoryX = "year";
    series1.dataFields.valueY = "gradIn1-4y";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = true;
    bullet1.label.text = "{valueY.totalPercent.formatNumber('#.')}%";
    bullet1.locationY = 0.5;
    bullet1.label.adapter.add("textOutput", function(text, target) {
      // Hide labels with 0 value
      if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
        return "";
      }
      return text;
    });

    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%\n학생수 : {valueY}";
    series2.name = "4.5년 이내 졸업";
    series2.dataFields.categoryX = "year";
    series2.dataFields.valueY = "gradIn5y";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{valueY.totalPercent.formatNumber('#.')}%";
    bullet2.locationY = 0.5;
    bullet2.label.adapter.add("textOutput", function(text, target) {
      // Hide labels with 0 value
      if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
        return "";
      }
      return text;
    });

    var series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.columns.template.width = am4core.percent(80);
    series3.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%\n학생수 : {valueY}";
    series3.name = "5년 이내 졸업";
    series3.dataFields.categoryX = "year";
    series3.dataFields.valueY = "gradIn5y";
    series3.dataFields.valueYShow = "totalPercent";
    series3.dataItems.template.locations.categoryX = 0.5;
    series3.stacked = true;
    series3.tooltip.pointerOrientation = "vertical";

    var bullet3 = series3.bullets.push(new am4charts.LabelBullet());
    bullet3.interactionsEnabled = false;
    bullet3.label.text = "{valueY.totalPercent.formatNumber('#.')}%";
    bullet3.locationY = 0.5;
    bullet3.label.adapter.add("textOutput", function(text, target) {
      // Hide labels with 0 value
      if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
        return "";
      }
      return text;
    });

    var series4 = chart.series.push(new am4charts.ColumnSeries());
    series4.columns.template.width = am4core.percent(80);
    series4.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%\n학생수 : {valueY}";
    series4.name = "5.5-6년 이내 졸업";
    series4.dataFields.categoryX = "year";
    series4.dataFields.valueY = "gradIn5.5-6y";
    series4.dataFields.valueYShow = "totalPercent";
    series4.dataItems.template.locations.categoryX = 0.5;
    series4.stacked = true;
    series4.tooltip.pointerOrientation = "vertical";

    var bullet4 = series4.bullets.push(new am4charts.LabelBullet());
    bullet4.interactionsEnabled = false;
    bullet4.label.text = "{valueY.totalPercent.formatNumber('#.')}%";
    bullet4.locationY = 0.5;
    bullet4.label.adapter.add("textOutput", function(text, target) {
      // Hide labels with 0 value
      if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
        return "";
      }
      return text;
    });

    var series5 = chart.series.push(new am4charts.ColumnSeries());
    series5.columns.template.width = am4core.percent(80);
    series5.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%\n학생수 : {valueY}";
    series5.name = "6년 이후 졸업";
    series5.dataFields.categoryX = "year";
    series5.dataFields.valueY = "gradOver6y";
    series5.dataFields.valueYShow = "totalPercent";
    series5.dataItems.template.locations.categoryX = 0.5;
    series5.stacked = true;
    series5.tooltip.pointerOrientation = "vertical";

    var bullet5 = series5.bullets.push(new am4charts.LabelBullet());
    bullet5.interactionsEnabled = false;
    bullet5.label.text = "{valueY.totalPercent.formatNumber('#.')}%";
    bullet5.locationY = 0.5;
    bullet5.label.adapter.add("textOutput", function(text, target) {
      if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
        return "";
      }
      return text;
    });

    var series6 = chart.series.push(new am4charts.ColumnSeries());
    series6.columns.template.width = am4core.percent(80);
    series6.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%\n학생수 : {valueY}";
    series6.name = "재학중";
    series6.dataFields.categoryX = "year";
    series6.dataFields.valueY = "notYetGrad";
    series6.dataFields.valueYShow = "totalPercent";
    series6.dataItems.template.locations.categoryX = 0.5;
    series6.stacked = true;
    series6.tooltip.pointerOrientation = "vertical";

    var bullet6 = series6.bullets.push(new am4charts.LabelBullet());
    bullet6.interactionsEnabled = false;
    bullet6.label.text = "{valueY.totalPercent.formatNumber('#.')}%";
    bullet6.locationY = 0.5;
    bullet6.label.adapter.add("textOutput", function(text, target) {
      // Hide labels with 0 value
      if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
        return "";
      }
      return text;
    });
  }); // end am4core.ready()
}

function call() {
  var college = $("#college").val();
  var sex = $("#sex").val();

  parse(json => {
    data = [];
    for (var i = 0; i < json.length; i++) {
      year_data = {};
      year_data["year"] = json[i]["year"];
      year_data["rate"] = json[i][college][sex].toFixed(2);
      data.push(year_data);
    }

    line_graph(data, "chartdiv1", "진학률", college, sex, "#00a686");
    //console.log(data);
  }, "college_rate.json");

  parse(json => {
    data = [];
    for (var i = 0; i < json.length; i++) {
      year_data = {};
      year_data["year"] = json[i]["year"];
      year_data["rate"] = json[i][college][sex].toFixed(2);
      data.push(year_data);
    }

    line_graph(data, "chartdiv2", "취업률", college, sex, "#e8cd05");
    //console.log(data);
  }, "job_rate.json");

  parse(json => {
    data = [];
    for (var i = 0; i < json.length; i++) {
      year_data = json[i][college][sex];
      year_data["year"] = json[i]["year"];

      data.push(year_data);
    }
    stackGraph(data, 250);
  }, "grad_num_dummy.json");
}
