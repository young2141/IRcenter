function parse(callback) {
    $.getJSON("../../../json/patent.json", json => {
        callback(json);
    });
}
		
function draw_graph(_valueY) {
    parse(json => {
        am4core.ready(function () {
            // Themes begin
            am4core.disposeAllCharts()
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart);
            chart.data = []

            for (var i = 0; i < json.length; i++) {
                jdata = new Object()
                jdata["year"] = json[i].year
                jdata["apply"] = json[i][_valueY].apply
                jdata["registration"] = json[i][_valueY].registration
                chart.data.push(jdata)
            }

            /*
            var max_value = 0, min_value = 10000
            for (var i = 0; i < json.length; i++) {
                if (json[i][_type] > max_value)
                    max_value = json[i][_type]

                if (json[i][_type] < min_value)
                    min_value = json[i][_type]
            }
            */

            //x-axis for chart
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            // categoryAxis.title.text = "연도"
            // categoryAxis.renderer.grid.template.disabled = true;
            // categoryAxis.dy = 10;
            // categoryAxis.width = am4core.percent(90);

            //y-axis for chart
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.15;
            valueAxis.strictMinMax = false;
            valueAxis.strictMatrix = true;
            // valueAxis.min = min_value - (max_value - min_value) * 0.1
            // valueAxis.max = max_value + (max_value - min_value) * 0.1
            // valueAxis.renderer.inside = true;
            // valueAxis.renderer.inversed = true;
            // valueAxis.renderer.grid.template.disabled = true;
            // valueAxis.renderer.baseGrid.disabled = true;
            // valueAxis.renderer.labels.template.disabled = true;
            // valueAxis.renderer.minGridDistance = 15;

            function createSeries(_valueY1, _color, _width) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryX = "year";
                series.dataFields.valueY = _valueY1; // 총 지원자 수
                series.columns.template.width = am4core.percent(_width);
                series.clustered = false;

                series.columns.template.strokeWidth = 0;
                series.columns.template.stroke = am4core.color(_color); //색상
                series.columns.template.fill = am4core.color(_color); // 색상
                // series.tooltip.getFillFromObject = false;

                str_temp = ""
                if (_valueY == "domestic")
                    str_temp += "국내 특허"
                else
                    str_temp += "해외 특허"

                if (_valueY1 == "apply") {
                    str_temp += "출원 건수"
                    series.columns.template.tooltipY = am4core.percent(10)
                }
                else {
                    str_temp += "등록 건수"
                    series.columns.template.tooltipY = am4core.percent(90)
                }

                series.columns.template.tooltipText = "{categoryX}학년도 " + str_temp + "는 [bold]{valueY}건[/]입니다.";
            }

            createSeries("apply", chart.colors.getIndex(0), 70)
            createSeries("registration", chart.colors.getIndex(9), 40)
            //scrollbars
            /*
            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarY = new am4core.Scrollbar();
            */
        }); // end am4core.ready()
    })
}