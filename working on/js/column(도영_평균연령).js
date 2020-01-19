function parsing() {
    var filename = "doyeong_avgAge.json";
    var year = "2019";
    var job = ["행정직", "사서직", "기술직", "전산직", "전문경력관", "관리운영", "대학회계직"];
    $.getJSON("../json/" + filename, (jsonData) => {
        var num = 0;
        for (var i = 0; i < jsonData.length; i++) {
            //if (jsonData[i]["category"] == job) {
            var keys = Object.keys(jsonData[i]["value"]);
            var data = [];
            for (var j = 0; j < keys.length; j++) {
                var temp = {};
                temp["category"] = keys[j];
                if (jsonData[i]["category"] != "대학회계직") temp["category"] += "급";
                temp["value"] = jsonData[i]["value"][keys[j]];
                data.push(temp);
            }
            draw(num + 1, data, year, job[num++]);
            // }
        }
    })
}

function draw(_num, _data, _year, _job) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv" + String(_num), am4charts.XYChart);

        // Add data
        chart.data = _data;
        chart.data.sort((a, b) => {
            return a["value"] - b["value"];
        }); // 데이터 정렬...높은 고위직일수록 평균연령이 높을테니 category값은 무시하고 value값만을 기준으로 내림차순 정렬

        // Create axes

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 25;
        valueAxis.max = 65;
        valueAxis.strictMinMax = true; // 강제로 min, max값 적용시키기! default는 false


        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = "value";
        series.dataFields.categoryY = "category";


        series.columns.template.tooltipText = _year + "년 " + _job + "의 {categoryY} 근무자 평균연령은 [bold]{valueX}[/]세 입니다.";
        series.columns.template.fillOpacity = .8;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;

    }); // end am4core.ready()
}
parsing();