function conditions() {
    var cond = ["학생부교과", "논술", "학생부종합 일반", "학생부종합 농어촌","정시 일반"];
    for (var i = 0; i < 5; i++) {
        parsing2(cond[i], i + 1);
    }
}

function parsing2(_condition, _cnt) {
    var filename = "3page_" + _condition + ".json";
    $.getJSON("../../json/" + filename, (jsonData) => {
        var data = [];
        var categories = ["1~1.5", "1.5~2", "2~2.5", "2.5~3.5", "3.5~5"];
        categories.reverse();
        for (var i = 0; i < 5; i++) {
            var temp = {};
            temp["category"] = categories[i] + "등급";
            temp["apply"] = jsonData["apply"][categories[i]];
            temp["admission"] = jsonData["admission"][categories[i]];
            if (jsonData["pass"]) temp["pass"] = jsonData["pass"][categories[i]]
            data.push(temp)
        }
        drawLayeredChart(data, _cnt, _condition);
    })
}

function drawLayeredChart(_data, _cnt, _condition) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_material);

        var chart = am4core.create("chartdiv2-" + String(_cnt), am4charts.XYChart);
        chart.data = _data;
        chart.numberFormatter.numberFormat = "#,###";

        var title = chart.titles.create();
        title.text = _condition;
        title.fontSize = 17;
        title.marginBottom = 10;
        title.paddingLeft = 50;

        var tit = chart.titles.create();
        tit.text = "(단위 : 명)";
        tit.fontSize = 15;
        tit.dx = 90;
        tit.dy = -10;
        if (_cnt != 5) tit.fillOpacity = 0;



        // Create axes : 가로축
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.title.text = "인원 수 (명)"; // 세로축 설명
        valueAxis.title.fontWeight = 800; // 걍 글자 굵기
        valueAxis.unitPosition = "left";
        valueAxis.max = 7000;
        valueAxis.min = 0;


        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = -90;

        if (_condition == "학생부교과" || _condition == "논술") {
            var values = ["apply", "pass", "admission"];
            var korean = ["지원인원", "기준점수 통과인원", "입학인원"];
            var RGB = ["#0054ff", "#32a600", "#ff1212"];
            for (var i = 0; i < 3; i++) {
                createSeries(chart, values[i], korean[i], 80 - i * 30, RGB[i]);
            }
        } else {
            var values = ["apply", "admission"];
            var korean = ["지원인원", "입학인원"];
            var RGB = ["#0054ff", "#ff1212"];
            for (var i = 0; i < 2; i++) {
                createSeries(chart, values[i], korean[i], 80 - i * 28, RGB[i]);
            }
        }

        if (_cnt >= 2) {
            // valueAxis.renderer.line.stroke = am4core.color("#ffffff")//series.stroke;
            // valueAxis.renderer.labels.template.fill = am4core.color("#ffffff")
            valueAxis.renderer.labels.template.fillOpacity = 0;
        }



        // chart.cursor = new am4charts.XYCursor();
        // chart.cursor.lineX.disabled = true;
        // chart.cursor.lineY.disabled = true;

        //chart.legend = new am4charts.Legend();
    }) // end iter callback function
}

function createSeries(_chart, value, ko, percent, rgb) {
    var series = _chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = value; // 총 지원자 수
    series.dataFields.categoryX = "category";
    series.name = ko;
    series.clustered = false;
    series.columns.template.width = am4core.percent(percent);
    series.columns.template.stroke = am4core.color(rgb); // color
    series.columns.template.fill = am4core.color(rgb); // color
    if (ko == "지원인원") series.columns.template.width = am4core.percent(85)
    else if (ko == "기준점수 통과인원") series.columns.template.width = am4core.percent(40)
    else series.columns.template.width = am4core.percent(20)


}