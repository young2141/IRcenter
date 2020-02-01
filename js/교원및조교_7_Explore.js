var path = "../../../json/전체교원 대비 전임교원 현황.json";
var data;
var year = "2019";
var university = "(전체)";
var sex = "(전체)";
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

function fillSelectUniversity() {
    let _data = data.slice(0).filter(e => e["연도"] == year);
    let universities = [];
    for (let i = 0; i < _data.length; ++i) {
        if (!universities.includes(_data[i]["단과대학"])) {
            universities.push(_data[i]["단과대학"]);
        }
    }

    let select_university = document.getElementById("select_university");

    while (select_university.firstChild) {
        select_university.firstChild.remove();
    }

    let option = document.createElement("option");
    option.setAttribute("value", "(전체)");
    option.innerHTML = "(전체)";
    let br = document.createElement("br");
    select_university.appendChild(option);
    select_university.appendChild(br);

    for (let i = 0; i < universities.length; ++i) {
        let option = document.createElement("option");
        option.setAttribute("value", universities[i]);
        option.innerHTML = universities[i];
        let br = document.createElement("br");
        select_university.appendChild(option);
        select_university.appendChild(br);
    }
}

function makeDataToDrawGraph(_data) {
    let fulltime = ["교수", "부교수", "조교수", "전임강사"];
    let nonexecutive = ["겸임교원", "초빙교원", "시간강사", "강사", "기타비전임"];
    let TA = "조교";

    _data = _data.filter((e) => e["연도"] == year);
    if (university != "(전체)") {
        _data = _data.filter(e => e["단과대학"] == university);
    }

    let _data2 = [];
    for (let i = 0; i < _data.length; ++i) {
        Object.keys(_data[i]).map(key => {
            if (key != "연도" && key != "단과대학" && key != "학과") {
                let obj = {};
                let keywords = key.split('_');
                if (fulltime.includes(keywords[0])) {
                    obj["type"] = keywords[0];
                } else if (nonexecutive.includes(keywords[0])) {
                    obj["type"] = keywords[0];
                }
                obj["sex"] = keywords[1];
                obj["value"] = _data[i][key];
                _data2.push(obj);
            }
        });
    }

    if (sex != "(전체)") {
        _data2 = _data2.filter(e => e["sex"] == sex);
    }

    let graph_data = [];

    for (let i = 0; i < fulltime.length; ++i) {
        if (parseInt(year) > 2012 && i == 3) continue;

        temp = _data2.filter(e => e["type"] == fulltime[i]);
        let obj = {};
        obj["fulltime"] = fulltime[i];
        obj["value"] = 0;
        for (let j = 0; j < temp.length; ++j) {
            obj["value"] += temp[j]["value"];
        }
        graph_data.push(obj);
    }

    for (let i = 0; i < nonexecutive.length; ++i) {
        if (parseInt(year) < 2019 && i == 3) continue;

        temp = _data2.filter(e => e["type"] == nonexecutive[i]);
        let obj = {};
        obj["nonexecutive"] = nonexecutive[i];
        obj["value"] = 0;
        for (let j = 0; j < temp.length; ++j) {
            obj["value"] += temp[j]["value"];
        }
        graph_data.push(obj);
    }

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

function init() {
    loadJSON(path, function (_data) {
        getColors();
        data = _data.slice(0);
        fillSelectUniversity(_data);
        _data = makeDataToDrawGraph(_data);
        drawChart(_data);
    });
}

function changeInput(type, value) {
    if (type == "year") {
        year = value;
        fillSelectUniversity();
    } else if (type == "sex") {
        sex = value
    } else if (type == "university") {
        university = value;
    }

    let _data = data.slice(0);
    _data = makeDataToDrawGraph(_data);
    drawChart(_data);
}



function drawChart(data) {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart1 = am4core.create("chartdiv1", am4charts.XYChart);
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



        var chart2 = am4core.create("chartdiv2", am4charts.XYChart);
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



        var chart3 = am4core.create("chartdiv3", am4charts.XYChart);
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