var conditions = "All";
var conditions_kr = "전체";
var today = new Date();
var currentYear = today.getFullYear();

function initMoving(target, position, topLimit, btmLimit) {
    if (!target) return false;

    var obj = target;
    var initTop = position;
    var bottomLimit =
        Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        ) -
        btmLimit -
        obj.offsetHeight;

    var top = initTop;

    obj.style.position = "absolute";

    var getTop = function () {
        var myTop = 0;
        if (typeof window.pageYOffset == "number") {
            //WebKit
            myTop = window.pageYOffset;
        } else if (typeof document.documentElement.scrollTop == "number") {
            myTop = Math.max(
                document.documentElement.scrollTop,
                document.body.scrollTop
            );
        }
        return myTop + 500;
    };

    var getSize = function () {
        var myWidth = 0,
            myHeight = 0;
        if (typeof window.innerWidth == "number") {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if (
            document.documentElement &&
            (document.documentElement.clientWidth ||
                document.documentElement.clientHeight)
        ) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if (
            document.body &&
            (document.body.clientWidth || document.body.clientHeight)
        ) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }

        return [myWidth, myHeight];
    };

    function move() {
        var sizeWH = getSize();
        var sizeW = sizeWH[0];
        var sizeH = sizeWH[1];

        if (initTop > 0) {
            pos = getTop() + initTop;
        } else {
            pos = getTop() + sizeH + initTop;
        }

        if (pos > bottomLimit) pos = bottomLimit;
        if (pos < topLimit) pos = topLimit;

        pos = 1000;
        interval = top - pos;
        top = top - interval / 3;
        obj.style.top = top + "px";
        obj.style.left = sizeW - 1000 + "px";

        window.setTimeout(function () {
            move();
        }, 25);
    }

    function addEvent(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function () {
                obj["e" + type + fn](window.event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
        }
    }

    addEvent(window, "load", function () {
        move();
    });
}

function chart1() {
    $.getJSON("../../json/result_summary_num_by_graduate.json", jsonData => {
        P6drawBoxGraph_height(jsonData);
    });
}

function chart2() {
    $.getJSON("../../json/result_summary_top_graudate.json", jsonData => {
        P6drawBoxGraph_width(jsonData);
    });
}

function P6drawBoxGraph_height(_data) {
    var _ckr = $("input:radio[name='mf']:checked").val();
    var value, clr, value_kr;

    if (_ckr == "전체") { value = "All"; clr = "#ff00ff"; }
    else if (_ckr == "남자") { value = "Male"; clr = "#0000ff"; }
    else if (_ckr == "여자") { value = "Female"; clr = "#ffff00"; }

    am4core.useTheme(am4themes_animated);

    var container = am4core.create("chartdiv1", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    function createChild(_data, value) {
        if (value == "bachelor") value_kr = "학사과정";
        else if (value == "master") value_kr = "석사과정";
        else if (value == "PhD") value_kr = "박사과정";

        var bhchart = container.createChild(am4charts.XYChart);
        bhchart.height = am4core.percent(33);
        bhchart.data = _data;

        var title = bhchart.titles.create();
        title.text = value_kr;
        title.fontSize = 20;
        title.fontWeight = "bold";
        title.dy = -10;
        title.textAlign = "middle";

        var bhcategoryAxis = bhchart.xAxes.push(new am4charts.CategoryAxis());
        bhcategoryAxis.dataFields.category = "year";
        bhcategoryAxis.renderer.grid.template.location = 0;
        bhcategoryAxis.renderer.minGridDistance = 30;

        var bhvalueAxis = bhchart.yAxes.push(new am4charts.ValueAxis());
        bhvalueAxis.min = 0;
        bhvalueAxis.max = 7000;

        var bhseries = bhchart.series.push(new am4charts.ColumnSeries());
        bhseries.dataFields.valueY = value;
        bhseries.dataFields.categoryX = "year";
        bhseries.columns.template.strokeWidth = 0;
        bhseries.columns.template.stroke = am4core.color(clr);
        bhseries.columns.template.fill = am4core.color(clr);

        bhseries.columns.template.strokeWidth = 0;
        bhseries.columns.template.stroke = clr; //색상
        bhseries.columns.template.fill = clr // 색상
        bhseries.tooltip.getFillFromObject = false;
        if (_ckr != "전체")
            bhseries.columns.template.tooltipText = "[#000 font-size: 15px]{year}학년도 " + _ckr + " " + value_kr + " 학위수여자는 [#000 bold]{valueY}명[#000] 입니다.";
        else
            bhseries.columns.template.tooltipText = "[#000 font-size: 15px]{year}학년도 " + value_kr + " 학위수여자는 [#000 bold]{valueY}명[#000] 입니다.";

        var bhserieslabel = bhseries.bullets.push(new am4charts.LabelBullet());
        bhserieslabel.label.text = "{valueY}";
        bhserieslabel.label.dy = -10;
    }

    createChild(_data[value], "bachelor")
    createChild(_data[value], "master")
    createChild(_data[value], "PhD")
}

function P6drawBoxGraph_width(_data) {
    var _ckr = $("input:radio[name='mf']:checked").val();
    var value, clr;

    if (_ckr == "전체") { value = "All"; clr = "#ff00ff"; }
    else if (_ckr == "남자") { value = "Male"; clr = "#0000ff"; }
    else if (_ckr == "여자") { value = "Female"; clr = "#ffff00"; }

    am4core.useTheme(am4themes_animated);

    var container = am4core.create("chartdiv2", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    function drawChild(_data, _title) {
        console.log(value);
        var bwchart = container.createChild(am4charts.XYChart);
        bwchart.width = am4core.percent(50);
        bwchart.data = _data;

        var scaleTitle = bwchart.titles.create();
        scaleTitle.text = _title;
        scaleTitle.fontSize = 20;
        scaleTitle.fontWeight = "bold";
        scaleTitle.dy = -5;
        scaleTitle.dx = 70;

        // Create axes :
        var categoryAxis = bwchart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "major";
        categoryAxis.renderer.grid.template.opacity = 0;
        categoryAxis.renderer.inversed = true;

        var valueAxis = bwchart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
        valueAxis.min = 0;
        valueAxis.strictMinMax = true;

        if (_title == "학사과정")
            valueAxis.max = 600;
        else
            valueAxis.max = 100;

        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.minGridDistance = 40;

        var bwseries = bwchart.series.push(new am4charts.ColumnSeries());
        bwseries.dataFields.valueX = value;
        bwseries.dataFields.categoryY = "major";
        bwseries.stroke = clr;
        bwseries.fill = clr;

        bwseries.columns.template.strokeWidth = 0;
        bwseries.tooltip.getFillFromObject = false;
        if (_ckr != "전체")
            bwseries.columns.template.tooltipText = "[#000 font-size: 15px]2018학년도 {categoryY} " + _ckr + " " + _title + " 학위수여자는 [#000 bold]{valueX}명[#000] 입니다.";
        else
            bwseries.columns.template.tooltipText = "[#000 font-size: 15px]2018학년도 {categoryY} " + _title + " 학위수여자는 [#000 bold]{valueX}명[#000] 입니다.";
    }

    drawChild(_data["bachelor"], "학사과정")
    drawChild(_data["phdmaster"], "석박사과정")
}