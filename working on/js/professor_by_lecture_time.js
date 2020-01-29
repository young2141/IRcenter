function chart() {
  $.getJSON("../json/professor_by_lecture_time.json", data1 => {
    bubble_map1(data1);
  });
}

function bubble_map1(data) {
  am4core.ready(function() {
    $("#legend1").empty();
    var numdata = [];
    var cond = $(":input:radio[name=semester]:checked").val();
    var rank = [0];
    var sz = 0;
    for (i = 0; i < data.length; i++) {
      if (data[i][cond] != 0) {
        numdata.push(data[i][cond]);
        ++sz;
      }
    }
    numdata = numdata.sort(function(a, b) {
      return a - b;
    }); //정렬
    for (i = 0.2; i < 1; i += 0.2) {
      //숫자 매끄럽게 10단위로 끊음.
      if (numdata[Math.round((sz - 1) * i)] < 10)
        rank.push(numdata[Math.round((sz - 1) * i)]);
      else rank.push(parseInt(numdata[Math.round((sz - 1) * i)] / 10) * 10);
    }
    rank.push(numdata[sz - 1]);
    //legend생성
    var doc = document.getElementById("legend1");
    doc.innerHTML = "[근속연수별현황]<br>";
    prof = {};
    for (i = 0; i < data.length; i++) {
      if (data[i]["time"] == "1미만") continue;

      if (prof[data[i]["prof"]] == undefined) {
        prof[data[i]["prof"]] = {};
        prof[data[i]["prof"]]["ppl"] = data[i][cond];

        if (data[i]["time"].length <= 3) {
          prof[data[i]["prof"]]["total_age"] =
            data[i][cond] * (String(data[i]["time"]).slice(0, 1) * 1 + 1);
        } else {
          prof[data[i]["prof"]]["total_age"] =
            data[i][cond] * (String(data[i]["time"]).slice(0, 2) * 1 + 1);
        }
      } else {
        prof[data[i]["prof"]]["ppl"] += data[i][cond];
        if (data[i]["time"].length <= 3) {
          prof[data[i]["prof"]]["total_age"] +=
            data[i][cond] * (String(data[i]["time"]).slice(0, 1) * 1 + 1);
        } else {
          prof[data[i]["prof"]]["total_age"] +=
            data[i][cond] * (String(data[i]["time"]).slice(0, 2) * 1 + 1);
        }
      }
    }
    console.log(prof);
    for (var key in prof) {
      doc.innerHTML +=
        key +
        " 평균 강의시간: " +
        Math.round(prof[key]["total_age"] / prof[key]["ppl"]) +
        "<br>";
    }
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("chartdiv1", am4charts.XYChart);
    chart.maskBullets = false;
    chart.data = data;
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
    series.dataFields.value = cond;
    series.columns.template.disabled = true;
    series.sequencedInterpolation = true;
    //series.defaultState.transitionDuration = 3000;

    var bullet = series.bullets.push(new am4core.Circle());
    bullet.tooltipText =
      "{prof}, {time}: {value.workingValue.formatNumber('#.')}명";
    bullet.strokeWidth = 3;
    bullet.adapter.add("radius", function(radius, target) {
      var values = target.dataItem.value,
        r;
      if (values == 0) return 0;
      /*
            else if (rank[0] < values && values < rank[1])
                return rad[0] + (rad[1] - rad[0]) * ((values - rank[0]) / (rank[1] - rank[0]));
            else if (rank[1] <= values && values < rank[2])
                return rad[1] + (rad[2] - rad[1]) * ((values - rank[1]) / (rank[2] - rank[1]));
            else if (rank[2] <= values && values < rank[3])
                return rad[2] + (rad[3] - rad[2]) * ((values - rank[2]) / (rank[3] - rank[2]));
            else if (rank[3] <= values && values < rank[4])
                return rad[3] + (rad[4] - rad[3]) * ((values - rank[3]) / (rank[4] - rank[3]));
            else if (rank[4] <= values && values < rank[5])
                return rad[4] + (rad[5] - rad[4]) * ((values - rank[4]) / (rank[5] - rank[4]));
            else if (rank[5] <= values)
                return rad[5];
            */ else
        return 10 + (40 * values) / numdata[sz - 1];
    });
    bullet.adapter.add("fill", function(fill, target) {
      var X = target.dataItem.categoryX;
      if (X == "1미만" || X == "1~3") return chart.colors.getIndex(0);
      else if (X == "4~6" || X == "7~9") return chart.colors.getIndex(1);
      else if (X == "10~12" || X == "13~15") return chart.colors.getIndex(2);
      else if (X == "16~18" || X == "19~21") return chart.colors.getIndex(3);
      else return chart.colors.getIndex(4);
    });
    bullet.stroke = "#ffffff";
  });
}
