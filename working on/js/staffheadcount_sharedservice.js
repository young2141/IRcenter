function drawChart(){
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        chart = am4core.create("chartdiv", am4charts.XYChart);
        // chart.fillOpacity = 1;
        // chart.strokeWidth = 0.5;
        // chart.stroke = am4core.color("#000000");

        chart.data = [{
            "year": "2010",
            "admin/tech": 242,
            "exp/mng/acc": -242,
            "difference": 0
        }, {
            "year": "2011",
            "admin/tech": 242,
            "exp/mng/acc": -245,
            "difference": -3
        }, {
            "year": "2012",
            "admin/tech": 248,
            "exp/mng/acc": -231,
            "difference": 17
        }, {
            "year": "2013",
            "admin/tech": 252,
            "exp/mng/acc": -227,
            "difference": 25
        }, {
            "year": "2014",
            "admin/tech": 293,
            "exp/mng/acc": -197,
            "difference": 96
        }, {
            "year": "2015",
            "admin/tech": 316,
            "exp/mng/acc": -164,
            "difference": 152
        }, {
            "year": "2016",
            "admin/tech": 316,
            "exp/mng/acc": -159,
            "difference": 157
        }, {
            "year": "2017",
            "admin/tech": 324,
            "exp/mng/acc": -146,
            "difference": 178
        }, {
            "year": "2018",
            "admin/tech": 326,
            "exp/mng/acc": -136,
            "difference": 190
        }, {
            "year": "2019",
            "admin/tech": 337,
            "exp/mng/acc": -126,
            "difference": 211
        }];

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "year";
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 5;

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.minGridDistance = 100;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.categoryX = "year";
        series1.dataFields.valueY = "admin/tech";
        series1.stacked = true;
        series1.name = "admin/tech Service";
        series1.columns.template.fill = am4core.color("#FCD12A");
        series1.color.template.tooltipText = "hi";

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryX = "year";
        series2.dataFields.valueY = "exp/mng/acc";
        series2.name = "All Other Units";
        series2.stacked = true;
        series2.columns.template.fill = am4core.color("#000080");
        series2.columns.template.fillOpacity = 0.7;

        var series3 = chart.series.push(new am4charts.LineSeries());
        series3.dataFields.categoryX = "year";
        series3.dataFields.valueY = "difference";
        series3.strokeWidth = 4;
        series3.name = "Net Difference";
        series3.stroke = am4core.color("#58641D");
    });
}