function parse(callback) {
    $.getJSON("../../../json/4-3.json", json => {
        callback(json);
    });
}
function stackGraph(data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        console.log(data);
        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        chart.data = data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 40;
        categoryAxis.fontSize = 11;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 800;
        valueAxis.strictMinMax = true;
        valueAxis.renderer.minGridDistance = 30;

        // Create series

        // series1
        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.name = "부설학교";
        series1.dataFields.valueY = "부설학교";
        series1.dataFields.categoryX = "year";
        series1.sequencedInterpolation = true;
        series1.stacked = true;
        series1.columns.template.width = am4core.percent(60);
        series1.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet1 = series1.bullets.push(new am4charts.LabelBullet());
        labelBullet1.label.text = "{valueY}";
        labelBullet1.locationY = 0.5;

        // series2
        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.name = "부속시설";
        series2.dataFields.valueY = "부속시설";
        series2.dataFields.categoryX = "year";
        series2.sequencedInterpolation = true;
        series2.stacked = true;
        series2.columns.template.width = am4core.percent(60);
        series2.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet2 = series2.bullets.push(new am4charts.LabelBullet());
        labelBullet2.label.text = "{valueY}";
        labelBullet2.locationY = 0.5;

        // series3
        var series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.name = "지원 및 연구시설";
        series3.dataFields.valueY = "지원 및 연구시설";
        series3.dataFields.categoryX = "year";
        series3.sequencedInterpolation = true;
        series3.stacked = true;
        series3.columns.template.width = am4core.percent(60);
        series3.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet3 = series3.bullets.push(new am4charts.LabelBullet());
        labelBullet3.label.text = "{valueY}";
        labelBullet3.locationY = 0.5;

        // series4
        var series4 = chart.series.push(new am4charts.ColumnSeries());
        series4.name = "교육기본시설";
        series4.dataFields.valueY = "교육기본시설";
        series4.dataFields.categoryX = "year";
        series4.sequencedInterpolation = true;
        series4.stacked = true;
        series4.columns.template.width = am4core.percent(60);
        series4.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet4 = series4.bullets.push(new am4charts.LabelBullet());
        labelBullet4.label.text = "{valueY}";
        labelBullet4.locationY = 0.5;

        // series5
        var series5 = chart.series.push(new am4charts.ColumnSeries());
        series5.name = "대학(원)";
        series5.dataFields.valueY = "대학(원)";
        series5.dataFields.categoryX = "year";
        series5.sequencedInterpolation = true;
        series5.stacked = true;
        series5.columns.template.width = am4core.percent(60);
        series5.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet5 = series5.bullets.push(new am4charts.LabelBullet());
        labelBullet5.label.text = "{valueY}";
        labelBullet5.locationY = 0.5;

        // series6
        var series6 = chart.series.push(new am4charts.ColumnSeries());
        series6.name = "행정지원부";
        series6.dataFields.valueY = "행정지원부";
        series6.dataFields.categoryX = "year";
        series6.sequencedInterpolation = true;
        series6.stacked = true;
        series6.columns.template.width = am4core.percent(60);
        series6.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet6 = series6.bullets.push(new am4charts.LabelBullet());
        labelBullet6.label.text = "{valueY}";
        labelBullet6.locationY = 0.5;

        // series7
        var series7 = chart.series.push(new am4charts.ColumnSeries());
        series7.name = "본부";
        series7.dataFields.valueY = "본부";
        series7.dataFields.categoryX = "year";
        series7.sequencedInterpolation = true;
        series7.stacked = true;
        series7.columns.template.width = am4core.percent(60);
        series7.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";
        var labelBullet7 = series7.bullets.push(new am4charts.LabelBullet());
        labelBullet7.label.text = "{valueY}";
        labelBullet7.locationY = 0.5;
    }); // end am4core.ready()
}

function call() {
    var Select = document.getElementById("sex_selectbar");
    var sex = Select.options[Select.selectedIndex].value;

    parse(json => {
        data = [];
        for (var i = 0; i < json.length; i++) {
            yearly_data = {};
            for (var key in json[i]) {
                if (key == "year") yearly_data["year"] = json[i]["year"];
                else yearly_data[key] = json[i][key][sex];
            }
            data.push(yearly_data);
            console.log(yearly_data);
        }
        stackGraph(data);
    });
}