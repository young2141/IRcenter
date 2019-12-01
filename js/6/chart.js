function drawChart(input, value) {
    // //처리 전 데이터
    // var preData = input.slice(0);
    // createCheckboxes(preData);
    // //chart에 적절한 데이터 값
    // var result = getDataForChart(preData)
    // var value = getWhichKey();

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add data
        chart.data = input;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "year";

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Add ranges
        // function addRange(label, start, end) {
        //     var range = yAxis.axisRanges.create();
        //     range.category = label;
        //     // range.value = start;
        //     // range.endValue = end;
        //     range.label.text = label;
        //     range.label.disabled = false;
        //     range.label.location = 0;
        //     range.label.dx = -130;
        //     range.label.dy = 12;
        //     //range.label.fontWeight = "bold";
        //     range.label.fontSize = 12;
        //     range.label.horizontalCenter = "left"
        //     range.label.inside = true;

        //     range.grid.stroke = am4core.color("#396478");
        //     range.grid.strokeOpacity = 1;
        //     range.grid.location = 1;
        //     range.tick.length = 200;
        //     range.tick.strokeOpacity = 0.6;
        //     range.tick.stroke = am4core.color("#396478");
        //     range.tick.location = 1;

        //     range.locations.category = 1;
        // }

        function createSeries(major, value) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = major + "_value;
        }

        for (let i = 0; i < majorInChart.length; ++i) {
            createSeries(majorInChart[i], value);
        }
    }); // end am4core.ready()
}