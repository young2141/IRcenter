
function P6drawBoxGraph_height(_data, _divName, _categoryX, _valueY, _valueY_ko, _valueY_RGB, _title, _numberFormat) {
    am4core.ready(function () {
        //console.log(_data);
        am4core.useTheme(am4themes_animated);
        var bhchart = am4core.create(_divName, am4charts.XYChart);
        bhchart.data = _data;

        var scaleTitle = bhchart.titles.create();
        scaleTitle.text = _title;
        scaleTitle.fontSize = 20;
        scaleTitle.dy = -10;

        // Create axes : 가로축
        var bhcategoryAxis = bhchart.xAxes.push(new am4charts.CategoryAxis());
        bhcategoryAxis.dataFields.category = "year";
        bhcategoryAxis.renderer.grid.template.location = 0;
        bhcategoryAxis.renderer.minGridDistance = 30;

        // 세로축
        var bwvalueAxis = bhchart.yAxes.push(new am4charts.ValueAxis());
        bwvalueAxis.min = 0;
        bwvalueAxis.max = 7000;
        //bwvalueAxis.strictMinMax = true;

        P6bhcreateSeries(bhchart, _categoryX, _valueY, _valueY_ko, 0, _valueY_RGB)
    }) // end iter callback function
}

function P6bhcreateSeries(bhchart, _categoryX, _valueY, _valueY_ko, _percent, _valueY_RGB) {
    var bhseries = bhchart.series.push(new am4charts.ColumnSeries());
    bhseries.dataFields.valueY = _valueY;
    bhseries.dataFields.categoryX = "year";
    bhseries.columns.template.strokeWidth = 0
    bhseries.columns.template.stroke = am4core.color(_valueY_RGB); //색상
    bhseries.columns.template.fill = am4core.color(_valueY_RGB); // 색상

    var bhserieslabel = bhseries.bullets.push(new am4charts.LabelBullet());
    bhserieslabel.label.text = "{valueY}";
    bhserieslabel.label.dy = -10;
}