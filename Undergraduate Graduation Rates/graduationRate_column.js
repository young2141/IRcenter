function parse(callback) {
  $.getJSON("../../../Undergraduate Graduation Rates/dummy.json", json => {
    callback(json);
  });
}

function runGraph(show) {
  parse(json => {
    am4core.ready(function() {
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      var chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.data = json;

      chart.colors.step = 2;
      chart.padding(30, 30, 10, 30);
      chart.legend = new am4charts.Legend();

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.grid.template.location = 0;

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
      bullet1.label.fill = am4core.color("#ffffff");
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
      bullet2.label.fill = am4core.color("#ffffff");
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
      bullet3.label.fill = am4core.color("#ffffff");
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
      bullet4.label.fill = am4core.color("#ffffff");
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
      bullet5.label.fill = am4core.color("#ffffff");
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
      bullet6.label.fill = am4core.color("#ffffff");
      bullet6.label.adapter.add("textOutput", function(text, target) {
        // Hide labels with 0 value
        if (target.dataItem && parseInt(target.dataItem.valueY) < show) {
          return "";
        }
        return text;
      });
    }); // end am4core.ready()
  });
}
