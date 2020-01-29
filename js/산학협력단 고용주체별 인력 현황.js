var path = "../../../json/산학협력단 고용주체별 인력 현황.json";
var data;
var year = "2019";
var chartid = [
    "chartdiv11", "chartdiv12", "chartdiv13", "chartdiv14", "chartdiv15",
    "chartdiv22", "chartdiv23", "chartdiv24", "chartdiv25"
];
var chartidWithType = {
    "chartdiv11": "겸직교원",
    "chartdiv12": "대학소속직원-정규직",
    "chartdiv13": "대학소속직원-무기계약직",
    "chartdiv14": "대학소속직원-기간제계약직",
    "chartdiv15": "대학소속직원-기타",
    "chartdiv22": "산학협력단자체임용직원-정규직",
    "chartdiv23": "산학협력단자체임용직원-무기계약직",
    "chartdiv24": "산학협력단자체임용직원-기간제계약직",
    "chartdiv25": "산학협력단자체임용직원-기타"
};
var color = {
    "2년 이하": "#FE4459",
    "2년 ~ 4년 이하": "#E8A343",
    "4년 ~ 6년 이하": "#FCFF57",
    "6년 초과": "#43E884"
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

function processDataForGraph(_data) {
    _data = _data.filter(e => e["연도"] == year);
    graph_data = [];
    _data.forEach(e => {
        let total = 0;
        let obj = {};
        obj["belong"] = e["소속"];
        obj["data"] = [];

        Object.keys(e).map(key => {
            let innerObj = {};
            if (Number.isInteger(e[key])) {
                total += e[key];
                innerObj["type"] = key;
                innerObj["value"] = e[key];
                innerObj["color"] = color[key];
                obj["data"].push(innerObj);
            }
        });

        obj["total"] = total;
        graph_data.push(obj);
    });

    return graph_data;
}

function init() {
    loadJSON(path, function (_data) {
        data = _data.slice(0);
        _data = processDataForGraph(_data);
        drawChart(_data);
    });
}

function changeInput(value) {
    year = value;
    _data = data.slice(0);
    _data = processDataForGraph(_data);
    drawChart(_data);
}

function drawPieChart(_data, id, total) {
    var chart = am4core.create(id, am4charts.PieChart);
    chart.data = _data;

    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "type";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth = 0;
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    let label = chart.createChild(am4core.Label);
    label.text = '(' + total.toString() + '명)';
    label.align = "right";
    label.fontSize = "20px";
}

function drawChart(_data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        for (let i = 0; i < chartid.length; ++i) {
            aData = _data.filter(e => e["belong"] == chartidWithType[chartid[i]]);
            drawPieChart(aData[0]["data"], chartid[i], aData[0]["total"]);
        }
    });
}