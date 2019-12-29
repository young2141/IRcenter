function parsingPie() {
    var year = parseInt($('#years').val())// string 타입
    var filename = "doyeong_graduation_status_pie.json";
    $.getJSON("../../../json/" + filename, (jsonData) => {
        var cnt = 0;
        var num = 5;
        while (cnt < 1) {
            for (var i = 0; i < jsonData.length; i++) {
                if (String(year) == jsonData[i]["category"]) {
                    var data = [
                        {
                            "category": "진학",
                            "value": jsonData[i]["enter"]
                        },
                        {
                            "category": "취업자",
                            "value": jsonData[i]["employment"]
                        },
                        {
                            "category": "입대자",
                            "value": jsonData[i]["millitary"]
                        },
                        {
                            "category": "외국인유학생",
                            "value": jsonData[i]["foreign"]
                        },
                        {
                            "category": "기타/미상",
                            "value": jsonData[i]["etc"]
                        },
                        {
                            "category": "취업불가능자/제외인정자",
                            "value": jsonData[i]["exception"]
                        }
                    ];
                    drawPie(data);
                    cnt++;
                    break;
                }
            }
        }
    })
}

function drawPie(_data) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.data = _data;
        console.log(_data);
        var title = chart.titles.create();
        title.fontSize = 15;
        title.dx = 140;
        title.dy = 0;
        createSeries(chart);
    });
}

function createSeries(_chart) {
    var pieSeries = _chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "category";
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.stroke = am4core.color("#ffffff");
    pieSeries.tooltip.getFillFromObject = false;
    // pieSeries.slices.template.tooltipText =
    //   "[#000]2019학년도 전체 신입생 중 {full_name} 출신은 [bold]{value.percent.formatNumber('#.#')}%[] 입니다.";
    // 툴팁에 실제 value값도 필요하다면 ({value}명) 추가하기
    pieSeries.tooltip.label.fill = am4core.color("#000000");

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    pieSeries.colors.list = [
        "#ff3d00",
        "#ef5350",
        "#ff7f27",
        "#ffc102",
        "#fdf5bc"
    ].map(color => {
        return new am4core.color(color);
    });
}