function drawChart(data, value) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;

        const size = 10;
        for (let i = 0; i < 1; ++i) {
            var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "year";

            var yAxis = chart.yAxes.push(new am4charts.ValueAxis());

            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = value;
        }
        // var chart = am4core.create("chartdiv", am4charts.XYChart);
        // chart.data = data;

        // var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        // xAxis.dataFields.category = "year";

        // var yAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // var series = chart.series.push(new am4charts.ColumnSeries());
        // series.dataFields.categoryX = "year";
        // series.dataFields.valueY = "major";

        // // Add ranges
        // function addRange(label, start, end) {
        //     var range = yAxis.axisRanges.create();
        //     range.value = start;
        //     range.endValue = end;
        //     range.label.text = label;
        //     // range.category = label;
        //     // range.value = start;
        //     // range.endValue = end;
        //     // range.label.text = label;
        //     range.label.disabled = false;
        //     range.label.location = 0;
        //     range.label.dx = -130;
        //     range.label.dy = 12;
        //     range.label.fontWeight = "bold";
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

        // addRange(data[0].major, data[0].major + "_2010_" + value, data[0].major + "_2019_" + value);

        // for (let i = 0, cnt = 10; i < majorInChart.length; i += cnt) {
        //     addRange(data[i].major, "2010_"+value, "2019_"+value);
        // }
    }); // end am4core.ready()
}