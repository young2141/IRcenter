function parse(callback) {
  $.getJSON("../json/professor_by_lecture_time.json", json => {
    callback(json);
  });
}

function bubble_map(data) {
  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.maskBullets = false;

    var title = chart.titles.create();
    title.text = "(단위 : 시간)";
    title.fontSize = 15;
    title.marginBottom = 30;
    title.dx = 850;
    title.dy = -5;

    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    yAxis.dataFields.category = "prof";
    xAxis.renderer.minGridDistance = 1;
    xAxis.dataFields.category = "time";

    xAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.axisFills.template.disabled = true;
    yAxis.renderer.axisFills.template.disabled = true;
    yAxis.renderer.ticks.template.disabled = true;
    xAxis.renderer.ticks.template.disabled = true;

    yAxis.renderer.inversed = true;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "prof";
    series.dataFields.categoryX = "time";
    series.dataFields.value = "value";
    series.columns.template.disabled = true;
    series.sequencedInterpolation = true;
    //series.defaultState.transitionDuration = 3000;

    var bullet = series.bullets.push(new am4core.Circle());
    bullet.tooltipText =
      "{prof}, {time}시간: {value.workingValue.formatNumber('#.')}명";
    bullet.strokeWidth = 3;
    //bullet.stroke = am4core.color("#ffffff");
    bullet.strokeOpacity = 0;

    bullet.adapter.add("tooltipY", function(tooltipY, target) {
      return -target.radius + 1;
    });

    series.heatRules.push({
      property: "radius",
      target: bullet,
      min: 2,
      max: 40
    });

    bullet.hiddenState.properties.scale = 0.01;
    bullet.hiddenState.properties.opacity = 1;
    bullet.adapter.add("fill", function(fill, target) {
      if (!target.dataItem) return fill;

      var values = target.dataItem.value;
      console.log(values);
      return values > 0 ? am4core.color("skyblue") : am4core.color("white");
    });
    var hoverState = bullet.states.create("hover");
    hoverState.properties.strokeOpacity = 1;

    chart.data = data;

    // this changes data each 3 seconds
    // setInterval(function(){
    //     series.dataItems.each(function(dataItem){
    //         dataItem.value += dataItem.value * Math.random() * 0.3;
    //     })
    // }, 3000)
  }); // end am4core.ready()
}

function call() {
  var semester = $(":input:radio[name=semester]:checked").val();
  if (semester != "first" && semester != "second") semester = "first";
  parse(json => {
    data = [];
    for (var i = 0; i < json.length; i++) {
      cluster = json[i];
      cluster["value"] = json[i]["value"][semester];
      data.push(cluster);
    }
    bubble_map(data);
  });
}

call();
