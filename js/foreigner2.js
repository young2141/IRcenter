function drawChart() {
    remove();
    if ($(":input:radio[name=Gtype]:checked").attr('id') == 'stacked')
        stackedAreaChart()
    else
        multiplesAreaChart()

}
function remove() {
    var chartdiv1 = document.getElementById('chartdiv1');
    var chartdiv2 = document.getElementById('chartdiv2');
    var chartdiv3 = document.getElementById('chartdiv3');
    var chartdiv4 = document.getElementById('chartdiv4');
    var chartdiv5 = document.getElementById('chartdiv5');

    chartdiv1.innerHTML = "";
    chartdiv2.innerHTML = "";
    chartdiv3.innerHTML = "";
    chartdiv4.innerHTML = "";
    chartdiv5.innerHTML = "";
    

}
function stackedAreaChart() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        jQuery.getJSON("../../../json/foreigner2.json", json => {
            chartele(json);
        });
        function chartele(json) {
            chart.data = json;
        }

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.labels.template.location = 0.46;
        dateAxis.renderer.minLabelPosition = -0.5;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMax = 0.15;

        var span_legend = document.getElementsByName("span_legend");

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "year";
        series.name = "비전임교원";
        series.dataFields.valueY = "비전임교원";
        series.fillOpacity = 1;
        series.fill = am4core.color(span_legend[3].style.color);
        series.stroke = am4core.color(span_legend[3].style.color)
        series.strokeWidth = 6;
        series.stacked = true;

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.name = "조교수";
        series2.dataFields.dateX = "year";
        series2.dataFields.valueY = "조교수";
        series2.sequencedInterpolation = true;
        series2.fillOpacity = 1;
        series2.fill = am4core.color(span_legend[2].style.color);
        series2.strokeWidth = 0;
        series2.stacked = true;

        var series3 = chart.series.push(new am4charts.LineSeries());
        series3.name = "부교수";
        series3.dataFields.dateX = "year";
        series3.dataFields.valueY = "부교수";
        series3.sequencedInterpolation = true;
        series3.fillOpacity = 1;
        series3.fill = am4core.color(span_legend[1].style.color);
        series3.strokeWidth = 0;
        series3.defaultState.transitionDuration = 1000;
        series3.stacked = true;

        var series4 = chart.series.push(new am4charts.LineSeries());
        series4.name = "교수";
        series4.dataFields.dateX = "year";
        series4.dataFields.valueY = "교수";
        series4.sequencedInterpolation = true;
        series4.fillOpacity = 1;
        series4.fill = am4core.color(span_legend[0].style.color);
        series4.strokeWidth = 0;
        series4.defaultState.transitionDuration = 1000;
        series4.stacked = true;
    }); // end am4core.ready()

}
function multiplesAreaChart() {
    //111111111111111111111111111111
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv2", am4charts.XYChart);

        jQuery.getJSON("../../../json/foreigner2.json", json => {
            chartele(json);
        });
        function chartele(json) {
            chart.data = json;
        }

        var span_legend = document.getElementsByName("span_legend");

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.labels.template.location = 0.46;
        dateAxis.renderer.minLabelPosition = -0.5;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.max = 60;
        valueAxis.extraMax = 0.15;
        valueAxis.renderer.minGridDistance = 30;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "year";
        series.name = "교수";
        series.dataFields.valueY = "교수";
        series.tooltipHTML = "<span style='font-size:14px; color:#000000;'><b>{name}</b>: {valueY.value}명</span>";
        series.tooltipText = "[#000]{valueY.value}[/]";
        series.tooltip.background.fill = am4core.color(span_legend[0].style.color);
        // series.tooltip.stroke = am4core.color("FF0000")
        series.tooltip.background.strokeWidth = 1;
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.stroke = am4core.color("#000000");
        series.tooltip.getFillFromObject = true;
        series.fillOpacity = 1;
        series.fill = am4core.color(span_legend[0].style.color);
        series.stroke = am4core.color(span_legend[0].style.color);
        series.strokeWidth = 3;
        series.stacked = true;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        // chart.cursor.lineX.strokeDasharray = "";

        chart.cursor.lineY.disabled = true;

    }); // end am4core.ready()
    //2222222222222222222222222222222222222222222
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv3", am4charts.XYChart);

        jQuery.getJSON("../../../json/foreigner2.json", json => {
            chartele(json);
        });
        function chartele(json) {
            chart.data = json;
        }

        var span_legend = document.getElementsByName("span_legend");

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.labels.template.location = 0.46;
        dateAxis.renderer.minLabelPosition = -0.5;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.max = 60;
        valueAxis.extraMax = 0.15;
        valueAxis.renderer.minGridDistance = 30;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "year";
        series.name = "부교수";
        series.dataFields.valueY = "부교수";
        series.tooltipHTML = "<span style='font-size:14px; color:#000000;'><b>{name}</b>: {valueY.value}명</span>";
        series.tooltipText = "[#000]{valueY.value}[/]";
        series.tooltip.background.fill = am4core.color(span_legend[1].style.color);
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.background.strokeWidth = 1;
        series.tooltip.getFillFromObject = true;
        series.fillOpacity = 1;
        series.fill = am4core.color(span_legend[1].style.color);
        series.strokeWidth = 0;
        series.stacked = true;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineY.disabled = true;

    }); // end am4core.ready()
    //3333333333333333333333333333333333333333333333
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv4", am4charts.XYChart);

        jQuery.getJSON("../../../json/foreigner2.json", json => {
            chartele(json);
        });
        function chartele(json) {
            chart.data = json;
        }

        var span_legend = document.getElementsByName("span_legend");

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.labels.template.location = 0.46;
        dateAxis.renderer.minLabelPosition = -0.5;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.max = 60;
        valueAxis.extraMax = 0.15;
        valueAxis.renderer.minGridDistance = 30;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "year";
        series.name = "조교수";
        series.dataFields.valueY = "조교수";
        series.tooltipHTML = "<span style='font-size:14px; color:#ffffff;'><b>{name}</b>: {valueY.value}명</span>";
        series.tooltipText = "[#000]{valueY.value}[/]";
        series.tooltip.background.fill = am4core.color(span_legend[2].style.color);
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.background.strokeWidth = 1;
        series.tooltip.getFillFromObject = true;
        series.fillOpacity = 1;
        series.fill = am4core.color(span_legend[2].style.color);
        series.strokeWidth = 0;
        series.stacked = true;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineY.disabled = true;

    }); // end am4core.ready()
    //44444444444444444444444444444444444444444444
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv5", am4charts.XYChart);

        jQuery.getJSON("../../../json/foreigner2.json", json => {
            chartele(json);
        });
        function chartele(json) {
            chart.data = json;
        }

        var span_legend = document.getElementsByName("span_legend");

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.labels.template.location = 0.46;
        dateAxis.renderer.minLabelPosition = -0.5;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.max = 60;
        valueAxis.extraMax = 0.15;
        valueAxis.renderer.minGridDistance = 30;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "year";
        series.name = "비전임교원";
        series.dataFields.valueY = "비전임교원";
        series.tooltipHTML = "<span style='font-size:14px; color:#ffffff;'><b>{name}</b>: {valueY.value}명</span>";
        series.tooltipText = "[#000]{valueY.value}[/]";
        series.tooltip.background.fill = am4core.color(span_legend[3].style.color);
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.background.strokeWidth = 1;
        series.tooltip.getFillFromObject = true;
        series.fillOpacity = 1;
        series.fill = am4core.color(span_legend[3].style.color);
        series.strokeWidth = 0;
        series.stacked = true;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineY.disabled = true;
        // chart.cursor.fullWidthLineX = true;
        
    }); // end am4core.ready()
}