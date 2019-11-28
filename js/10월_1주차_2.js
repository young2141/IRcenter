/**
 * chartdiv1
 * chartdiv2-1 ~ 2-7
 */

function iter(years, callback) { // years는 string 타입
    var data1 = []; // 막대그래프용 데이터
    var data2 = []; // 파이그래프용 데이터
    for (var i = 2013; i <= 2019; i++) {
        if (years.indexOf(String(i)) == -1) continue;
        filename = "10월_1주차_2_" + String(i) + ".json";
        doParsing(i, filename, (temp1, temp2) => {
            data1 = data1.concat(temp1);
            data2.push(temp2);
            if (data1.length == years.length * 5 && data2.length == years.length) {
                data1.sort((a, b) => { return a.year < b.year ? -1 : a.year > b.year ? 1 : 0 });
                data2.sort((a, b) => { return a.year < b.year ? -1 : a.year > b.year ? 1 : 0 });
                console.log(data1, data2);
                callback(data1, data2);
            }
        })
    }
}

function doParsing(year, filename, callback) {
    $.getJSON('../json/' + filename, (jsonData) => {
        keys = Object.keys(jsonData)
        var tempArr1 = []
        var tempArr2 = { "year": String(year), "values": [] }
        var color;
        for (var i = Object.keys(jsonData).length - 1; i >= 0; i--) {
            var temp1 = {
                "year": String(year),
                "category": String(year) + "년 " + String(keys[i]),
                "value": jsonData[keys[i]],
                "color": 4 - i
            };

            var temp2 = {
                "category": String(keys[i]),
                "value": jsonData[keys[i]],
                "color": i
            };

            tempArr1.push(temp1);
            tempArr2["values"].push(temp2);
        }
        callback(tempArr1, tempArr2);
    })
}

function drawXYChart(_divName, _data) {
    var chart = am4core.create(_divName, am4charts.XYChart);
    chart.data = _data;

    // Add data

    // Create axes
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "category";
    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;

    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "category";
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeWidth = 0;
    // 색 정할때 여기 유의깊게 봐야겠다....
    series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.dataContext.color);
    });

    // Add ranges
    function addRange(label, start, end, color) {
        var range = yAxis.axisRanges.create();
        range.category = start;
        range.endCategory = end;
        range.label.text = label;
        range.label.disabled = false;
        range.label.fill = color;
        range.label.location = 0;
        range.label.dx = -130;
        range.label.dy = 12;
        range.label.fontWeight = "bold";
        range.label.fontSize = 12;
        range.label.horizontalCenter = "left"
        range.label.inside = true;

        range.grid.stroke = am4core.color("#396478");
        range.grid.strokeOpacity = 1;
        range.tick.length = 200;
        range.tick.disabled = false;
        range.tick.strokeOpacity = 0.6;
        range.tick.stroke = am4core.color("#396478");
        range.tick.location = 0;

        range.locations.category = 1;
    }
    for (var y = 2013; y <= 2019; y++) {
        var str = String(y) + "년 ";
        addRange(String(y), str + "일반고", str + "기타", chart.colors.getIndex(y - 2013));
    }
    chart.cursor = new am4charts.XYCursor();
}

function drawPieChart(_divName, _year, _data) {
    var chart = am4core.create(_divName, am4charts.PieChart);
    for (var i = 0; i < _data.length; i++) {
        if (_data[i].year == _year) {
            chart.data = _data[i].values
            break;
        }
    }
    var title = chart.titles.create()
    title.text = _year + "년"

    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "category";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;


    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    // pieSeries.colors.list = [
    //     am4core.color("#845EC2"),
    //     am4core.color("#D65DB1"),
    //     am4core.color("#FF6F91"),
    //     am4core.color("#FF9671"),
    //     am4core.color("#FFC75F"),
    //     am4core.color("#F9F871"),
    // ];
}
function draw(years) {
    iter(years, (_data1, _data2) => {
        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            am4core.useTheme(am4themes_material);
            // Themes end
            drawXYChart("chartdiv1", _data1);
            var i = 0;
            for (; i < years.length; i++) {
                name = "chartdiv2-" + String(i + 1);
                drawPieChart(name, years[i], _data2)
            }
            for (; i < 7; i++) {
                name = "chartdiv2-" + String(i + 1) // 빈칸 삭제
                $("#" + name).empty();
            }

        });
    })
}

function call() {
    var values = [];
    $('input[name="년도"]:checkbox:checked').each(function () {
        values.push($(this).val());
    });
    draw(values);
}