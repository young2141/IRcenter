function P6drawBoxGraph_width(_data, _divName, _cnt, _categoryX, _valueY, _valueY_ko, _valueY_RGB, _title, _numberFormat) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        var bwchart = am4core.create(_divName, am4charts.XYChart);
        bwchart.data = _data;

        // if(_divName=="chartdiv5"){
        //     var title = bwchart.titles.create();
        //     title.text = "(단위 : 명)";
        //     title.fontSize = 15;            
        //     title.dx = 180;
        //     title.dy = -35;
        // }
        
        var scaleTitle = bwchart.titles.create();
        scaleTitle.text = _title;
        scaleTitle.fontSize = 20;
        scaleTitle.dy = -5;
        scaleTitle.dx = 70;

        // Create axes :
        var categoryAxis = bwchart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = _valueY;
        categoryAxis.renderer.grid.template.opacity = 0;

        // ������
        var valueAxis = bwchart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.ticks.template.strokeOpacity = 0.5;

        //wvalueAxis.title.text = _title;

        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.minGridDistance = 40;
        P6bwcreateSeries(bwchart, _valueY, _categoryX, _valueY_ko, 0, _valueY_RGB)
    }) // end iter callback function
}

function P6bwcreateSeries(bwchart, _categoryX, _valueY, _valueY_ko, _percent, _valueY_RGB) {
    var bwseries = bwchart.series.push(new am4charts.ColumnSeries());
    bwseries.dataFields.valueX = _valueY; // �� ������ ��
    bwseries.dataFields.categoryY = _categoryX;
    bwseries.stroke = "#a16973";
    bwseries.fill = "#a16973";

}