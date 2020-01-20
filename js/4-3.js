function parse(callback) {
    $.getJSON("../../../json/4-3.json", json => {
        callback(json);
    });
}
function stackGraph(data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // am4core.useTheme(am4themes_dataviz);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);
        chart.maskBullets = false;
        chart.numberFormatter.numberFormat = "#.#";

        // Add data
        chart.data = data;
        // console.log(chart.data);

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 40;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.1;
        valueAxis.calculateTotals = true;

        // Create series
        function createSeries(field, name) {

            // Set up series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.name = name;
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "year";
            series.sequencedInterpolation = true;

            // Make it stacked
            series.stacked = true;

            // Configure columns
            series.columns.template.width = am4core.percent(60);
            series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";

            // Add label
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            // labelBullet.label.text = "{valueY}";
            labelBullet.label.fill = am4core.color("#fff");
            labelBullet.locationY = 0.5;

            return series;
        }
        createSeries("부설학교", "부설학교");
        createSeries("부속시설", "부속시설");
        createSeries("지원 및 연구시설", "지원 및 연구시설");
        createSeries("교육기본시설", "교육기본시설");
        createSeries("대학(원)", "대학(원)");
        createSeries("행정지원부", "행정지원부");
        createSeries("본부", "본부");

        // Create series for total
        var totalSeries = chart.series.push(new am4charts.ColumnSeries());
        totalSeries.dataFields.valueY = "none";
        totalSeries.dataFields.categoryX = "year";
        totalSeries.stacked = true;
        totalSeries.hiddenInLegend = true;
        totalSeries.columns.template.strokeOpacity = 0;

        var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
        totalBullet.dy = -20;
        totalBullet.label.text = "{valueY.total}";
        totalBullet.label.hideOversized = false;
        totalBullet.label.fontSize = 16;
        // totalBullet.label.background.fill = totalSeries.stroke;
        totalBullet.label.background.fillOpacity = 0.2;
        totalBullet.label.padding(5, 10, 5, 10);
    })
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
                else if (key == "none") yearly_data[key] = json[i][key];
                else yearly_data[key] = json[i][key][sex];
            }
            data.push(yearly_data);
            // console.log(yearly_data);
        }
        stackGraph(data);
    });
}