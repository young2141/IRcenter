var path = "../json/교원및조교_요약_연도별그래프.json";

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

function makeDataToDrawGraph(data) {
    var graph_data = [];
    var fulltime = ["교수", "부교수", "조교수", "전임강사"];
    var nonexecutive = ["겸임교수", "초빙교수", "기금교수", "계약교수", "명예교수", "방문교수", "시간강사", "외래강사"];
    var TA = "조교";
    var color = ["#ff0000", "#0000ff", "#00ff00"];

    data = data.filter((e) => e["연도"] == "2019")[0];
    delete data["연도"];
    var graph_data = [];

    Object.keys(data).map(key => {
        let obj = {};
        obj["prof_class"] = key;
        obj["value"] = data[key];
        if (fulltime.includes(key)) {
            obj["color"] = color[0];
        } else if (nonexecutive.includes(key)) {
            obj["color"] = color[1];
        } else if (TA == key) {
            obj["color"] = color[2];
        }
        graph_data.push(obj);
    })
    return graph_data;
}

function init() {
    loadJSON(path, function (data) {
        data = makeDataToDrawGraph(data);
        drawChart(data);
    });
}

function drawChart(data) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "prof_class";
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 5;
        xAxis.renderer.labels.template.fontSize = 10;

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.minGridDistance = 100;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "prof_class";
        series.dataFields.valueY = "value";

        series.columns.template.adapter.add("fill", function (fill, target) {
            return am4core.color(target.dataItem.dataContext.color);
        });
    });
}