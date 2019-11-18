function P5candleGraph(_data, _divName, _cnt, _categoryX, _valueY, _valueY_RGB, _title, _numberFormat) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create(_divName, am4charts.XYChart);
        chart.data = _data;

        var popTitle = chart.titles.create();
        popTitle.text = _title;
        popTitle.fontSize = 17;
        popTitle.fill.color = "red";
        popTitle.dx = 23;
        popTitle.dy = -5;

        var scaleTitle = chart.titles.create();
        scaleTitle.text = ("(단위: 등급)");
        scaleTitle.fontSize = 15;
        scaleTitle.dx = 60;
        scaleTitle.dy = -15;
        if (_title != "정시일반") {
            scaleTitle.fillOpacity = 0;
        }
       

        //popTitle.horizontalCenter = "middle";
        // Create axes : 가로축
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.location = 0;
        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.title.fontWeight = 200; // 걍 글자 굵기
        valueAxis.renderer.inversed = true;
        valueAxis.min = 1;
        valueAxis.max = 5;
        if (_title != "학생부교과") {
            valueAxis.renderer.labels.template.fillOpacity = 0;
        }

        var series = chart.series.push(new am4charts.CandlestickSeries());
        series.dataFields.categoryX = _categoryX;
        series.dataFields.valueY = "sf";
        series.dataFields.openValueY = "tf";
        series.dataFields.lowValueY = "low";
        series.dataFields.highValueY = "high";
        series.simplifiedProcessing = true;
        series.tooltip.getFillFromObject = false;
        series.columns.template.tooltipText = "[#000 font-size: 15px]2019학년도\n " + _title + "전형 \n{country}지역 출신 \n신입생의 최고등급은 \n[#000 bold]{high}등급[\ #000] \n입니다."
        series.columns.template.tooltip = 0;
        series.riseFromOpenState = undefined;
        series.dropFromOpenState = undefined;
        series.stroke = am4core.color(_valueY_RGB);
        series.fill = am4core.color(_valueY_RGB);
    
        var medianaSeries = chart.series.push(new am4charts.StepLineSeries());
        medianaSeries.noRisers = true;
        medianaSeries.startLocation = 0.1;
        medianaSeries.endLocation = 0.9;
        medianaSeries.dataFields.valueY = "avg";
        medianaSeries.dataFields.categoryX = _categoryX;
        medianaSeries.strokeWidth = 2;
        medianaSeries.stroke = am4core.color("#fff");

        var topSeries = chart.series.push(new am4charts.StepLineSeries());
        topSeries.noRisers = true;
        topSeries.startLocation = 0.2;
        topSeries.endLocation = 0.8;
        topSeries.dataFields.valueY = "high";
        topSeries.dataFields.categoryX = _categoryX;
        topSeries.strokeWidth = 2;
        topSeries.stroke = am4core.color(_valueY_RGB);

        var bottomSeries = chart.series.push(new am4charts.StepLineSeries());
        bottomSeries.noRisers = true;
        bottomSeries.startLocation = 0.2;
        bottomSeries.endLocation = 0.8;
        bottomSeries.dataFields.valueY = "low";
        bottomSeries.dataFields.categoryX = _categoryX;
        bottomSeries.strokeWidth = 2;
        bottomSeries.stroke = am4core.color(_valueY_RGB);
    })
}