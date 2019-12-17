function P6drawBoxGraph_height(_data, _divName, _valueY, _valueY_RGB, _title, _cy, _ckr)
{
    am4core.ready(function () {
        //console.log(_data);
        am4core.useTheme(am4themes_animated);
        var bhchart = am4core.create(_divName, am4charts.XYChart);
        bhchart.data = _data;

        var bhcategoryAxis = bhchart.xAxes.push(new am4charts.CategoryAxis());
        bhcategoryAxis.dataFields.category = "year";
        bhcategoryAxis.renderer.grid.template.location = 0;
        bhcategoryAxis.renderer.minGridDistance = 30;

        var bwvalueAxis = bhchart.yAxes.push(new am4charts.ValueAxis());
        bwvalueAxis.min = 0;
        bwvalueAxis.max = 7000;
        bwvalueAxis.title.text = _title;
        bwvalueAxis.title.fontSize = 18;
        bwvalueAxis.title.rotation = 0;
        bwvalueAxis.title.fontWeight = 400;

        // var scaleTitle = bhchart.titles.create();
        // scaleTitle.text = _title;
        // scaleTitle.fontSize = 20;
        // scaleTitle.dx = -385;
        // scaleTitle.dy = -100;
        //bwvalueAxis.strictMinMax = true;

        P6bhcreateSeries(bhchart, _valueY, _valueY_RGB, _cy, _title, _ckr);
    }); // end iter callback function
}

function P6bhcreateSeries(bhchart, _valueY, _valueY_RGB, _cy, _title, _ckr)
{
    var bhseries = bhchart.series.push(new am4charts.ColumnSeries());
    bhseries.dataFields.valueY = _valueY;
    bhseries.dataFields.categoryX = "year";
    bhseries.columns.template.strokeWidth = 0;
    bhseries.columns.template.stroke = am4core.color(_valueY_RGB);
    bhseries.columns.template.fill = am4core.color(_valueY_RGB);

    bhseries.columns.template.strokeWidth = 0;
    bhseries.columns.template.stroke = am4core.color(_valueY_RGB); //색상
    bhseries.columns.template.fill = am4core.color(_valueY_RGB); // 색상
    bhseries.tooltip.getFillFromObject = false;
    if(_ckr != "전체")
        bhseries.columns.template.tooltipText = "[#000 font-size: 15px]" + _cy + "학년도 " + _ckr + " " + _title + " 학위수여자는 [#000 bold]{valueY}명[#000] 입니다.";
    else
        bhseries.columns.template.tooltipText = "[#000 font-size: 15px]" + _cy + "년도 " + _title + " 학위수여자는 [#000 bold]{valueY}명[#000] 입니다.";

    var bhserieslabel = bhseries.bullets.push(new am4charts.LabelBullet());
    bhserieslabel.label.text = "{valueY}";
    bhserieslabel.label.dy = -10;
}
