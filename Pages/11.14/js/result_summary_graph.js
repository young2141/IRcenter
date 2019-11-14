var conditions = "all";

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

function control(v)
{
    conditions = v;
    var clr;
    if (v == "All")
        clr = "#ff00ff";
    else if (v == "Male")
        clr = "#00ffff";
    else
        clr = "#ffff00";
    chart1("bachelor", clr)
    chart1("master", clr);
    chart1("PhD", clr);
}

function chart1(type, clr) {
    result = [];
    var filename = "ppl_num_by_graduate.json";
    var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
    var valueY = type;
    var valueY_RGB = clr;
    $.getJSON("../../json/result_summary_num_by_graduate_" + conditions + ".json", (result) => {
        if (type == "bachelor") {
            var title = "학사과정";
            var divName = "chartdiv1";
        }
        else if (type == "master") {
            var title = "석사과정";
            var divName = "chartdiv2";
        }
        else {
            var title = "박사과정";
            var divName = "chartdiv3";
        }
        var categoryX = "year";
        var valueY_ko = "명";
        var numberFormat = "";

        P6drawBoxGraph_height(result, divName, categoryX, valueY, valueY_ko, valueY_RGB, title, numberFormat);
    })
};

function chart2(filename) {
    var result = [];
    var _fileName = filename;
    var valueY = ["major"];
    var cnt = valueY.length;

    $.getJSON("../../json/result_summary_" + _fileName, (jsonData) => {
        result = jsonData;
        result = result.reverse();
        if (filename == "top_bachelor_graduates.json") {
            var title = "학사과정";
            var divName = "chartdiv4";
        }
        else {
            var title = "석박사과정";
            var divName = "chartdiv5";

        }
        var valueY_RGB = "#ff00ff"
        var categoryX = "value";
        var valueY_ko = "수";
        var numberFormat = "";
        P6drawBoxGraph_width(result, divName, cnt, categoryX, valueY, valueY_ko, valueY_RGB, title, numberFormat);
    });
};

function loading() {
    chart1("bachelor", "#ff00ff")
    chart1("master", "#ff00ff");
    chart1("PhD", "#ff00ff");
    chart2("top_bachelor_graduates.json");
    chart2("top_master_phd_graduates.json");
}