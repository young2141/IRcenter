function parsing() {
    var year = document.getElementById("years").value;
    var type = $('input:radio[name=학위]:checked').val();
    var gender = $('#gender option:selected').val();
    var filename = "4_" + year + "_degree.json";
    var college = $('#college option:selected').val();

    $.getJSON("../../json/" + filename, (jsonData) => {
        var data = [];
        for (var i = 0; i < jsonData.length; i++) {
            if (college != "all" && college != jsonData[i]["college"])
                continue;
            temp = {};
            temp["dumy"] = "dumy";
            temp["category"] = jsonData[i]["major"];
            temp["value"] = jsonData[i][type + "_" + gender];
            data.push(temp);
        }
        data.sort((a, b) => {
            return a.value > b.value ? -1 : a.value < b.value ? 1 : 0;
        });
        data = data.slice(0, 20);
        data.reverse();
        drawHorizontalChart(data);
    })
}

function drawHorizontalChart(_data) {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = _data;
        console.log(_data);

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
        series.columns.template.adapter.add("fill", function (fill, target) {
            if (target.dataItem) {
                switch (target.dataItem.dataContext.region) {
                    case "Central":
                        return chart.colors.getIndex(0);
                        break;
                    case "East":
                        return chart.colors.getIndex(1);
                        break;
                    case "South":
                        return chart.colors.getIndex(2);
                        break;
                    case "West":
                        return chart.colors.getIndex(3);
                        break;
                }
            }
            return fill;
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

        // addRange("dumy", "Texas", "North Dakota", chart.colors.getIndex(0));
        // addRange("East", "New York", "West Virginia", chart.colors.getIndex(1));
        // addRange("South", "Florida", "South Carolina", chart.colors.getIndex(2));
        // addRange("West", "California", "Wyoming", chart.colors.getIndex(3));
    });
}