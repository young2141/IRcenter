function drawChart(data, value) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var container = am4core.create("chartdiv", am4core.Container);
        container.width = am4core.percent(80);
        container.height = am4core.percent(100);
        container.layout = "vertical";
        container.innerHeight = 0;
        // container.align = "center";
        // container.valign = "center";

        for (let i = 0, idx = 0; i < 3; ++i, idx += 10) {
            // for (let i = 0, idx = 0; i < majorNumberInChart.length; ++i, idx += 10) {
            let arr = data.slice(idx, idx + 10);
            let chart = container.createChild(am4charts.XYChart);
            chart.data = arr;
            
            //chart.contentAlign = "center";
            // var label = chart.chartContainer.createChild(am4core.Label);
            // label.text = majorInChart[i];
            // label.align = "left"

            let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "year";
            xAxis.renderer.labels.template.disabled = true;
                xAxis.renderer.grid.template.disabled = true;
            // if (i != majorNumberInChart.length - 1) {
            //     xAxis.renderer.labels.template.disabled = true;
            //     xAxis.renderer.grid.template.disabled = true;
            // }

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.renderer.labels.template.disabled = true;

            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = value;

            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            // labelBullet.label.fontSize = 12;
            // labelBullet.label.dx = 40;

            if (i == 0) {
                var lBullet = series.bullets.push(new am4charts.CircleBullet());
                // labelBullet.label.text = "{valueY}";
                 chart.dy = -13;
                 continue;
            }
                chart.dy = -45;
        }
        // var chart = am4core.create("chartdiv", am4charts.XYChart);
        // chart.data = data;

        // let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        // xAxis.dataFields.category = "year";

        // let yAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // let series = chart.series.push(new am4charts.ColumnSeries());
        // series.dataFields.categoryX = "year";
        // series.dataFields.valueY = "major";
        // // series.dataFields.valueY = getMappingNumberByMajor(major) + "_" + value;

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

        // for (let i = 0, cnt = 10; i < 1; i += cnt) {
        //     let major = data[cnt].major;
        //     addRange(major, getMappingNumberByMajor(major) + "_" + value, getMappingNumberByMajor(major) + "_" + value);
        // }

        // // addRange(data[0].major, data[0].major + "_2010_" + value, data[0].major + "_2019_" + value);


    }); // end am4core.ready()
}