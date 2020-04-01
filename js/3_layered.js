var year;

function parsing2(_condition) {
    $.getJSON("../../json/3page_layerd_data.json", jsonData => {
        for (var i = 0; i < 5; i++) {
            drawLayeredChart(jsonData, i);
        }
    });
}

function drawLayeredChart(_data, i) {
    var typename = ["student", "nonsul", "normal", "farmfish", "jeongsi"];
    var typename_kr = ["학생부교과", "논술", "학생부종합 일반", "학생부종합 농어촌", "정시 일반"];
    var year = document.getElementById("years").value;
    //am4core.useTheme(am4themes_animated);

    // container.layout = "grid";
    // container.fixedWidthGrid = false;

    function layerChart(_data, cond) {
        var chart = am4core.create("chartdiv" + (2 + i), am4charts.XYChart);
        // chart.width = am4core.percent(20);

        chart.data = _data;
        console.log(_data);
        var title = chart.titles.create();
        title.text = cond;
        title.fontSize = 15;
        if (i == 0)
            title.dx = 32
        title.dy = -10;
        title.textAlign = "middle";

        // Create axes : 가로축
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "grade";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 25;

        // 세로축
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        if (i != 0) valueAxis.renderer.labels.template.disabled = true
        //valueAxis.renderer.labels.template.fillOpacity = 0; //y축 space를 0으로 만듬
        valueAxis.max = 8000;
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

            series.tooltip.pointerOrientation = i < 3 ? "left" : "right"
        }

        var values = ["apply", "pass", "admission"];
        var korean = ["지원인원", "기준점수 통과인원", "입학인원"];
        var RGB = ["#0054ff", "#32a600", "#ff1212"];
        for (var j = 0; j < 3; j++) {
            createSeries(chart, values[j], korean[j], 80 - j * 30, RGB[j]);
        }
    }

    layerChart(_data[typename[i]], typename_kr[i]);
}