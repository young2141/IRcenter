function parsing() {
    var filename = "doyeong_graduation_and_enter.json";
    var gender = $('input[name="성별"]:checked').val();
    gender = gender.toLowerCase();

    $.getJSON("../../../json/" + filename, jsonData => {
        var dataColumn = [];
        var dataLine = [];

        for (var i = 0; i < jsonData.length; i++) {
            dataColumn.push({
                "category": jsonData[i]["category"],
                "value": jsonData[i]["enter_number_" + gender]
            });

            dataLine.push({
                "category": jsonData[i]["category"],
                "value": jsonData[i]["enter_percentage_" + gender]
            })
        }
        console.log(dataColumn, dataLine);
        drawColumn(dataColumn);
        drawLine(dataLine);
    })
}

function drawColumn(_data) {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        // Add data
        chart.data = _data;

        // Create axes

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
            if (target.dataItem && target.dataItem.index & 2 == 2) {
                return dy + 25;
            }
            return dy;
        });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;

    }); // end am4core.ready()
}

function drawLine(_data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv2", am4charts.XYChart);
        chart.data = _data;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.dataFields.category = "category";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";
        series.tooltipText = "{value}"

        series.tooltip.pointerOrientation = "vertical";

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 15;
        bullet.fill = am4core.color("#fff");
        bullet.tooltipText = "[#000]{category}학년도 진학률 : [bold]{value}%[/]";

    }); // end am4core.ready()
}