function iter1(temp, data, start, end, select, callback) {
  for (var i = start; i <= end; i++) {
    // start년 부터 end년까지! (2010 ~ 2018)
    /**
     * data : 배열들 담을 오브젝트
     * i : 현재 년도
     * start : 뺄 값...minus 값
     */
    doParsing1(
      data,
      i,
      start,
      select,
      (year, arrApplied, arrRecruitment, arrAdmitted) => {
        temp.push({
          // chart.data에 i년도의 값들을 집어넣어라!
          year: String(year),
          total_applied: arrApplied,
          total_recruitment: arrRecruitment,
          total_admitted: arrAdmitted
        });

        if (temp.length === end - start + 1) {
          temp.sort((a, b) => {
            return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
          });
          callback();
        }
      }
    );
  }
}

function doParsing1(data, year, minus, select, callback) {
  var file = String(year) + "년 지원자, 모집인원, 입학자.json";
  //var file = String(year) + "학년도 입시결과.json";
  $.getJSON("../json/" + file, jsonData => {
    var len = 0;
    while (len <= jsonData.length) {
      if (len === jsonData.length) {
        callback(
          year,
          data.arrApplied[year - minus],
          data.arrRecruitment[year - minus],
          data.arrAdmitted[year - minus]
        );
        break;
      }
      /**
       * select == 1 > 전체
       * select == 2 > 정원내
       * select == 3 > 정원외
       */
      if (select === 1) {
        data.arrApplied[year - minus] += jsonData[len].total_applied;
        data.arrRecruitment[year - minus] += jsonData[len].total_recruitment;
        data.arrAdmitted[year - minus] += jsonData[len].total_admitted;
      } else if (select === 2) {
        data.arrApplied[year - minus] += jsonData[len].applied_within_admission;
        data.arrRecruitment[year - minus] +=
          jsonData[len].recruitment_within_admission;
        data.arrAdmitted[year - minus] +=
          jsonData[len].man_admitted_within_admission +
          jsonData[len].woman_admitted_within_admission;
      } else {
        data.arrApplied[year - minus] += jsonData[len].applied_over_admission;
        data.arrRecruitment[year - minus] +=
          jsonData[len].recruitment_over_admission;
        data.arrAdmitted[year - minus] +=
          jsonData[len].man_admitted_over_admission +
          jsonData[len].woman_admitted_over_admission;
      }
      len++;
    }
  });
}

function createSeries1(_chart, _valueY, _name, _percent, _tooltip) {
  var series = _chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = _valueY; // 총 지원자 수
  series.dataFields.categoryX = "year";
  series.name = _name;
  series.clustered = false;
  series.columns.template.width = am4core.percent(_percent);
  series.tooltipText = _tooltip;
  return series;
}

function drawLayeredChart(arr) {
  var startYear = 2010,
    endYear = 2019;
  var select = arr.indexOf(true) + 1;
  var dataObject = {
    arrApplied: new Array(), // 총 지원자 수 배열
    arrRecruitment: new Array(), // 총 모집인원 수 배열
    arrAdmitted: new Array() // 총 입학자수 배열
  };
  var temp = [];
  for (var i = 0; i <= endYear - startYear; i++) {
    // 10개년
    dataObject.arrApplied[i] = 0;
    dataObject.arrRecruitment[i] = 0;
    dataObject.arrAdmitted[i] = 0;
  }
  // Themes begin
  // Themes end
  iter1(temp, dataObject, startYear, endYear, select, () => {
    // JSON 파일 파싱 시작!
    var tooltipApplied = "년도 : {categoryX}\n",
      tooltipRecruitment = "년도 : {categoryX}\n",
      tooltipAdmitted = "년도 : {categoryX}\n";
    if (select === 1) {
      tooltipApplied += "유형 : 총 지원자 수\n값 : [bold]{valueY}[/]";
      tooltipRecruitment += "유형 : 총 모집인원 수\n값 : [bold]{valueY}[/]";
      tooltipAdmitted += "유형 : 총 입학인원 수\n값 : [bold]{valueY}[/]";
    } else if (select === 2) {
      tooltipApplied += "유형 : 정원내 지원자 수\n값 : [bold]{valueY}[/]";
      tooltipRecruitment += "유형 : 정원내 모집인원 수\n값 : [bold]{valueY}[/]";
      tooltipAdmitted += "유형 : 정원내 입학인원 수\n값 : [bold]{valueY}[/]";
    } else {
      tooltipApplied += "유형 : 정원외 지원자 수\n값 : [bold]{valueY}[/]";
      tooltipRecruitment += "유형 : 정원외 모집인원 수\n값 : [bold]{valueY}[/]";
      tooltipAdmitted += "유형 : 정원외 입학인원 수\n값 : [bold]{valueY}[/]";
    }

    // Create chart instance
    var chart = am4core.create("chartdiv1", am4charts.XYChart);
    /**
     * 지원자수 : total_applied
     * 모집인원 : total_recruitment
     * 입학자수 : total_admitted
     * */
    chart.data = temp;
    chart.numberFormatter.numberFormat = "#a";
    // Create axes : 가로축
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    // 세로축
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "인원 수 (명)"; // 세로축 설명
    valueAxis.title.fontWeight = 800; // 걍 글자 굵기
    valueAxis.unit = "$";
    valueAxis.unitPosition = "left";

    var series1 = createSeries1(
      chart,
      "total_applied",
      "총 지원자 수",
      80,
      tooltipApplied
    );
    series1.columns.template.stroke = am4core.color("#0000ff");
    series1.columns.template.fill = am4core.color("#0000ff");
    var series2 = createSeries1(
      chart,
      "total_recruitment",
      "총 모집인원",
      60,
      tooltipRecruitment
    );
    series2.columns.template.stroke = am4core.color("#ffff00");
    series2.columns.template.fill = am4core.color("#ffff00");
    var series3 = createSeries1(
      chart,
      "total_admitted",
      "총 입학한 수",
      40,
      tooltipAdmitted
    );
    series3.columns.template.stroke = am4core.color("#ff0000");
    series3.columns.template.fill = am4core.color("#ff0000");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    //chart.legend = new am4charts.Legend();
  }); // end iter callback function
}

function iter2(temp1, temp2, data, start, end, select, callback) {
  for (var i = start; i <= end; i++) {
    // start년 부터 end년까지! (2010 ~ 2018)
    /**
     * data : 배열들 담을 오브젝트
     * i : 현재 년도
     * start : 뺄 값...minus 값
     */
    doParsing2(
      data,
      i,
      start,
      select,
      (year, arrRecruitmentRate, arrCompetitionRate) => {
        temp1.push({
          // chart.data에 i년도의 값들을 집어넣어라!
          year: String(year),
          recruitment_rate: arrRecruitmentRate
        });
        temp2.push({
          year: String(year),
          competition_rate: arrCompetitionRate
        });
        if (temp1.length === end - start + 1) {
          temp1.sort((a, b) => {
            return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
          });
          temp2.sort((a, b) => {
            return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
          });
          callback();
        }
      }
    );
  }
}

function doParsing2(data, year, minus, select, callback) {
  var file = String(year) + "년 지원자, 모집인원, 입학자.json";
  //var file = String(year) + "학년도 입시결과.json";
  $.getJSON("../json/" + file, jsonData => {
    var len = 0,
      cnt = 0;
    while (len <= jsonData.length) {
      if (len === jsonData.length) {
        callback(
          year,
          (data.arrRecruitmentRate[year - minus] / cnt).toFixed(1),
          (data.arrCompetitionRate[year - minus] / cnt).toFixed(1)
        );
        break;
      }
      /**
       * select == 1 > 전체
       * select == 2 > 정원내
       * select == 3 > 정원외
       */

      if (
        jsonData[len].recruitment_within_admission === 0 ||
        jsonData[len].recruitment_over_admission === 0
      ) {
        len++;
        continue;
      }

      if (select === 1) {
        data.arrRecruitmentRate[year - minus] +=
          ((jsonData[len].man_admitted_within_admission +
            jsonData[len].woman_admitted_within_admission) /
            jsonData[len].recruitment_within_admission) *
          100;
        data.arrCompetitionRate[year - minus] +=
          jsonData[len].applied_within_admission /
          jsonData[len].recruitment_within_admission;
      } else if (select === 2) {
        data.arrRecruitmentRate[year - minus] +=
          ((jsonData[len].man_admitted_within_admission +
            jsonData[len].woman_admitted_within_admission) /
            jsonData[len].recruitment_within_admission) *
          100;
        data.arrCompetitionRate[year - minus] +=
          jsonData[len].applied_within_admission /
          jsonData[len].recruitment_within_admission;
      } else {
        data.arrRecruitmentRate[year - minus] +=
          ((jsonData[len].man_admitted_over_admission +
            jsonData[len].woman_admitted_over_admission) /
            jsonData[len].recruitment_over_admission) *
          100;
        data.arrCompetitionRate[year - minus] +=
          jsonData[len].applied_over_admission /
          jsonData[len].recruitment_over_admission;
      }
      cnt++;
      len++;
    }
  });
}

// Create series
function createAxisAndSeries2(chart, field, name, opposite, bullet) {
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  var series = chart.series.push(new am4charts.LineSeries());

  if (field === "recruitment_rate") {
    console.log(valueAxis);
    //valueAxis.unit = "%"
    valueAxis.title.text = "충원율 (%)";
  } else if (field == "competition_rate") {
    //valueAxis.unit = ":1"
    valueAxis.title.text = "경쟁률 ( : 1)";
  }

  valueAxis.min = 0;

  series.dataFields.valueY = field;
  series.dataFields.dateX = "year";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.name = name;
  series.tooltipText = "{year}년도 {name}: [bold]{valueY}[/]";
  series.tensionX = 0.8;
  //series.stroke = rgb(255,0,0);

  var interfaceColors = new am4core.InterfaceColorSet();

  // switch (bullet) {
  //     case "triangle":
  //         var bullet = series.bullets.push(new am4charts.Bullet());
  //         bullet.width = 12;
  //         bullet.height = 12;
  //         bullet.horizontalCenter = "middle";
  //         bullet.verticalCenter = "middle";

  //         var triangle = bullet.createChild(am4core.Triangle);
  //         triangle.stroke = interfaceColors.getFor("background");
  //         triangle.strokeWidth = 2;
  //         triangle.direction = "top";
  //         triangle.width = 12;
  //         triangle.height = 12;
  //         break;
  //     case "rectangle":
  //         var bullet = series.bullets.push(new am4charts.Bullet());
  //         bullet.width = 10;
  //         bullet.height = 10;
  //         bullet.horizontalCenter = "middle";
  //         bullet.verticalCenter = "middle";

  //         var rectangle = bullet.createChild(am4core.Rectangle);
  //         rectangle.stroke = interfaceColors.getFor("background");
  //         rectangle.strokeWidth = 2;
  //         rectangle.width = 10;
  //         rectangle.height = 10;
  //         break;
  //     default:
  //         var bullet = series.bullets.push(new am4charts.CircleBullet());
  //         bullet.circle.stroke = interfaceColors.getFor("background");
  //         bullet.circle.strokeWidth = 2;
  //         break;
  //}

  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = series.stroke;
  valueAxis.renderer.labels.template.fill = series.stroke;
  valueAxis.renderer.opposite = opposite;
  valueAxis.renderer.grid.template.disabled = true;
}

function drawLineChart(arr) {
  var dataObject = {
    // 필요한 값 뽑아내는데 필요한 배열
    arrRecruitmentRate: new Array(),
    arrCompetitionRate: new Array()
  };

  var select = arr.indexOf(true) + 1;
  console.log("값 : ", select);

  var temp1 = []; //chart.data에 담길 값 임시보관
  var temp2 = [];

  for (var i = 0; i < 10; i++) {
    // 10개년
    dataObject.arrRecruitmentRate.push(0.0);
    dataObject.arrCompetitionRate.push(0.0);
  }
  iter2(temp1, temp2, dataObject, 2010, 2019, select, () => {
    // JSON 파일 파싱 시작!

    // Create chart instance
    var chart1 = am4core.create("chartdiv2-1", am4charts.XYChart); // 경쟁률
    var chart2 = am4core.create("chartdiv2-2", am4charts.XYChart); // 충원율

    // Increase contrast by taking evey second color
    chart1.colors.step = 1;
    chart2.colors.step = 1;

    // Add data
    chart1.data = temp2;
    chart2.data = temp1;
    console.log(chart1.data, chart2.data);
    // Create axes
    var dateAxis1 = chart1.xAxes.push(new am4charts.DateAxis());
    var dateAxis2 = chart2.xAxes.push(new am4charts.DateAxis());
    dateAxis1.renderer.minGridDistance = 10;
    dateAxis2.renderer.minGridDistance = 10;

    var tooltipRecruitment =
      select === 1
        ? "전체 충원율"
        : select === 2
        ? "정원내 충원율"
        : "정원외 충원율";
    var tooltipCompetition =
      select === 1
        ? "전체 경쟁률"
        : select === 2
        ? "정원내 경쟁률"
        : "정원외 경쟁률";
    createAxisAndSeries2(
      chart1,
      "competition_rate",
      tooltipCompetition,
      false,
      "circle"
    );
    createAxisAndSeries2(
      chart2,
      "recruitment_rate",
      tooltipRecruitment,
      false,
      "triangle"
    );

    // Add legend
    chart1.legend = new am4charts.Legend();
    chart2.legend = new am4charts.Legend();

    // Add cursor
    chart1.cursor = new am4charts.XYCursor();
    chart1.cursor.lineX.disabled = true;
    chart1.cursor.lineY.disabled = true;

    chart2.cursor = new am4charts.XYCursor();
    chart2.cursor.lineX.disabled = true;
    chart2.cursor.lineY.disabled = true;
  }); // end iter callback function
}

function iter3(temp1, temp2, data, year, select, callback) {
  doParsing3(
    data,
    year,
    select,
    (recruitmentRateWithin, recruitmentRateOver) => {
      temp1.push(
        {
          // chart.data에 i년도의 값들을 집어넣어라!
          name: year + "년도 신입생 정원내 충원율",
          value: recruitmentRateWithin
        },
        {
          name: "",
          value: 100 - recruitmentRateWithin
        }
      );
      temp2.push(
        {
          name: year + "년도 신입생 정원외 충원율",
          value: recruitmentRateOver
        },
        {
          name: "dumy",
          value: 100 - recruitmentRateOver
        }
      );
      callback();
    }
  );
}

function doParsing3(data, year, select, callback) {
  var file = String(year) + "년 지원자, 모집인원, 입학자.json";
  //var file = String(year) + "학년도 입시결과.json";
  $.getJSON("../json/" + file, jsonData => {
    var len = 0,
      cnt = 0;
    while (len <= jsonData.length) {
      if (len === jsonData.length) {
        callback(
          (data.recruitmentRateWithin / cnt).toFixed(1),
          (data.recruitmentRateOver / cnt).toFixed(1)
        );
        break;
      }
      if (
        jsonData[len].recruitment_within_admission === 0 ||
        jsonData[len].recruitment_over_admission === 0
      ) {
        len++;
        continue;
      }
      if (select === 1) {
        data.recruitmentRateWithin +=
          ((jsonData[len].man_admitted_within_admission +
            jsonData[len].woman_admitted_within_admission) /
            jsonData[len].recruitment_within_admission) *
          100;
        data.recruitmentRateOver +=
          ((jsonData[len].man_admitted_over_admission +
            jsonData[len].woman_admitted_over_admission) /
            jsonData[len].recruitment_over_admission) *
          100;
      } else {
        data.recruitmentRateWithin +=
          ((jsonData[len].man_admitted_within_admission +
            jsonData[len].woman_admitted_within_admission) /
            jsonData[len].recruitment_within_admission) *
          100;
        data.recruitmentRateOver +=
          ((jsonData[len].man_admitted_over_admission +
            jsonData[len].woman_admitted_over_admission) /
            jsonData[len].recruitment_over_admission) *
          100;
      }
      cnt++;
      len++;
    }
  });
}

function drawHumanChart(_divName, _year) {
  var year = _year;

  var dataObject = {
    recruitmentRateWithin: new Number(0),
    recruitmentRateOver: new Number(0)
  };
  var temp1 = [],
    temp2 = [];

  iter3(temp1, temp2, dataObject, year, 1, () => {
    var iconPath =
      "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z";

    var chart1 = am4core.create(_divName, am4charts.SlicedChart);
    chart1.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart1.data = temp1;

    var series1 = chart1.series.push(new am4charts.PictorialStackedSeries());
    series1.dataFields.value = "value";
    series1.dataFields.category = "name";
    series1.alignLabels = true;

    series1.maskSprite.path = iconPath;
    series1.ticks.template.locationX = 1;
    series1.ticks.template.locationY = 0.5;

    series1.labelsContainer.width = 290;

    chart1.legend = new am4charts.Legend();
    chart1.legend.position = "right";
    chart1.legend.valign = "bottom";
  });
}

function draw() {
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    drawLayeredChart([true, false, false]);
    drawLineChart([true, false, false]);
    /*
        for (var i = 0; i < 10; i++) {
            var name = "chartdiv3-" + String(i + 1)
            drawHumanChart(name, i + 2010)
        }*/
  });
}

draw();
