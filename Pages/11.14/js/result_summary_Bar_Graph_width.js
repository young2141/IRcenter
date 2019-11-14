function P6drawBoxGraph_width(_data, _divName, _cnt, _categoryX, _valueY, _valueY_ko, _valueY_RGB, _title, _numberFormat) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        var bwchart = am4core.create(_divName, am4charts.XYChart);
        bwchart.data = _data;

        var scaleTitle = bwchart.titles.create();
        scaleTitle.text = _title;
        scaleTitle.fontSize = 20;
        scaleTitle.dy = -10;

        // Create axes :
        var categoryAxis = bwchart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = _valueY;
        categoryAxis.renderer.grid.template.opacity = 0;

        // 세로축
        var valueAxis = bwchart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
        valueAxis.title.text = _title;

        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.minGridDistance = 40;
        P6bwcreateSeries(bwchart, _valueY, _categoryX, _valueY_ko, 0, _valueY_RGB)
    }) // end iter callback function
}

function P6bwcreateSeries(bwchart, _categoryX, _valueY, _valueY_ko, _percent, _valueY_RGB) {
    var bwseries = bwchart.series.push(new am4charts.ColumnSeries());
    bwseries.dataFields.valueX = _valueY; // 총 지원자 수
    bwseries.dataFields.categoryY = _categoryX;
    bwseries.stroke = "#a16973";
    bwseries.fill = "#a16973";

    bwseries.rows.template.stroke = am4core.color(_valueY_RGB); //색상
    bwseries.rows.template.fill = am4core.color(_valueY_RGB);

}