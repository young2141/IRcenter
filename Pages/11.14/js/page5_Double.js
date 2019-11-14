
function P5DoubleGraph(_data, _divName, _cnt, _categoryX, _valueY, _valueY_ko, _valueY_RGB, _title, _numberFormat, _year) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(_divName, am4charts.XYChart);

        chart.data = _data;

        var scaleTitle = chart.titles.create();
        scaleTitle.text = ("(단위: 명)");
        scaleTitle.fontSize = 15;
        scaleTitle.dx = 440;
        scaleTitle.dy = -10;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = _categoryX;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.location = 0;
        
        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.title.text = _title;
        valueAxis.title.fontWeight = 200; // 걍 글자 굵기
        //valueAxis.min = 0;
        valueAxis.max = 30000;

        function createSeries(_valueY, _valueY_RGB, _sz) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = _valueY; // 총 지원자 수
            series.dataFields.categoryX = "city";
            series.columns.template.width = am4core.percent(_sz);
            series.clustered = false;

            series.columns.template.strokeWidth = 0
            series.columns.template.stroke = am4core.color(_valueY_RGB); //색상
            series.columns.template.fill = am4core.color(_valueY_RGB); // 색상
            series.tooltip.getFillFromObject = false;
            if (_valueY == "apply") {
                series.columns.template.tooltipText = "[#000 font-size: 15px]" + _year + "학년도 {category}지역 출신 지원자는 [#000 bold]{valueY}명[\ #000] 입니다."
            }
            else {
                series.columns.template.tooltipText = "[#000 font-size: 15px]" + _year + "학년도 {category}지역 출신 입학생은 [#000 bold]{valueY}명[\ #000] 입니다."
            }
        }

        createSeries("apply", "#0054FF", 70);
        createSeries("admission", "#FF1212", 40);
    }) // end iter callback function
}