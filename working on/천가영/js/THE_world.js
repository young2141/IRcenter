am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    jQuery.getJSON("../json/THE_world.json", json => {

        treeData = [];
        for (var i = 0; i < json.length; i++) {
            yearly_data = {};
            for (var key in json[i]) {
                if (key == "year") yearly_data["year"] = json[i]["year"];
                else yearly_data[key] = json[i][key]["score"];
            }
            treeData.push(yearly_data);
        }
        console.log(treeData);

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        // Data for both series
        var data = treeData;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        /* Create value axis */
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMax = 0.15;
        valueAxis.extraMin = 0.15;

        var span_legend = document.getElementsByName("span_legend");

        /* Create series */
        function createSeries(field, name) {
            var lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.name = name;
            lineSeries.dataFields.valueY = field;
            lineSeries.dataFields.categoryX = "year";

            var bullet = lineSeries.bullets.push(new am4charts.Bullet());
            bullet.tooltipText = '[font-size: 15px]{name}\n [bold]점수: {valueY}[/]'
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.strokeWidth = 3;

            if (name == "전체"){
                lineSeries.stroke = am4core.color(span_legend[0].style.color);
                bullet.fill = am4core.color(span_legend[0].style.color);
            }
            else if (name == "teaching"){
                lineSeries.stroke = am4core.color(span_legend[1].style.color);
                bullet.fill = am4core.color(span_legend[1].style.color);
            }
            else if (name == "research"){
                lineSeries.stroke = am4core.color(span_legend[2].style.color);
                bullet.fill = am4core.color(span_legend[2].style.color);
            }
            else if (name == "citations"){
                lineSeries.stroke = am4core.color(span_legend[3].style.color);
                bullet.fill = am4core.color(span_legend[3].style.color);
            }
            else if (name == "industry income"){
                lineSeries.stroke = am4core.color(span_legend[4].style.color);
                bullet.fill = am4core.color(span_legend[4].style.color);
            }
            else if(name == "international outlook"){
                lineSeries.stroke = am4core.color(span_legend[5].style.color);
                bullet.fill = am4core.color(span_legend[5].style.color);
            }
            lineSeries.strokeWidth = 3;
            lineSeries.propertyFields.strokeDasharray = ["dotted"];
            if (name != "전체") {
                lineSeries.strokeWidth = 3;
                lineSeries.strokeDasharray = "2, 2";
            }
            lineSeries.tooltip.label.textAlign = "middle";



            return lineSeries;
        }

        createSeries("overall", "전체");
        createSeries("teaching", "teaching");
        createSeries("research", "research");
        createSeries("citations", "citations");
        createSeries("industry income", "industry income");
        createSeries("international outlook", "international outlook");


        chart.data = data;

    });
}); // end am4core.ready()