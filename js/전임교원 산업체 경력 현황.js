var path = "../../../json/전임교원 산업체 경력 현황.json";
var data;
var year = "2019";
var majorclass = "(전체)";
var fontSize = "20px";
var innerHTML = "■";
var colorUnder2012 = {
    "1년 미만": "#E8A343",
    "1년 ~ 3년 미만": "#FCFF57",
    "3년 ~ 5년 미만": "#43E884",
    "5년 이상": "#52A1FF"
};
var colorUpper2012 = {
    "경력없음": "#FE4459",
    "1년 미만": "#E8A343",
    "1년 ~ 3년 미만": "#FCFF57",
    "3년 ~ 5년 미만": "#43E884",
    "5년 ~ 10년 미만": "#52A1FF",
    "10년 이상": "#52AAAA"
};

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

function processDataForGraph(_data, majorclass) {
    if (majorclass != "(전체)") {
        _data = _data.filter(e => e["계열"] == majorclass);
    }

    _data = _data.filter(e => e["연도"] == year);
    if (parseInt(year) < 2012) {
        statistic = {
            "1년 미만": 0,
            "1년 ~ 3년 미만": 0,
            "3년 ~ 5년 미만": 0,
            "5년 이상": 0,
        };

        _data.forEach(e => {
            statistic["1년 미만"] += e["1년 미만"];
            statistic["1년 ~ 3년 미만"] += e["1년 ~ 3년 미만"];
            statistic["3년 ~ 5년 미만"] += e["3년 ~ 5년 미만"];
            statistic["5년 이상"] += e["5년 이상"];
        });
    }else{
        statistic = {
            "경력없음": 0,
            "1년 미만": 0,
            "1년 ~ 3년 미만": 0,
            "3년 ~ 5년 미만": 0,
            "5년 ~ 10년 미만": 0,
            "10년 이상": 0
        };

        _data.forEach(e => {
            statistic["경력없음"] += e["경력 없음"];
            statistic["1년 미만"] += e["1년 미만"];
            statistic["1년 ~ 3년 미만"] += e["1년 ~ 3년 미만"];
            statistic["3년 ~ 5년 미만"] += e["3년 ~ 5년 미만"];
            statistic["5년 ~ 10년 미만"] += e["5년 ~ 10년 미만"];
            statistic["10년 이상"] += e["10년 이상"];
        });
    }

    graph_data = [];

    Object.keys(statistic).map(key => {
        let obj = {};
        obj["type"] = key;
        obj["value"] = statistic[key];
        if(parseInt(year) < 2012){
            obj["color"] = colorUnder2012[key];
        }else{
            obj["color"] = colorUpper2012[key];
        }
        graph_data.push(obj);
    });

    return graph_data;
}

//범례 제거 및 생성 함수
function makeColorDiv() {
    //범례 제거
    let div_color = document.getElementById("div_color");
    while (div_color.firstChild) {
        div_color.firstChild.remove();
    }

    //연도에 따른 범례 생성
    if (parseInt(year) < 2012) {
        Object.keys(colorUnder2012).map(key => {
            let span = document.createElement("span");
            span.style.color = colorUnder2012[key];
            span.style.fontSize = fontSize;
            span.innerHTML = innerHTML;
            div_color.appendChild(span);
            div_color.appendChild(document.createTextNode(key));
            div_color.appendChild(document.createElement("br"));
        });
    } else {
        Object.keys(colorUpper2012).map(key => {
            let span = document.createElement("span");
            span.style.color = colorUpper2012[key];
            span.style.fontSize = fontSize;
            span.innerHTML = innerHTML;
            div_color.appendChild(span);
            div_color.appendChild(document.createTextNode(key));
            div_color.appendChild(document.createElement("br"));
        });
    }
}

function init() {
    loadJSON(path, function (_data) {
        makeColorDiv()
        data = _data.slice(0);
        _data = processDataForGraph(_data, majorclass);
        drawChart(_data);
    });
}

function changeInput(type, value) {
    if (type == "year") {
        year = value;
        makeColorDiv();
        _data = data.slice(0);
        _data = processDataForGraph(_data, majorclass);
        drawChart(_data);
    } else if (type == "majorclass") {
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
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "type";
        pieSeries.slices.template.propertyFields.fill = "color";
        pieSeries.slices.template.strokeWidth = 0;
    });
}