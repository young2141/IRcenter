var path = "../../../json/산학협력단 고용주체별 인력현황.json";
var path2 = "../../../json/산업협력단 담당업무별 인력현황.json";
var data;
var data2;
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
var clicked_cell = undefined;
var legends = {
    "legend1": 1,
    "legend2": 5,
    "legend3": 10,
    "legend4": 30,
    "legend5": 50
};
var manSize = {
    "1": 10,
    "5": 13,
    "10": 16,
    "30": 19,
    "50": 22
};
var legendValue = [1, 5, 10, 30, 50];
var h2String = {
    "cell11": "대학소속직원 겸직교원 고용주체별 인력현황",
    "cell12": "대학소속직원 정규직 고용주체별 인력현황",
    "cell13": "대학소속직원 무기계약직 고용주체별 인력현황",
    "cell14": "대학소속직원 기간제계약직 고용주체별 인력현황",
    "cell15": "대학소속직원 기타 고용주체별 인력현황",
    "cell22": "산학협력단체임용직원 정규직 인력현황",
    "cell23": "산학협력단체임용직원 무기계약직 인력현황",
    "cell24": "산학협력단체임용직원 기간제계약직 인력현황",
    "cell25": "산학협력단체임용직원 기타 인력현황"
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
    loadJSON(path2, function (_data) {
        data2 = _data.slice(0);
    });
}

function changeInput(value) {
    let cell = document.getElementById(clicked_cell);
    clicked_cell = undefined;
    cell.style.backgroundColor = "#ffffff";
    while (detail_table.firstChild) {
        detail_table.firstChild.remove();
    }
    while (legend.firstChild) {
        legend.firstChild.remove();
    }

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

function drawChart2(chartid, data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var iconPath = "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z"

        var chart = am4core.create(chartid, am4charts.SlicedChart);

        let idx = 0;
        let graph_data = [];
        let obj = {};
        let dict = {};
        obj["type"] = "stage1";
        for (let i = 4; i >= 0; --i) {
            let cnt = parseInt(data["value"] / legendValue[i]);
            if (cnt >= 1) {
                data["value"] -= legendValue[i] * cnt;
                for (let j = 0; j < cnt; ++j) {
                    obj["value" + idx.toString()] = legendValue[i];
                    dict["value" + idx.toString()] = legendValue[i];
                    idx++;
                }
            }
        }

        graph_data.push(obj);

        if (data["value"] != 0) {
            obj["value" + idx.toString()] = data["value"];
            dict["value" + idx.toString()] = 1;

            let obj2 = {};
            obj2["type"] = "stage2";
            obj2["value" + idx.toString()] = 1 - data["value"];
            graph_data.push(obj2);
        }
        let len = Object.keys(graph_data[0]).length - 1;
        chart.data = graph_data;

        for (let i = 0; i < len; ++i) {
            var series = chart.series.push(new am4charts.PictorialStackedSeries());
            series.dataFields.value = "value" + i.toString();
            series.dataFields.category = "type";
            series.width = manSize[dict["value" + i.toString()].toString()];
            series.maskSprite.path = iconPath;
            series.labels.template.disabled = "true";
            series.ticks.template.disabled = "true";
        }
    }); // end am4core.ready()
}

function drawLegend() {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var iconPath = "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z";
        let legend = document.getElementById("legend");
        let br2 = document.createElement("br");
        legend.appendChild(br2);
        let title = document.createElement("span");
        title.innerHTML = "크기, 인원수";
        title.style.fontSize = "20px";
        title.style.fontWeight = "bold";
        let br = document.createElement("br");
        legend.appendChild(title);
        legend.appendChild(br);
        let div = document.createElement("div");
        div.width = "100%";
        div.height = "100%";
        div.id = "legend_temp"
        legend.appendChild(div);

        let chart = am4core.create("legend_temp", am4charts.SlicedChart);
        chart.layout = "vertical";
        chart.autoMargins = false;
        chart.data = [{
            "name": "person",
            "value": 1
        }];

        let dx = -130;
        let dy = -100;
        for (let i = 0; i < 5; ++i) {
            let legendName = "legend" + (i + 1).toString();
            var series = chart.series.push(new am4charts.PictorialStackedSeries());
            series.dataFields.value = "value";
            series.dataFields.category = "name";
            series.labels.template.disabled = "true";
            series.width = manSize[legends[legendName]];
            series.dy = -50;
            series.maskSprite.path = iconPath;
            series.tooltip.disabled = "true";
            if (i != 0) {
                series.marginLeft = "35px";
            }

            let label = chart.createChild(am4core.Label);
            label.text = legends[legendName] + "명";
            label.align = "center";
            label.dx = dx;
            label.dy = dy;
            dx += 50;
            dy -= 19;
        }
    }); // end am4core.ready()
}

function processDataForGraph2(_data, type) {
    _data = _data.filter(e => {
        return e["연도"] == year && e["구분"] == type;
    })[0];

    graph_data2 = [];
    Object.keys(_data).map(key => {
        if (key != "구분" && key != "연도") {
            let obj = {};
            obj["type"] = key;
            obj["value"] = _data[key];
            graph_data2.push(obj);
        }
    });
    return graph_data2;
}


function clickTabelCell(id) {
    let summaryBox = document.getElementById("summaryBox2");
    while(summaryBox.firstChild){
        summaryBox.firstChild.remove();
    }
    let h2 = document.createElement("h2");
    h2.innerHTML = h2String[id];
    summaryBox.appendChild(h2);


    if (parseInt(year) < 2012) {
        return;
    } else {
        let detail_table = document.getElementById("detail_table");
        let legend = document.getElementById("legend");
        let cell = document.getElementById(id);
        if (clicked_cell == id) {
            while (detail_table.firstChild) {
                detail_table.firstChild.remove();
            }
            while (legend.firstChild) {
                legend.firstChild.remove();
            }
            clicked_cell = undefined;
            cell.style.backgroundColor = "#ffffff";
            return;
        } else {
            if (clicked_cell != undefined) {
                let before_cell = document.getElementById(clicked_cell);
                before_cell.style.backgroundColor = "#ffffff";
            }
            while (detail_table.firstChild) {
                detail_table.firstChild.remove();
            }
            while (legend.firstChild) {
                legend.firstChild.remove();
            }
            drawLegend();

            clicked_cell = id;
            cell.style.backgroundColor = "#00ff00";
            let type = chartidWithType["chartdiv" + id.slice(4)];
            let _data = data2.slice(0);
            _data = processDataForGraph2(_data, type);
            let table = document.createElement("table");
            table.style.width = "30%";
            table.style.float = "left";

            let total = 0;
            for (let i = 0; i < _data.length; ++i) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerHTML = _data[i]["type"];
                tr.appendChild(td);
                tr.style.height = "120px"

                let td2 = document.createElement("td");
                td2.style.width = "80%";
                td2.style.position = "relative";
                if (_data[i]["value"] != 0) {
                    let span = document.createElement("span");
                    span.id = _data[i]["type"];
                    span.className = "chartdiv2";
                    // span.style.height = "100%";
                    td2.appendChild(span);
                }

                let text = document.createElement("span");
                text.innerHTML = _data[i]["value"];
                text.className = "text";
                td2.appendChild(text);
                tr.appendChild(td2);
                table.appendChild(tr);

                total += _data[i]["value"];
            }
            document.getElementById("detail_table").appendChild(table);

            let arrow = document.createElement("span")
            arrow.className = "triangle";
            arrow.style.float = "left";
            arrow.style.marginLeft = "150px";
            arrow.style.marginTop = "350px";
            document.getElementById("detail_table").appendChild(arrow);          

            let totalMan = document.createElement("span");
            totalMan.id = "totalMan";
            totalMan.style.position = "absolute";
            totalMan.style.height = "300px";
            totalMan.style.width = "50%";
            totalMan.style.float ="left";
            totalMan.style.marginLeft = "150px";
            totalMan.style.marginTop = "200px";
            totalMan.style.verticalAlign = "middle";
            totalMan.innerHTML = total.toString();
            let total_obj = { "value": total };
            document.getElementById("detail_table").appendChild(totalMan);

            let additionalDiv = document.createElement("div");
            additionalDiv.style.clear = "both";
            document.getElementById("detail_table").appendChild(additionalDiv);

            for (let i = 0; i < _data.length; ++i) {
                if (_data[i]["value"] != 0) {
                    drawChart2(_data[i]["type"], _data[i]);
                }
            }

            if (total != 0) {
                drawChart2("totalMan", total_obj);
            }
        }
    }
}
