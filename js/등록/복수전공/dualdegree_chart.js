function drawChart(data){
    am4core.ready(function() {
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        xAxis.dataFields.category = "x";
        xAxis.renderer.grid.template.disabled = true;

        yAxis.dataFields.category = "y";
        yAxis.renderer.grid.template.disabled =  true;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "x";
        series.dataFields.categoryY = "y";
        series.dataFields.value = "total";

        var column = series.columns.template;
        column.strokeWidth = 2;
        column.strokeOpacity = 1;
        column.width = am4core.percent(100);
        column.height = am4core.percent(100);
        column.column.cornerRadius(6, 6, 6, 6);

    });
}