var path = "../../../json/교원및조교_요약_연도별그래프.json";
var data;
var year = "2019";
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

function makeDataToDrawGraph3(data) {
    var graph_data = [];
    var fulltime = ["교수", "부교수", "조교수", "전임강사"];
    var nonexecutive = ["겸임교수", "초빙교수", "기금교수", "계약교수", "명예교수", "방문교수", "시간강사", "외래강사"];
    var TA = "조교";

    data = data.filter((e) => e["연도"] == year)[0];
    delete data["연도"];
    var graph_data = [];

    if (parseInt(year) > 2012) {
        Object.keys(data).map(key => {
            if (key == "전임강사") {
                delete data[key];
            }
        });
    }

    if (parseInt(year) < 2017) {
        Object.keys(data).map(key => {
            if (key == "방문교수") {
                delete data[key];
            }
        })
    }

    if (parseInt(year) > 2014) {
        Object.keys(data).map(key => {
            if (key == "외래강사") {
                delete data[key];
            }
        })
    }

    Object.keys(data).map(key => {
        // if(data[key] == 0) continue;
        let obj = {};
        // obj["prof_class"] = key;
        // obj["value"] = data[key];
        if (fulltime.includes(key)) {
            obj["fulltime"] = key;
            obj["valueForFulltime"] = data[key];
            obj["color"] = color[key];
        } else if (nonexecutive.includes(key)) {
            obj["nonexecutive"] = key;
            obj["valueForNonexecutive"] = data[key];
            obj["color"] = color[key];
        } else if (TA == key) {
            obj["TA"] = key;
            obj["valueForTA"] = data[key];
            obj["color"] = color[key];
        }
        graph_data.push(obj);
    })
    return graph_data;
}

function getColors(){
    var color_fulltime = document.getElementById("color_fulltime");
    var color_nonexecutive = document.getElementById("color_nonexecutive");
    var color_TA = document.getElementById("color_TA");

    color["전임교원"] = window.getComputedStyle(color_fulltime).color;
    color["비전임교원"] = window.getComputedStyle(color_nonexecutive).color;
    color["조교"] = window.getComputedStyle(color_TA).color;
}

function init2() {
    loadJSON(path, function (_data) {
        getColors();
        data = _data.slice(0);
        _data = makeDataToDrawGraph3(_data);
        drawChart3(_data);
    });
}

function changeInput(value) {
    year = value;
    let _data = data.slice(0);
    _data = makeDataToDrawGraph3(_data);
    drawChart3(_data);
}



function drawChart3(data) {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart1 = am4core.create("chartdiv3", am4charts.XYChart);
        chart1.data = data;
        chart1.title = "전임교원";

        var categoryAxis1 = chart1.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis1.dataFields.category = "fulltime";
        categoryAxis1.renderer.minGridDistance = 20;
        // categoryAxis1.renderer.grid.template.disabled = true;
        categoryAxis1.renderer.labels.template.fontSize = 12;
        categoryAxis1.renderer.grid.template.location = 0;

        var valueAxis1 = chart1.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.max = 1000;
        valueAxis1.renderer.grid.template.location = 0;
        // valueAxis1.renderer.grid.template.disabled = true;

        var series1 = chart1.series.push(new am4charts.ColumnSeries());
        series1.dataFields.categoryX = "fulltime";
        series1.dataFields.valueY = "valueForFulltime";
        series1.columns.template.width = 20;
        series1.columns.template.fill = "#ff0000";



        var chart2 = am4core.create("chartdiv4", am4charts.XYChart);
        chart2.data = data;
        chart2.title = "비전임교원";

        var categoryAxis2 = chart2.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis2.dataFields.category = "nonexecutive";
        categoryAxis2.renderer.minGridDistance = 20;
        // categoryAxis2.renderer.grid.template.disabled = true;
        categoryAxis2.renderer.labels.template.fontSize = 12;
        categoryAxis2.renderer.grid.template.location = 0;

        var valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.max = 1000;
        valueAxis2.renderer.labels.template.disabled = true;
        valueAxis2.renderer.grid.template.location = 0;
        // valueAxis2.renderer.grid.template.disabled = true;

        var series2 = chart2.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryX = "nonexecutive";
        series2.dataFields.valueY = "valueForNonexecutive";
        series2.columns.template.width = 20;
        series2.columns.template.fill = "#00ff00";



        var chart3 = am4core.create("chartdiv5", am4charts.XYChart);
        chart3.data = data;
        chart3.title = "조교";

        var categoryAxis3 = chart3.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis3.dataFields.category = "TA";
        categoryAxis3.renderer.minGridDistance = 20;
        categoryAxis3.renderer.labels.template.fontSize = 12;
        // categoryAxis3.renderer.grid.template.disabled = true;
        categoryAxis3.renderer.grid.template.location = 0;

        var valueAxis3 = chart3.yAxes.push(new am4charts.ValueAxis());
        valueAxis3.max = 1000;
        valueAxis3.renderer.labels.template.disabled = true;
        // valueAxis3.renderer.grid.template.disabled = true;
        valueAxis3.renderer.grid.template.location = 0;

        var series3 = chart3.series.push(new am4charts.ColumnSeries());
        series3.dataFields.categoryX = "TA";
        series3.dataFields.valueY = "valueForTA";
        series3.columns.template.width = 20;
        series3.columns.template.fill = "#0000ff";
    });
}