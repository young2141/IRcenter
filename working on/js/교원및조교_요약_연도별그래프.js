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

    data.forEach(e => {
        let obj = {
            "연도": e["연도"],
            "전임교원": 0,
            "비전임교원": 0,
            "조교": 0
        };
        Object.keys(e).map(key => {
            if (fulltime.includes(key)) {
                obj["전임교원"] += e[key];
            } else if (nonexecutive.includes(key)) {
                obj["비전임교원"] += e[key];
            } else if (TA == key) {
                obj["조교"] += e[key];
            }
        })
        graph_data.push(obj);
    });

    // graph_data.forEach((e, i) => {
    //     let total = e["전임교원"] + e["비전임교원"] + e["조교"];
    //     let fulltime = parseInt(e["전임교원"] / total * 100);
    //     let nonexecutive = parseInt(e["비전임교원"] / total * 100);
    //     let TA = 100 - (fulltime + nonexecutive);
    //     graph_data[i]["전임교원"] = fulltime;
    //     graph_data[i]["비전임교원"] = nonexecutive;
    //     graph_data[i]["조교"] = TA;
    // })

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
        xAxis.dataFields.category = "연도";
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 5;

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.minGridDistance = 100;
        yAxis.maximum = 100;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.categoryX = "연도";
        series1.dataFields.valueY = "전임교원";
        series1.stacked = true;
        series1.name = "전임교원";
        

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryX = "연도";
        series2.dataFields.valueY = "비전임교원";
        series2.name = "비전임교원";
        series2.stacked = true;
        

        var series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.dataFields.categoryX = "연도";
        series3.dataFields.valueY = "조교";
        series3.name = "조교";
        series3.stacked = true;


        var series4 = chart.series.push(new am4charts.LineSeries());
        series4.dataFields.categoryX = "연도";
        series4.dataFields.valueY = "전임교원";
        series4.strokeWidth = 4;
        series4.name = "전임교수 꺾은선";


        // //색 변경
        // series3.columns.template.fill = am4core.color("#00ff00");
        // series2.columns.template.fill = am4core.color("#0000ff");
        // series1.columns.template.fill = am4core.color("#ff0000");
        // series4.stroke = am4core.color("#58641D");
    });
}