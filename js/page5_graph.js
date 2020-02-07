function initMoving(target, position, topLimit, btmLimit) {
    if (!target)
        return false;

    var obj = target;
    var initTop = position;
    var bottomLimit = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - btmLimit - obj.offsetHeight;

    var top = initTop;

    obj.style.position = 'absolute';

    var getTop = function () {
        var myTop = 0;
        if (typeof (window.pageYOffset) == 'number') {   //WebKit
            myTop = window.pageYOffset;
        } else if (typeof (document.documentElement.scrollTop) == 'number') {
            myTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }
        return myTop + 500;
    }

    var getSize = function () {
        var myWidth = 0, myHeight = 0;
        if (typeof (window.innerWidth) == 'number') {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }

        return [myWidth, myHeight];
    }

    function move() {
        var sizeWH = getSize();
        var sizeW = sizeWH[0];
        var sizeH = sizeWH[1];

        if (initTop > 0) {
            pos = getTop() + initTop;
        } else {
            pos = getTop() + sizeH + initTop;
        }

        if (pos > bottomLimit)
            pos = bottomLimit;
        if (pos < topLimit)
            pos = topLimit;

        pos = 1000;
        interval = top - pos;
        top = top - interval / 3;
        obj.style.top = top + 'px';
        obj.style.left = sizeW - 1000 + 'px';

        window.setTimeout(function () {
            move();
        }, 25);
    }

    function addEvent(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](window.event);
            }
            obj.attachEvent('on' + type, obj[type + fn]);
        }
    }

    addEvent(window, 'load', function () {
        move();
    });
}

function chart1() {
    var year = document.getElementById("years").value;
    $.getJSON("../../json/p5_double_data.json", (jsonData) => {
        P5DoubleGraph(jsonData[year], year);
    });
};

function chart2() {  
    $.getJSON("../../json/p5_candle_data.json", (jsonData) => {       
        P5candleGraph(jsonData);
    });
};

function P5DoubleGraph(_data, _year) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        chart.data = _data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "city";
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

            series.columns.template.strokeWidth = 0;
            series.columns.template.stroke = am4core.color(_valueY_RGB); //색상
            series.columns.template.fill = am4core.color(_valueY_RGB); // 색상
            series.tooltip.getFillFromObject = false;
            if (_valueY == "apply") {
                series.columns.template.tooltipText =
                    "[#000 font-size: 15px]" +
                    _year +
                    "학년도 {city}지역 출신 지원자는 [#000 bold]{valueY}명[ #000] 입니다.";
            } else {
                series.columns.template.tooltipText =
                    "[#000 font-size: 15px]" +
                    _year +
                    "학년도 {city}지역 출신 입학자는 [#000 bold]{valueY}명[ #000] 입니다.";
            }
        }

        createSeries("apply", "#0054FF", 80);
        createSeries("admission", "#FF1212", 60);
    });
}

function P5candleGraph(_data) {
    var typename = ["student", "nonsul", "normal", "farmfish", "jeongsi"];
    var typename_kr = ["학생부교과", "논술", "학생부종합 일반", "학생부종합 농어촌", "정시"];
    var color = ["#A9CBE4", "#FAC18E", "#96CAAC", "#FC9E96", "#E1B3FA"];

    var container = am4core.create("chartdiv2", am4core.Container);

    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    function drawChild(_data, _title, _valueY_RGB) {
        var chart = container.createChild(am4charts.XYChart);
        chart.width = am4core.percent(20);
        chart.data = _data;

        var popTitle = chart.titles.create();
        popTitle.text = _title;
        popTitle.fontSize = 17;
        popTitle.dx = 23;
        popTitle.dy = -5;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.location = 0;
        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inversed = true;
        valueAxis.min = 1;
        valueAxis.max = 5;
        if (_title != "학생부교과") {
            valueAxis.renderer.labels.template.fillOpacity = 0;
        }

        var series = chart.series.push(new am4charts.CandlestickSeries());
        series.dataFields.categoryX = "country";
        series.dataFields.valueY = "sf";
        series.dataFields.openValueY = "tf";
        series.dataFields.lowValueY = "low";
        series.dataFields.highValueY = "high";
        series.simplifiedProcessing = true;
        series.tooltip.getFillFromObject = false;
        series.columns.template.tooltipText =
            "[#000 font-size: 15px]2019학년도\n " +
            _title +
            "전형 \n{country}지역 출신 \n신입생의 최고등급은 \n[#000 bold]{high}등급[ #000] \n입니다.";
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
        medianaSeries.dataFields.categoryX = "country";
        medianaSeries.strokeWidth = 2;
        medianaSeries.stroke = am4core.color("#fff");

        var topSeries = chart.series.push(new am4charts.StepLineSeries());
        topSeries.noRisers = true;
        topSeries.startLocation = 0.2;
        topSeries.endLocation = 0.8;
        topSeries.dataFields.valueY = "high";
        topSeries.dataFields.categoryX = "country";
        topSeries.strokeWidth = 2;
        topSeries.stroke = am4core.color(_valueY_RGB);

        var bottomSeries = chart.series.push(new am4charts.StepLineSeries());
        bottomSeries.noRisers = true;
        bottomSeries.startLocation = 0.2;
        bottomSeries.endLocation = 0.8;
        bottomSeries.dataFields.valueY = "low";
        bottomSeries.dataFields.categoryX = "country";
        bottomSeries.strokeWidth = 2;
        bottomSeries.stroke = am4core.color(_valueY_RGB);
    }

    for (var i = 0; i < 5; i++) {
        drawChild(_data[typename[i]], typename_kr[i], color[i]);
    }
}
