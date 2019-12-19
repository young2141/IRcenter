function drawChart(){
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        chart = am4core.create("chartdiv", am4charts.XYChart);
        // chart.fillOpacity = 1;
        // chart.strokeWidth = 0.5;
        // chart.stroke = am4core.color("#000000");

        chart.data = [{
            "year": "2010",
            "shared": 0,
            "allother": 0,
            "difference": 0
        }, {
            "year": "2011",
            "shared": 10,
            "allother": -167,
            "difference": 177
        }, {
            "year": "2012",
            "shared": 374,
            "allother": -82,
            "difference": 292
        }, {
            "year": "2013",
            "shared": 591,
            "allother": -127,
            "difference": 464
        }, {
            "year": "2014",
            "shared": 353,
            "allother": -202,
            "difference": 151
        }, {
            "year": "2015",
            "shared": 311,
            "allother": -279,
            "difference": 32
        }, {
            "year": "2016",
            "shared": 382,
            "allother": -433,
            "difference": -51
        }, {
            "year": "2017",
            "shared": 252,
            "allother": -300,
            "difference": -48
        }, {
            "year": "2018",
            "shared": 189,
            "allother": -200,
            "difference": -11
        }, {
            "year": "2019",
            "shared": 240,
            "allother": -256,
            "difference": -16
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
        series1.dataFields.valueY = "shared";
        series1.stacked = true;
        series1.name = "Shared Service";
        series1.columns.template.fill = am4core.color("#FCD12A");

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryX = "year";
        series2.dataFields.valueY = "allother";
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