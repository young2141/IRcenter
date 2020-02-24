const path = "../../json/학위수여_5_전공별성비.json";
var data = [],
    division = "(전체)",
    degree = "학사",
    gender = "남자",
    color = {},
    chart;

//인풋 변경시 차트의 데이터를 바꿈
function reloadChart(_data){
    chart.data = _data;
}

//셀렉트 또는 라디오 인풋에 대한 처리 함수
function onClickListerner(name, value) {
    if (name == "학위") {
        degree = value;
    } else if (name == "성별") {
        gender = value;
    } else if(name == "계열"){
        division = value;
    }
    let _data = processDataForChart();
    reloadChart(_data);
}

//html의 태그에서 색상을 얻음
function getColorFromTag() {
    color["man"] = document.getElementById("color_man").getAttribute("value");
    color["woman"] = document.getElementById("color_woman").getAttribute("value");
}


//JSON 파일 파싱 함수
function loadJSON(path, success) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200 || xhr.response.length > 0) {
                success(JSON.parse(xhr.responseText));
            }
        }
    }
    xhr.open("GET", path, true);
    xhr.send();
}

//차트를 위한 데이터 처리 함수
function processDataForChart() {
    let _data = data.slice(0);
    if (division != "(전체)") {
        _data = _data.filter(e => e["계열"] == division);
    }

    let graph_data = [];
    _data.forEach(e => {
        let obj = {};
        obj["major"] = e["전공"];
        obj["total"] = 0;
        Object.keys(e).map(key => {
            if (key.includes(degree)) {
                obj["total"] += e[key];
                key.includes(gender.substr(0, 1)) ? obj["value"] = e[key] : obj["other"] = e[key];
            }
        });
        obj["pvalue"] = Math.round((obj["value"] / obj["total"]) * 100);
        obj["pother"] = 100 - obj["pvalue"];

        if (obj["total"] != 0) {
            graph_data.push(obj);
        }
    });

    graph_data = graph_data.sort((a, b) => a["pvalue"] - b["pvalue"] < 0 ? 1 : -1);

    return graph_data;
}

//초기 실행 함수
function init() {
    loadJSON(path, function (_data) {
        getColorFromTag();
        data = _data.slice(0);
        _data = processDataForChart();
        drawChart(_data);
    });
}


function drawChart(_data) {
    am4core.ready(function () {
        let other_gender, _color = [];
        if (gender == "남자") {
            other_gender = "여자";
            _color[0] = color["man"];
            _color[1] = color["woman"];
        } else {
            other_gender = "남자";
            _color[1] = color["man"];
            _color[0] = color["woman"];
        }
        am4core.useTheme(am4themes_animated);

        chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = _data;

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "major";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.inversed = true;
        categoryAxis.fontSize = 15;
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.max = 120;
        valueAxis.renderer.grid.template.location = 0;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "major";
        series.dataFields.valueX = "pvalue";
        series.stacked = true;
        series.sequencedInterpolation = true;
        series.columns.template.tooltipText = "2019학년도 {categoryY} " + degree + " 학생\n총 {total}명 중 " + gender + "는 {value}명으로, {valueX}%를 차지합니다.";
        series.fill = am4core.color("#" + _color[0]);
        series.columns.template.fillOpacity = .8;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color("#FFFFFF");
        series.tooltip.autoTextColor = false;
        series.tooltip.label.fill = am4core.color("#000000");

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryY = "major";
        series2.dataFields.valueX = "pother";
        series2.stacked = true;
        series2.sequencedInterpolation = true;
        series2.tooltip.getFillFromObject = false;
        series2.tooltip.background.fill = am4core.color("#FFFFFF");
        series2.tooltip.autoTextColor = false;
        series2.tooltip.label.fill = am4core.color("#000000");
        series2.columns.template.tooltipText = "2019학년도 {categoryY} " + degree + " 학생\n총 {total}명 중 " + other_gender + "는 {other}명으로, {valueX}%를 차지합니다.";
        series2.fill = am4core.color("#" + _color[1]);

        let LabelBullet = series.bullets.push(new am4charts.LabelBullet());
        LabelBullet.label.truncate = false;
        LabelBullet.label.wrap = false;
        LabelBullet.label.dx = 10;
        LabelBullet.label.text = "{pvalue}% n = {value}";
        LabelBullet.label.horizontalCenter ="center";
    });
}