var path = "../../../json/교원및조교_연도별교원현황.json";
var path2 = "../../../json/professor_and_assistant_assistant.json";
var data;
var data2;
var color = {
    "전임교원": undefined,
    "비전임교원": undefined,
    "조교": undefined
}

function loadJSON(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.responseText.length > 0) {
                success(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function makeDataToDrawGraph1(data) {
    var graph_data = [];
    var fulltime = ["교수", "부교수", "조교수", "전임강사"];
    var nonexecutive = ["겸임교원", "초빙교원", "시간강사", "기타비전임"];
    var TA = "조교";

    data.forEach(e => {
        let obj = {
            "연도": e["연도"],
            "전임교원": 0,
            "비전임교원": 0,
            "조교": 0,
            "none": 0
        };
        Object.keys(e).map(key => {
            if (fulltime.includes(key)) {
                obj["전임교원"] += e[key];
            } else if (nonexecutive.includes(key)) {
                obj["비전임교원"] += e[key];
            }
        });
        obj["조교"] = data2[e["연도"]]["assistant"]["male"] + data2[e["연도"]]["assistant"]["female"];
        graph_data.push(obj);
    });

    return graph_data;
}

function getColors() {
    var color_fulltime = document.getElementById("color_fulltime");
    var color_nonexecutive = document.getElementById("color_nonexecutive");
    var color_TA = document.getElementById("color_TA");

    color["전임교원"] = window.getComputedStyle(color_fulltime).color;
    color["비전임교원"] = window.getComputedStyle(color_nonexecutive).color;
    color["조교"] = window.getComputedStyle(color_TA).color;
}

function init1() {
    loadJSON(path2, function (_data) {
        data2 = _data
    });
    loadJSON(path, function (_data) {
        getColors();
        data = _data.slice(0);
        _data = makeDataToDrawGraph1(_data);
        drawChart(_data);
    });
}

function drawChart(data) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        chart = am4core.create("chartdiv1", am4charts.XYChart);
        chart.data = data;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "연도";
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 5;

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.minGridDistance = 100;
        yAxis.renderer.grid.template.location = 0;
        // yAxis.maximum = 100;
        yAxis.extraMax = 0.1;
        yAxis.calculateTotals = true;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.categoryX = "연도";
        series1.dataFields.valueY = "전임교원";
        series1.stacked = true;
        series1.name = "전임교원";
        series1.tooltipText = "{전임교원}";


        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryX = "연도";
        series2.dataFields.valueY = "비전임교원";
        series2.name = "비전임교원";
        series2.stacked = true;
        series2.tooltipText = "{비전임교원}";

        var series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.dataFields.categoryX = "연도";
        series3.dataFields.valueY = "조교";
        series3.name = "조교";
        series3.stacked = true;
        series3.tooltip.tooltipText = "{조교}";

        var totalSeries = chart.series.push(new am4charts.ColumnSeries());
        totalSeries.dataFields.valueY = "none";
        totalSeries.dataFields.categoryX = "연도";
        totalSeries.stacked = true;
        totalSeries.hiddenInLegend = true;
        totalSeries.columns.template.strokeOpacity = 0;

        var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
        totalBullet.dy = -20;
        totalBullet.label.text = "{valueY.total}";
        totalBullet.label.hideOversized = false;
        totalBullet.label.background.fillOpacity = 0.2;
        totalBullet.label.padding(5, 10, 5, 10);

        //색 변경
        series3.columns.template.fill = am4core.color(color["조교"]);
        series2.columns.template.fill = am4core.color(color["비전임교원"]);
        series1.columns.template.fill = am4core.color(color["전임교원"]);
    });
}