function chart() {
  $.getJSON("../../../json/professor_by_age_current.json", data1 => {
    bubbleAge(data1);
  });

  $.getJSON("../../../json/professor_by_service_year.json", data2 => {
    bubbleYear(data2);
  });
}

function bubbleAge(data) {
  $("#legend11").empty();

  var numdata = [];
  var rank = [0];
  var sz = 0;
  for (i = 0; i < data.length; i++) {
    if (data[i]["value"] != 0) {
      numdata.push(data[i]["value"]);
      ++sz;
    }
  }
  numdata = numdata.sort(function (a, b) { return a - b; }); //정렬
  for (i = 0.2; i < 1; i += 0.2) {
    //숫자 매끄럽게 10단위로 끊음.
    if (numdata[Math.round((sz - 1) * i)] < 10)
      rank.push(numdata[Math.round((sz - 1) * i)]);
    else rank.push(parseInt(numdata[Math.round((sz - 1) * i)] / 10) * 10);
  }
  rank.push(numdata[sz - 1]);

  drawBubble(data, numdata, sz, "age", "chartdiv1");
  drawLegendAverage(data, "age", "legend11");
  drawLegendComparingCircle("legend12", numdata, sz);
}

function bubbleYear(data) {
  $("#legend2").empty();
  var numdata = [];
  var rank = [0];
  var sz = 0;
  for (i = 0; i < data.length; i++) {
    if (data[i]["value"] != 0) {
      numdata.push(data[i]["value"]);
      ++sz;
    }
  }
  numdata = numdata.sort(function (a, b) {
    return a - b;
  }); //정렬
  for (i = 0.2; i < 1; i += 0.2) {
    //숫자 매끄럽게 10단위로 끊음.
    if (numdata[Math.round((sz - 1) * i)] < 10)
      rank.push(numdata[Math.round((sz - 1) * i)]);
    else rank.push(parseInt(numdata[Math.round((sz - 1) * i)] / 10) * 10);
  }
  rank.push(numdata[sz - 1]);

  drawBubble(data, numdata, sz, "year", "chartdiv2");
  drawLegendAverage(data, "year", "legend21");
  drawLegendComparingCircle("legend22", numdata, sz);
}

function drawBubble(data, numdata, sz, xAxisString, chartdiv) {
  am4core.useTheme(am4themes_animated);

  var container = am4core.create(chartdiv, am4core.Container);
  container.layout = "grid";
  container.fixedWidthGrid = false;
  container.width = am4core.percent(100);
  container.height = am4core.percent(100);

  var chart = container.createChild(am4charts.XYChart);
  chart.width = am4core.percent(100);
  chart.maskBullets = false;
  chart.data = data;

  var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

  xAxis.dataFields.category = xAxisString;
  xAxis.renderer.minGridDistance = 1;
  xAxis.renderer.ticks.template.disabled = true;
  xAxis.renderer.axisFills.template.disabled = true;
  xAxis.renderer.grid.template.disabled = true;

  yAxis.dataFields.category = "prof";
  yAxis.renderer.inversed = true;
  yAxis.renderer.grid.template.disabled = true;
  yAxis.renderer.ticks.template.disabled = true;
  yAxis.renderer.axisFills.template.disabled = true;

  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryY = "prof";
  series.dataFields.categoryX = xAxisString;
  series.dataFields.value = "value";
  series.columns.template.disabled = true;
  series.sequencedInterpolation = true;

  var bullet = series.bullets.push(new am4core.Circle());
  bullet.strokeWidth = 3;
  bullet.stroke = "#ffffff";
  bullet.adapter.add("radius", function (radius, target) {
    var values = target.dataItem.value;
    if (values == 0) return 0;
    return 10 + (40 * values) / numdata[sz - 1];
  });

  if (xAxisString == "year") {
    bullet.tooltipText = "{prof}, {year}년: {value.workingValue.formatNumber('#.')}명";
    bullet.adapter.add("fill", function (fill, target) {
      var X = target.dataItem.categoryX;
      if (X == "0~5" || X == "6~10") return chart.colors.getIndex(0);
      else if (X == "11~15" || X == "16~20") return chart.colors.getIndex(1);
      else if (X == "21~25" || X == "26~30") return chart.colors.getIndex(2);
      else if (X == "31~35" || X == "36년 이상")
        return chart.colors.getIndex(3);
      else return chart.colors.getIndex(4);
    });
  } else {
    bullet.tooltipText = "{prof}, {age}세: {value.workingValue.formatNumber('#.')}명";
    bullet.adapter.add("fill", function (fill, target) {
      var X = target.dataItem.categoryX;
      if (X == "25세이하" || X == "26~30") return chart.colors.getIndex(0);
      else if (X == "31~35" || X == "36~40") return chart.colors.getIndex(1);
      else if (X == "41~45" || X == "46~50") return chart.colors.getIndex(2);
      else if (X == "51~55" || X == "56~60") return chart.colors.getIndex(3);
      else return chart.colors.getIndex(4);
    });
  }
}

function drawLegendAverage(data, standard, div) {
  //legend생성
  var doc = document.getElementById(div);
  doc.innerHTML = standard == "year" ? "<b>평균 근속연수</b><br><br>" : "<b>평균 연령</b><br><br>";
  doc.style.textAlign = "center";
  doc.style.alignItems = "bottom";

  var prof = {};
  data.forEach(e => {
    e[standard] = e[standard].replace(' ', '');
    prof[e["prof"]] = {}
    prof[e["prof"]]["value"] = 0;
    prof[e["prof"]]["num"] = 0;
  });

  //데이터의 형식이 바뀌면 바꿔줘야함
  data.forEach(e => {
    let average = 0;
    let ret = e[standard].split("~");
    average = ret.length == 2 ? (parseInt(ret[0]) + parseInt(ret[1])) / 2 : parseInt((ret[0].replace(/[^0-9]/g, '')));

    prof[e["prof"]]["num"] += e["value"];
    prof[e["prof"]]["value"] += e["value"] * average;
  });

  Object.keys(prof).map(key => {
    doc.innerHTML += String(Math.round(prof[key]["value"] / prof[key]["num"])).fontsize(25);
    doc.innerHTML += standard == "year" ? "년" : "세";
    doc.innerHTML += "<br><br><br>";
  });
}

function drawLegendComparingCircle(legendid, numdata, sz) {
  //legend 원 크기가 커지거나 변경될 시, dy 값을 수정하여 모양을 맞춰야함.
  let data = [
    {
      "value": 50,
      "categoryX": "x1",
      "categoryY": "50",
      "dy": -5
    },
    {
      "value": 100,
      "categoryX": "x1",
      "categoryY": "100",
      "dy": -5
    },
    {
      "value": 200,
      "categoryX": "x1",
      "categoryY": "200",
      "dy": -5
    },
    {
      "value": 300,
      "categoryX": "x1",
      "categoryY": "300",
      "dy": -5
    }
  ];

  var element = document.getElementById(legendid);
  element.style.textAlign = "center";
  element.style.height = "200px";
  var span = document.createElement("span");
  span.style.marginBottom = "10px";
  var b = document.createElement("b");
  b.innerHTML = "원 크기별 인원수<br><br>";
  span.appendChild(b);
  element.appendChild(span);

  //현재는 50, 100, 200, 300 기준만 존재 
  //만약 더 추가하거나 삭제하려면 위의 데이터를 수정해주고 i의 범위 값을 데이터 개수만큼 설정
  for (let i = 0; i < 4; ++i) {
    var tr = document.createElement("tr");
    tr.style.display = "block";
    tr.style.overflow = "hidden";
    tr.style.verticalAlign = "middle";
    var td = document.createElement("td");
    td.style.width = "160px";

    var chartdiv = document.createElement("div");
    chartdiv.style.height = "20px";
    element.appendChild(tr);
    tr.appendChild(td);
    td.appendChild(chartdiv);

    var td2 = document.createElement("td");
    var label = document.createTextNode(data[i]["value"].toString());
    td2.appendChild(label);
    td2.style.width = "30px";
    td2.style.fontSize = "20px";
    td2.style.fontWeight = "bold";
    tr.appendChild(td2);

    drawSlicedCircle(data.slice(i, i + 1), chartdiv, numdata, sz);
  }
}

function drawSlicedCircle(data, chartdiv, numdata, sz) {
  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(chartdiv, am4charts.XYChart);
    chart.maskBullets = false;
    chart.data = data;

    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = "categoryX";
    xAxis.renderer.minGridDistance = 10;
    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.axisFills.template.disabled = true;
    xAxis.renderer.ticks.template.disabled = true;
    xAxis.renderer.labels.template.disabled = true;

    yAxis.dataFields.category = "categoryY";
    yAxis.renderer.minGridDistance = 10;
    yAxis.renderer.axisFills.template.disabled = true;
    yAxis.renderer.ticks.template.disabled = true;
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.labels.template.disabled = true;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "categoryY";
    series.dataFields.categoryX = "categoryX";
    series.dataFields.value = "value";
    series.columns.template.disabled = true;
    series.sequencedInterpolation = true;

    var bullet = series.bullets.push(new am4core.Circle());
    bullet.strokeWidth = 3;
    bullet.propertyFields.dy = "dy";
    bullet.adapter.add("radius", function (radius, target) {
      return 10 + (40 * target.dataItem.value) / numdata[sz - 1];
    });
  });
}