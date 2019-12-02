function getDxSize() {
    let len = majorInChart.length;
    if (len >= 15) {
        return 0;
    } else if (len >= 10) {
        return -50;
    }
}

function drawChart(data, value) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var container = am4core.create("chartdiv", am4core.Container);
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);
        container.layout = "vertical";
        container.autoMargins = false;

        // for (let i = 0, idx = 0; i < 20; ++i, idx += 10) {
        //     // console.log(container.innerHeight);
        for (let i = 0, idx = 0; i < majorInChart.length; ++i, idx += 10) {

            let arr = data.slice(idx, idx + 10);
            let chart = container.createChild(am4charts.XYChart);
            chart.data = arr;
            chart.width = am4core.percent(100);
            chart.height = am4core.percent(100/majorInChart.length);
            chart.paddingLeft = 120;
            chart.autoMargins = false;
            

            // s

            let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "year";
            xAxis.renderer.grid.template.disabled = true;
            xAxis.renderer.minGridDistance = 1;

            if (i != majorInChart.length - 1) {
                xAxis.renderer.labels.template.disabled = true;
                xAxis.renderer.labels.template.align = "center";
                xAxis.renderer.labels.template.vAlign = "bottom";
                xAxis.renderer.labels.template.fontWeight = "bold";
            }

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.renderer.labels.template.disabled = true;
            yAxis.renderer.labels.template.location = 0;
            
            yAxis.title.text = arr[0].major;
            yAxis.title.align = "center";
            yAxis.title.valign = "middle";
            yAxis.title.rotation = 0;
            yAxis.title.paddingRight = 20;
            yAxis.title.maxWidth = 120;
            yAxis.title.wrap = true;
            yAxis.title.width = 120;
            yAxis.title.strokeWidth = 2;

            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = value;
            series.columns.template.tooltipText = "전공: {major}\n연도: {categoryX}\n인원 수: {valueY}";
            // series.columns.template.fill = am4core.color("#0000f0");

            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.label.fondSize = 8;
            labelBullet.label.wrap = true;
            labelBullet.label.dy = -7;
        }
    }); // end am4core.ready()
}