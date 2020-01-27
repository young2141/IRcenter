var path = "../../../json/전임교원 산업체 경력 현황.json";
var data;
var year = "2019";
var majorclass = "(전체)";
var color = {
    "경력없음": "#FE4459",
    "1년 미만": "#E8A343",
    "1년 ~ 3년 미만": "#FCFF57",
    "3년 ~ 5년 미만": "#43E884",
    "5년 이상": "#52A1FF"
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

function processDataForGraph(_data, majorclass){
    if(majorclass != "(전체)"){
        _data = _data.filter(e => e["계열"] == majorclass)        ;
    }

    _data = _data.filter(e => e["연도"] == year);

    statistic = {
        "경력없음": 0,
        "1년 미만": 0,
        "1년 ~ 3년 미만": 0,
        "3년 ~ 5년 미만": 0,
        "5년 이상": 0,
    };

    _data.forEach(e => {
        statistic["경력없음"] += e["경력 없음"];
        statistic["1년 미만"] += e["1년 미만"];
        statistic["1년 ~ 3년 미만"] += e["1년 ~ 3년 미만"];
        statistic["3년 ~ 5년 미만"] += e["3년 ~ 5년 미만"];
        statistic["5년 이상"] += e["5년 이상"];
    });

    graph_data = [];

    let total = 0;
    Object.keys(statistic).map(key => {total += statistic[key];});

    Object.keys(statistic).map(key => {
        let obj = {};
        obj["type"] = key;
        obj["percent"] = statistic[key] / total;
        obj["value"] = statistic[key];
        obj["color"] = color[key];
        graph_data.push(obj);
    });

    return graph_data;
}

function init() {
    loadJSON(path, function (_data) {
        data = _data.slice(0);
        _data = processDataForGraph(_data, majorclass);
        drawChart(_data);
    });
}

function changeInput(type, value){
    if(type == "year"){
        year = value;
        _data = data.slice(0);
        _data = processDataForGraph(_data, majorclass);
        drawChart(_data);
    }else if(type == "majorclass"){
        majorclass = value;
        _data = data.slice(0);
        _data = processDataForGraph(_data, majorclass);
        drawChart(_data);
    }
}

function drawChart(data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.data = data;

        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "percent";
        pieSeries.dataFields.category = "type";
        pieSeries.slices.template.propertyFields.fill = "color";
        pieSeries.slices.template.strokeWidth = 0;
    });
}