function changegraph() {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/gendertreemap.json", json => {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // create chart
            var chart = am4core.create("chartdiv2", am4charts.TreeMap);
            chart.hiddenState.properties.opacity = 0;

            var data = json;
            var treeData = [];
            var brand = document.getElementById('span1').innerHTML;
            var Select = document.getElementById("sex_selectbar");
            var gender = Select.options[Select.selectedIndex].value;
            var brandData = { name: brand, children: [] }
            var brandTotal = 0;
            for (var model in data[brand]) {
                brandTotal += data[brand][model][gender];
            }

            for (var model in data[brand]) {
                if (model == "본부")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#dc67ce", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else if (model == "부설학교")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#67b7dc", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else if (model == "행정지원부")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#c767dc", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else if (model == "대학(원)")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#a367dc", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else if (model == "교육기본시설")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#8067dc", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else if (model == "지원 및 연구시설")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#6771dc", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else if (model == "부속시설")
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#6794dc", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
                else
                    brandData.children.push({ name: model, count: data[brand][model][gender], color: "#ff00ff", per: (data[brand][model][gender] / brandTotal * 100).toFixed(1) });
            }
            treeData.push(brandData);
            chart.data = treeData;
            console.log(chart.data);

            chart.colors.step = 2;

            // define data fields
            chart.dataFields.value = "count";
            // chart.dataFields.name = "name";
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
            // level1ColumnTemplate.tooltipHTML = `<center><strong>{name}</strong><br>{val1}%({val2}명)</center>`;
            level1SeriesTemplate.tooltip.pointerOrientation = "vertical";
            level1SeriesTemplate.tooltip.dy = -25;
            level1ColumnTemplate.fillOpacity = 1;
            level1ColumnTemplate.stroke = bgColor;


            //series1
            var bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
            bullet1.locationY = 0.5;
            bullet1.locationX = 0.5;
            // var myname = {name};
            // myname = parseString(myname)
            // myname2 = myname.slice(0,5);
            // myname2 += "\n";
            // myname2 += myname.slice(5,12);
            // bullet1.label.text = "[font-size: 25px][bold]{name}[/][font-size: 12px] {val1}%";
            // bullet1.label.dummyData = treeData;
            // bullet1.label.text = "{dummyData.0.name}%";
            bullet1.label.hideOversized = true;
            bullet1.label.html = `<div style='font-size:12px;'><center>{name} <strong>{per}%</strong></center></div>`;
            // bullet1.label.fill = am4core.color("#ffffff");
            // bullet1.tooltipText = "{name} \n {val1}%,{val2}명"

            chart.maxLevels = 2;

        });
    });

}
