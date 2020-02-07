var path = "../json/산학협력단 고용주체별 인력 현황(도한).json";
var data;

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

function processDataForGraph(_data){
    // _data.forEach(e => e["연도"] = e["연도"] + '    ');
    // _data.sort((a, b) => { return a["연도"] - b["연도"] ? 1 : -1; });
    return _data;
}

function init() {
    loadJSON(path, function (_data) {
        data = _data.slice(0);
        _data = processDataForGraph(_data);
        drawChart(_data);
    });
}

function drawChart(data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;

        var categoryYAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryYAxis.dataFields.category = "연도";
        categoryYAxis.renderer.minGridDistance = 20;
        categoryYAxis.renderer.grid.template.location = 0;
        categoryYAxis.reversed = true

        var valueXAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueXAxis.renderer.grid.template.location = 0;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "연도";
        series.dataFields.valueX = "학기제";
    });
}