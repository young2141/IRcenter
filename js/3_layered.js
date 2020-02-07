var year;

function parsing2(_condition) {
    $.getJSON("../../json/3page_layerd_data.json", jsonData => {
        drawLayeredChart(jsonData);
    });
}

function drawLayeredChart(_data) {
    var typename = ["student", "nonsul", "normal", "farmfish", "jeongsi"];
    var typename_kr = ["학생부교과", "논술", "학생부종합 일반", "학생부종합 농어촌", "정시 일반"];
    var year = document.getElementById("years").value;
    //am4core.useTheme(am4themes_animated);

    var container = am4core.create("chartdiv2", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    function layerChart(_data, cond) {
        var chart = container.createChild(am4charts.XYChart);
        chart.width = am4core.percent(20);

        chart.data = _data;
        console.log(_data);
        var title = chart.titles.create();
        title.text = cond;
        title.fontSize = 17;
        title.dy = -10;
        title.textAlign = "middle";

        // Create axes : 가로축
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "grade";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.labels.template.disabled = true; //y축 space를 0으로 만듬
        valueAxis.max = 7000;
        valueAxis.min = 0;

        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = -90;

        function createSeries(_chart, value, ko, percent, rgb) {
            var series = _chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = value; // 총 지원자 수
            series.dataFields.categoryX = "grade";

            series.clustered = false;
 
            series.columns.template.stroke = am4core.color(rgb); // color
            series.columns.template.fill = am4core.color(rgb); // color
            //series.tooltip.getFillFromObject = false;
            if (ko == "지원인원") {
                series.columns.template.width = am4core.percent(80);
                series.columns.template.tooltipText = year + "학년도 " + cond + "전형 지원자는 {valueY}명 입니다.";
            }
            else if (ko == "기준점수 통과인원") {
                series.columns.template.width = am4core.percent(60);
                series.columns.template.tooltipText = year + "학년도 " + cond + "전형 최저기준 통과자는 {valueY}명 입니다.";
            }
            else {
                series.columns.template.width = am4core.percent(40);
                series.columns.template.tooltipText = year + "학년도 " + cond + "전형 입학자는 {valueY}명 입니다.";
            }

        }

        var values = ["apply", "pass", "admission"];
        var korean = ["지원인원", "기준점수 통과인원", "입학인원"];
        var RGB = ["#0054ff", "#32a600", "#ff1212"];
        for (var i = 0; i < 3; i++) {
            createSeries(chart, values[i], korean[i], 80 - i * 30, RGB[i]);
        }
    }

    for (var i = 0; i < 5; i++) {
        layerChart(_data[typename[i]], typename_kr[i]);
    }
}