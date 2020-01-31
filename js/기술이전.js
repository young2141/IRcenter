function parse(callback) {
    $.getJSON("../../../json/technology_transfer.json", json => {
        callback(json);
    });
}

function draw_graph(_gptype, _valueY, _width) {
    parse(json => {
        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv" + _gptype, am4charts.XYChart);
            chart.data = json

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

            if (_gptype == 1) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryX = "year";
                series.dataFields.valueY = _valueY; // 총 지원자 수
                series.columns.template.width = am4core.percent(_width);
                series.clustered = false;

                series.columns.template.strokeWidth = 0;
                // series.columns.template.stroke = am4core.color(_color); //색상
                // series.columns.template.fill = am4core.color(_color); // 색상
                // series.tooltip.getFillFromObject = false;
                series.columns.template.tooltipText = "{categoryX}학년도 기술이전 계약 건수는 [bold]{valueY}건[/]입니다.";
            }
            else {
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.categoryX = "year"
                series.dataFields.valueY = _valueY
                series.strokeWidth = 3;

                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.radius = 4;
                bullet.circle.strokeWidth = 3;
                /*
                series.heatRules.push({
                    target: bullet.circle,
                    min: 5,
                    max: 20,
                    property: "radius"
                });
                */

                bullet.tooltipText = "{categoryX}학년도 기술이전 수입료는 [bold]{valueY.formatNumber('#,###')}원[/]입니다.";
                chart.numberFormatter.numberFormat = '#,###'
                series.tooltip.label.adapter.add("text", function (text, target) {
                    if (target.dataItem) {
                        return target.dataItem.categoryX + "학년도 기술이전 수입료는 [bold]" + (target.dataItem.valueY * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원[/]입니다.";
                    }
                    else {
                        return "";
                    }
                });
            }

            //scrollbars
            /*
            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarY = new am4core.Scrollbar();
            */
        }); // end am4core.ready()
    })
}