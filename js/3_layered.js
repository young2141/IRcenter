var year;
function conditions() {
    year = document.getElementById("years").value;
    var cond = [
        "학생부교과",
        "논술",
        "학생부종합 일반",
        "학생부종합 농어촌",
        "정시 일반"
    ];
    for (var i = 0; i < 5; i++) {
        parsing2(cond[i], i + 1);
    }
}

function parsing2(_condition, _cnt) {
    var filename = "3page_" + _condition + ".json";
    $.getJSON("../../json/" + filename, jsonData => {
        var data = [];
        var categories = ["1~1.5", "1.5~2", "2~2.5", "2.5~3.5", "3.5~5"];
        categories.reverse();
        for (var i = 0; i < 5; i++) {
            var temp = {};
            temp["category"] = categories[i] + "등급";
            temp["apply"] = jsonData["apply"][categories[i]];
            temp["admission"] = jsonData["admission"][categories[i]];
            if (jsonData["pass"]) temp["pass"] = jsonData["pass"][categories[i]];
            data.push(temp);
        }
        drawLayeredChart(data, _cnt, _condition);
    });
}

function drawLayeredChart(_data, _cnt, _condition) {
    var condition = ["학생부교과", "논술", "학생부종합 일반", "학생부종합 농어촌", "정시 일반"]
    am4core.useTheme(am4themes_animated);

    var container = am4core.create("chartdiv2", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    function layerChart(cond) {
        var chart = container.createChild(am4charts.XYChart);
        chart.width = am4core.percent(15);

        chart.data = _data;

        var title = chart.titles.create();
        title.text = cond;
        title.fontSize = 17;
        title.marginBottom = 10;
        title.paddingLeft = 50;

        // Create axes : 가로축
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.max = 7000;
        valueAxis.min = 0;

        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = -90;

        function createSeries(_chart, value, ko, percent, rgb) {
            var series = _chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = value; // 총 지원자 수
            series.dataFields.categoryX = "category";

            series.clustered = false;
 
            series.columns.template.stroke = am4core.color(rgb); // color
            series.columns.template.fill = am4core.color(rgb); // color
            if (ko == "지원인원") {
                series.columns.template.width = am4core.percent(85);
                series.columns.template.tooltipText = year + "학년도 " + cond + "전형 지원자는 {valueY}명 입니다.";
            }
            else if (ko == "기준점수 통과인원") {
                series.columns.template.width = am4core.percent(40);
                series.columns.template.tooltipText = year + "학년도 " + cond + "전형 지원자는 {valueY}명 입니다.";
            }
            else {
                series.columns.template.width = am4core.percent(20);
                series.columns.template.tooltipText = year + "학년도 " + cond + "전형 지원자는 {valueY}명 입니다.";
            }

        }

        var values = ["apply", "pass", "admission"];
        var korean = ["지원인원", "기준점수 통과인원", "입학인원"];
        var RGB = ["#0054ff", "#32a600", "#ff1212"];
        for (var i = 0; i < 3; i++) {
            createSeries(chart, values[i], korean[i], 80 - i * 30, RGB[i]);
        }
    }

    for (var i = 0; i < 5; i++) {
        layerChart(condition[i]);
    }
}