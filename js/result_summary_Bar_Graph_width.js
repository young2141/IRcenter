function P6drawBoxGraph_width(_data, _divName, _categoryX, _valueY, _valueY_RGB, _title, _cy, _ckr) {
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
        valueAxis.min = 0;
        valueAxis.strictMinMax = true;
        if (_title == "학사")
            valueAxis.max = 600;
        else
            valueAxis.max = 100;
        //wvalueAxis.title.text = _title;

        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.minGridDistance = 40;
        P6bwcreateSeries(bwchart, _valueY, _categoryX, _valueY_RGB, _title, _cy, _ckr)
    }) // end iter callback function
}

function P6bwcreateSeries(bwchart, _categoryX, _valueY, _valueY_RGB, _title, _cy, _ckr) {
    var bwseries = bwchart.series.push(new am4charts.ColumnSeries());
    bwseries.dataFields.valueX = _valueY;
    bwseries.dataFields.categoryY = _categoryX;
    bwseries.stroke = "#a16973";
    bwseries.fill = "#a16973";

    bwseries.columns.template.strokeWidth = 0;
    bwseries.tooltip.getFillFromObject = false;
    if (_ckr != "전체")
        bwseries.columns.template.tooltipText = "[#000 font-size: 15px]" + _cy + "년도 {categoryY} " + _ckr + " " + _title + " 학위수여자는 [#000 bold]{valueX}명[#000] 입니다.";
    else
        bwseries.columns.template.tooltipText = "[#000 font-size: 15px]" + _cy + "년도 {categoryY} " + _title + " 학위수여자는 [#000 bold]{valueX}명[#000] 입니다.";
}
