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

  var getTop = function() {
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

  var getSize = function() {
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

    window.setTimeout(function() {
      move();
    }, 25);
  }

  function addEvent(obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
      obj["e" + type + fn] = fn;
      obj[type + fn] = function() {
        obj["e" + type + fn](window.event);
      };
      obj.attachEvent("on" + type, obj[type + fn]);
    }
  }

  addEvent(window, "load", function() {
    move();
  });
}

function chart1(year) {
  result = [];
  var filename = year + "_city_re.json";
  var valueY = ["year"];
  var cnt = valueY.length;

  $.getJSON("../../json/" + filename, jsonData => {
    result = jsonData;
    var divName = "divchart1";
    var title = "입학현황";
    var valueY_RGB = "";

    var categoryX = "city";
    var valueY_ko = "명";
    var numberFormat = "";
    P5DoubleGraph(
      result,
      divName,
      cnt,
      categoryX,
      valueY,
      valueY_ko,
      valueY_RGB,
      title,
      numberFormat,
      year
    );
  });
}

function chart2(divname, filename, title, valueY_RGB) {
  result = [];
  var valueY = ["year"];
  var cnt = valueY.length;
  $.getJSON("../../json/" + filename, jsonData => {
    result = jsonData;
    var divName = divname;

    var categoryX = "country";
    var numberFormat = "";
    P5candleGraph(
      result,
      divName,
      cnt,
      categoryX,
      valueY,
      valueY_RGB,
      title,
      numberFormat
    );
  });
}

function control(val) {
  chart1(val);
  div = document.getElementById("headline");
  console.log(div);
  div.innerHTML = "<h2>" + val + "년도 지역별 입학 현황" + "</h2>";
}

chart1("2019");
chart2("divchart2", "p5_school.json", "학생부교과", "#A9CBE4");
chart2("divchart3", "p5_nonsul.json", "논술", "#FAC18E");
chart2("divchart4", "p5_jonghap.json", "학생부종합 일반", "#96CAAC");
chart2("divchart5", "p5_nongachon.json", "학생부종합 농어촌", "#FC9E96");
chart2("divchart6", "p5_jeongsi.json", "정시일반", "#E1B3FA");
