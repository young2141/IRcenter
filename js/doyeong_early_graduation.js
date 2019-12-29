function parsing() {
    var year = parseInt($("#years").val());

    var filename = "doyeong_early_graduation.json";
    $.getJSON("../../../json/" + filename, (jsonData) => {
        var cnt = 0;
        while (cnt < 5) {
            var data = [];
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i]["category"] == String(year)) {
                    data = [
                        {
                            "category": "조기졸업자",
                            "value": jsonData[i]["early_graduation"]
                        },
                        {
                            "category": "복수전공자",
                            "value": jsonData[i]["multiple_major"]
                        },
                        {
                            "category": "부전공자",
                            "value": jsonData[i]["sub_major"]
                        }
                    ];
                    draw(data, 5 - cnt, year--)
                    cnt++;
                    break;
                }
            }
        }
    })
}

function draw(_data, _N, _year) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        console.log(_data, _N);
        var chart = am4core.create("chartdiv" + String(_N), am4charts.XYChart);

        // Add data
        chart.data = _data;

        // Create axes

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        // categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
        //     if (target.dataItem && target.dataItem.index & 2 == 2) {
        //         return dy + 2;
        //     }
        //     return dy;
        // });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 800;

        if (_N >= 2) valueAxis.renderer.labels.template.fillOpacity = 0;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
            if (target.dataItem && target.dataItem.index & 2 == 2) {
                return dy + 25;
            }
            return dy;
        });

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;

        var title = chart.titles.create();
        title.fontSize = 15;
        title.text = String(_year) + "학년도";
        title.dx = 0;
        title.dy = 0;
    });
}