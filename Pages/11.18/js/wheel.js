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
