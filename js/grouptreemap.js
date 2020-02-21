function  changegraph(brand) {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/grouptreemap.json", json => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // create chart
            var chart = am4core.create("chartdiv3", am4charts.TreeMap);
            chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

            var data = json;
            var treeData = [];
            var brand = document.getElementById('span1').innerHTML;
            var brandData = { name: brand, children: [] }
            var brandTotal = 0;
            for (var model in data[brand]) {
                brandTotal += data[brand][model];
            }
            // console.log(brandTotal);
            for (var model in data[brand]) {
                if (model == "학술")
                    brandData.children.push({ name: model, count: data[brand][model], color: "#dc67ce", per: (data[brand][model] / brandTotal * 100).toFixed(1) });
                else if (model == "취미")
                    brandData.children.push({ name: model, count: data[brand][model], color: "#8067dc", per: (data[brand][model] / brandTotal * 100).toFixed(1) });
                else if (model == "봉사")
                    brandData.children.push({ name: model, count: data[brand][model], color: "#a367dc", per: (data[brand][model] / brandTotal * 100).toFixed(1) });
                else if (model == "체육")
                    brandData.children.push({ name: model, count: data[brand][model], color: "#6771dc", per: (data[brand][model] / brandTotal * 100).toFixed(1) });
                else if (model == "종교")
                    brandData.children.push({ name: model, count: data[brand][model], color: "#c767dc", per: (data[brand][model] / brandTotal * 100).toFixed(1) });
                else if (model == "문예")
                    brandData.children.push({ name: model, count: data[brand][model], color: "#6794dc", per: (data[brand][model] / brandTotal * 100).toFixed(1) });
                else
                    brandData.children.push({ name: model, count: data[brand][model], color: "#67b7dc", per: (data[brand][model] / brandTotal * 100).toFixed(1) });

            }
            // }
            treeData.push(brandData);
            console.log(treeData);

            chart.data = treeData;

            chart.colors.step = 2;

            // define data fields
            chart.dataFields.value = "count";
            chart.dataFields.name = "name";
            chart.dataFields.children = "children";
            chart.dataFields.color = "color";
            chart.zoomable = false;
            var bgColor = new am4core.InterfaceColorSet().getFor("background");

            // level 1 series template
            var level1SeriesTemplate = chart.seriesTemplates.create("1");
            var level1ColumnTemplate = level1SeriesTemplate.columns.template;

            level1SeriesTemplate.tooltip.animationDuration = 0;
            level1SeriesTemplate.strokeOpacity = 1;
            level1ColumnTemplate.tooltipText = "{name}: [font-size:14px bold]{per}%({count}명)[/]";

            level1ColumnTemplate.column.cornerRadius(0, 0, 0, 0)
            level1SeriesTemplate.tooltip.pointerOrientation = "vertical";
            level1SeriesTemplate.tooltip.dy = -25;
            level1ColumnTemplate.fillOpacity = 1;
            level1ColumnTemplate.stroke = bgColor;

            var bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
            bullet1.locationY = 0.5;
            bullet1.locationX = 0.5;
            // bullet1.label.text = "{name}";
            bullet1.label.html = `<div style='font-size:13px;'><center>{name}<strong> {per}%</strong></center></div>`;


            chart.maxLevels = 2;

        }); // end am4core.ready()

    });
}
