function parse1(callback) {
    $.getJSON("../../../json/4-1.json", json => {
        callback(json);
    });
}
function parse2(callback) {
    $.getJSON("../../../json/4-2.json", json => {
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
        valueAxis.extraMax = 0.15;
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
            series.tooltip.label.textAlign = "middle";
            series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}년: {valueY}명";

            // Add label
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            // labelBullet.label.text = "{valueY}";
            labelBullet.label.fill = am4core.color("#fff");
            labelBullet.locationY = 0.5;

            return series;
        }

        createSeries("계약직", "계약직");
        createSeries("교육전문직", "교육전문직");
        createSeries("대학회계직", "대학회계직");
        createSeries("기능직", "기능직");
        createSeries("별정직", "별정직");
        createSeries("기술직", "기술직");
        createSeries("일반직", "일반직");

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

    parse1(json => {
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
    parse2(json => {
        data = [];
        yearly_data = {};
        year = document.getElementById('span1').innerHTML;
        for (var key in json[year]) {
            yearly_data[key] = json[year][key][sex];
        }
        data.push(yearly_data);
        console.log(data);
        Piechart(data);
    });
}

function Piechart(data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv2", am4charts.PieChart);

        console.log(data);
        dummyData = [];
        // data1 = {};
        for (var key in data[0]) {
            if (key == "일반직") {
                dummyData.push({ name: "일반직", field: data[0][key] });
            }
            else if (key == "기술직") {
                dummyData.push({ name: "기술직", field: data[0][key] });
            }
            else if (key == "별정직") {
                dummyData.push({ name: "별정직", field: data[0][key] });
            }
            else if (key == "기능직") {
                dummyData.push({ name: "기능직", field: data[0][key] });
            }
            else if (key == "대학회계직") {
                dummyData.push({ name: "대학회계직", field: data[0][key] });
            }
            else if (key == "교육전문직") {
                dummyData.push({ name: "교육전문직", field: data[0][key] });
            }
            else if (key == "계약직") {
                dummyData.push({ name: "계약직", field: data[0][key] });
            }
        }
        // console.log(json);
        console.log(dummyData);

        // Add data
        chart.data = dummyData;

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "field";
        pieSeries.dataFields.category = "name";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.colors.list = [
            am4core.color("#dc67ce"),
            am4core.color("#c767dc"),
            am4core.color("#a367dc"),
            am4core.color("#8067dc"),
            am4core.color("#6771dc"),
            am4core.color("#6794dc"),
            am4core.color("#67b7dc"),
        ];

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;

    }); // end am4core.ready()

}