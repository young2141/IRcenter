function parsing() {
    var filename = "doyeong_avgService.json";
    var job = ["행정직", "사서직", "기술직", "전산직", "전문경력관", "관리운영"];
    var cnt = 1;
    $.getJSON("../json/" + filename, (jsonData) => {
        for (var i = 0; i < jsonData.length; i++) {
            var keys = Object.keys(jsonData[i]["value"]);
            var data = [];
            for (var j = 0; j < keys.length; j++) {
                var temp = {
                    "category": keys[j] + "급",
                    "value": jsonData[i]["value"][keys[j]],
                    "href": "data:image/jpeg;base64,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"
                };
                data.push(temp);
            }
            draw(data, cnt++, job[i]);
        }
    })
}


function draw(_data, _cnt, _job) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        /**
         * Chart design taken from Samsung health app
         */

        var chart = am4core.create("chartdiv" + _cnt, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.paddingRight = 40;

        chart.data = _data;
        chart.data.sort((a, b) => {
            return a["value"] - b["value"];
        })

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.renderer.tooltip.dx = -40;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        var series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "value";
        series.dataFields.categoryY = "category";
        series.tooltipText = "2019년도 " + _job + "의 {category} 직원들 평균근속연수는 [bold]{value}[/]년 입니다.";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 30;
        series.columnsContainer.zIndex = 100;

        var columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
        series.mainContainer.mask = undefined;

        var cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        var bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 15;
        bullet.valign = "middle";
        bullet.align = "left";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        var hoverState = bullet.states.create("hover");
        var outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function (radius, target) {
            var circleBullet = target.parent;
            return circleBullet.circle.pixelRadius + 10;
        })

        var image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function (mask, target) {
            var circleBullet = target.parent;
            return circleBullet.circle;
        })

        var previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function (event) {
            var dataItem = series.tooltipDataItem;

            if (dataItem.column) {
                var bullet = dataItem.column.children.getIndex(1);

                if (previousBullet && previousBullet != bullet) {
                    previousBullet.isHover = false;
                }

                if (previousBullet != bullet) {

                    var hs = bullet.states.getKey("hover");
                    hs.properties.dx = dataItem.column.pixelWidth;
                    bullet.isHover = true;

                    previousBullet = bullet;
                }
            }
        })

    }); // end am4core.ready()
}

parsing();