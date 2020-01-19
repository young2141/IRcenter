function parsing() {
    var filename = "doyeong_avgService.json";
    var year = "2019";
    var job = ["행정직", "사서직", "기술직", "전산직", "전문경력관", "관리운영"];
    $.getJSON("../json/" + filename, (jsonData) => {
        var num = 0;
        for (var i = 0; i < jsonData.length; i++) {
            //if (jsonData[i]["category"] == job) {
            var keys = Object.keys(jsonData[i]["value"]);
            var data = [];
            for (var j = 0; j < keys.length; j++) {
                data.push({
                    "category": keys[j] + "급",
                    "value": jsonData[i]["value"][keys[j]],
                    "full": 40
                })
            }
            draw(num + 1, data, year, job[num++]);
            //}
        }
    })
}

function draw(_num, _data, _year, _job) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv" + String(_num), am4charts.RadarChart);

        // Add data
        chart.data = _data;
        chart.data.sort((a, b) => {
            return a["value"] - b["value"];
        }); // 근속연수가 높은 급수를 위로 올리기!
        // Make chart not full circle
        chart.startAngle = -90;
        chart.endAngle = 180;
        chart.innerRadius = am4core.percent(20);

        // Set number format
        //chart.numberFormatter.numberFormat = "#년";

        // Create axes
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.fontWeight = 500;
        categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
            return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
        });
        categoryAxis.renderer.minGridDistance = 10;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.max = 40;
        valueAxis.strictMinMax = true;

        // Create series
        var series1 = chart.series.push(new am4charts.RadarColumnSeries());
        series1.dataFields.valueX = "full";
        series1.dataFields.categoryY = "category";
        series1.clustered = false;
        series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        series1.columns.template.fillOpacity = 0.08;
        series1.columns.template.cornerRadiusTopLeft = 20;
        series1.columns.template.strokeWidth = 0;
        series1.columns.template.radarColumn.cornerRadius = 20;

        var series2 = chart.series.push(new am4charts.RadarColumnSeries());
        series2.dataFields.valueX = "value";
        series2.dataFields.categoryY = "category";
        series2.clustered = false;
        series2.columns.template.strokeWidth = 0;
        series2.columns.template.tooltipText = _year + "년도 " + _job + "의 {category} 직원들 평균근속연수는 [bold]{value}[/]년 입니다.";
        series2.columns.template.radarColumn.cornerRadius = 20;

        series2.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Add cursor
        //chart.cursor = new am4charts.RadarCursor();

    }); // end am4core.ready()
}

parsing();