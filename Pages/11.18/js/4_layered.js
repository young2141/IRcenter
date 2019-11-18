function years1() {
    var start = 2010;
    var end = 2019;
    var condition1 = $('input:radio[name=admit]:checked').val();
    var condition2 = $('select[name=college]').val();
	console.log(condition1, condition2)
    var data = []
    for (var year = start; year <= end; year++) {
        parsing1(year, condition1, condition2, data);
    }
}

function parsing1(_year, _condition1, _condition2, _data) {
    var filename = "4page_" + String(_year) + "_colleage_" + _condition1 + ".json";
    var temp = { "year": _year };
    $.getJSON("../../json/" + filename, (jsonData) => {
        temp["recruitment"] = jsonData[_condition2]["recruitment"];
        temp["applied"] = jsonData[_condition2]["applied"];
        temp["admitted"] = jsonData[_condition2]["admitted"];
        _data.push(temp);
        if (_data.length === 10) {
            drawLayeredChart(_data,_condition1);
        }
    })
}


function drawLayeredChart(_data,type) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_material);

        var chart = am4core.create("chartdiv1", am4charts.XYChart);
        chart.data = _data;
        chart.numberFormatter.numberFormat = "####";

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.disabled = true;
        chart.cursor.lineX.disabled = true;
        var title = chart.titles.create();
        title.text = "(단위 : 명)"
        title.fontSize = 15;
        title.marginBottom = 30;
        title.dx = 450;
        title.dy = -5;

        // Create axes : 가로축
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.title.text = "인원 수 (명)"; // 세로축 설명
        // valueAxis.title.fontWeight = 800; // 걍 글자 굵기
        // valueAxis.unitPosition = "left";

        var values = ["applied", "recruitment", "admitted"];
        var korean = ["지원자", "모집인원", "입학자"];
        var RGB = ["#0054ff", "#32a600", "#ff1212"];

        for (var i = 0; i < 3; i++) {
            createSeries(chart, values[i], korean[i], 80 - i * 28, RGB[i],type);
        }
        // chart.cursor = new am4charts.XYCursor();
        // chart.cursor.lineX.disabled = true;
        // chart.cursor.lineY.disabled = true;

        //chart.legend = new am4charts.Legend();
    }) // end iter callback function
}

function createSeries(_chart, value, ko, percent, rgb,type) {
    var series = _chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = value; // 총 지원자 수
    series.dataFields.categoryX = "year";
    series.name = ko;
    series.clustered = false;
    series.columns.template.width = am4core.percent(percent);
    series.columns.template.stroke = am4core.color(rgb); // color
    series.columns.template.fill = am4core.color(rgb); // color
    series.tooltip.getFillFromObject = false;
    series.tooltip.label.fill = am4core.color("#000000");
    if(type == "within")
        if(ko=="모집인원")
            series.tooltipText = "[#000]{year}년도 "+"정원내 " + ko + "은 [bold]{valueY}명[\] 입니다.";
        else
            series.tooltipText = "[#000]{year}년도 "+"정원내 " + ko + "는 [bold]{valueY}명[\] 입니다.";
    else if(type == "over")
        if(ko=="모집인원")
            series.tooltipText = "[#000]{year}년도 "+"정원외 " + ko + "은 [bold]{valueY}명[\] 입니다.";
        else
            series.tooltipText = "[#000]{year}년도 "+"정원외 " + ko + "은 [bold]{valueY}명[\] 입니다.";
    else
        if(ko=="모집인원")
            series.tooltipText = "[#000]{year}년도 "+"전체 " + ko + "은 [bold]{valueY}명[\] 입니다.";
        else
            series.tooltipText = "[#000]{year}년도 "+"전체 " + ko + "은 [bold]{valueY}명[\] 입니다.";
}   