function drawChart() {
    remove();
    if ($(":input:radio[name=Gtype]:checked").attr('id') == 'pie1')
        pie1()
    else
        pie2()

}
function remove() {
    var chartdiv1 = document.getElementById('chartdiv1');
    var chartdiv2 = document.getElementById('chartdiv2');

    chartdiv1.innerHTML = "";
    chartdiv2.innerHTML = "";

}
function pie1(data) {
    am4core.ready(function () {

        jQuery.getJSON("../../../json/foreigner4.json", json => {

            treeData = [];
            data = {};
            data1 = {};
            data2 = {};
            data3 = {};
            data4 = {};
            data["sector"] = json[0]["sector"];
            data["size"] = json[0]["size"];
            data1["sector"] = json[1]["sector"];
            data1["size"]=json[1]["size"];
            data2["sector"] = json[2]["sector"];
            data2["size"]=json[2]["size"];
            data3["sector"] = json[3]["sector"];
            data3["size"]=json[3]["size"];
            data4["sector"] = json[4]["sector"];
            data4["size"]=json[4]["size"];
            treeData.push(data);
            treeData.push(data1);
            treeData.push(data2);
            treeData.push(data3);
            treeData.push(data4);
            
            // Themes begin
            am4core.useTheme(am4themes_frozen);
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.PieChart);

            var chartData = treeData;
            chart.data = treeData;
            console.log(treeData);

            // Add label
            chart.innerRadius = 100;
            var label = chart.seriesContainer.createChild(am4core.Label);

            label.horizontalCenter = "middle";
            label.verticalCenter = "middle";
            label.fontSize = 50;

            dummyData1 = [];
            data = {};
            data["교수"] = json[0]["size"];
            data["부교수"] = json[1]["size"];
            data["조교수"] = json[2]["size"];
            data["비전임교원"] = json[3]["size"];
            data["내국인"] = json[4]["size"];
            data["total"] = json[0]["size"] + json[1]["size"] + json[2]["size"] + json[3]["size"] + json[4]["size"];
            data["per"] = ((data["교수"] + data["부교수"] + data["조교수"] + data["비전임교원"]) / data["total"] * 100).toFixed(1);
            dummyData1.push(data);
            console.log(dummyData1);


            label.text = "{dummyData.0.per}%";
            label.dummyData = dummyData1;
            console.log(label.dummyData);



            // Add and configure Series
            var pieSeries = chart.series.push(new am4charts.PieSeries());
            var span_legend = document.getElementsByName("span_legend");

            pieSeries.dataFields.value = "size";
            pieSeries.dataFields.category = "sector";
            pieSeries.slices.template.tooltipText = "[bold]{category}[/]: {value.percent.formatNumber('#.0')}%({value}명)";
            pieSeries.colors.list = [
                am4core.color(span_legend[0].style.color),
                am4core.color(span_legend[1].style.color),
                am4core.color(span_legend[2].style.color),
                am4core.color(span_legend[3].style.color),
                am4core.color("rgb(247, 247, 136)")
            ];
            pieSeries.slices.template.events.on("hit", function (ev) {
                var series = ev.target.dataItem.component;
                series.slices.each(function (item) {
                    if (item.isActive && item != ev.target) {
                        item.isActive = false;
                    }
                })
            });
        });
    }); // end am4core.ready()

}
function pie2() {
    am4core.ready(function () {

        jQuery.getJSON("../../../json/foreigner4.json", json => {

            treeData = [];
            data = {};
            data1 = {};
            data2 = {};
            data3 = {};
            data4 = {};
            data["sector"] = json[5]["sector"];
            data["size"] = json[5]["size"];
            data1["sector"] = json[6]["sector"];
            data1["size"]=json[6]["size"];
            data2["sector"] = json[7]["sector"];
            data2["size"]=json[7]["size"];
            data3["sector"] = json[8]["sector"];
            data3["size"]=json[8]["size"];
            data4["sector"] = json[4]["sector"];
            data4["size"]=json[4]["size"];
            treeData.push(data);
            treeData.push(data1);
            treeData.push(data2);
            treeData.push(data3);
            treeData.push(data4);

            // Themes begin
            am4core.useTheme(am4themes_frozen);
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.PieChart);

            var chartData = treeData;
            chart.data = treeData;

            // Add label
            chart.innerRadius = 100;
            var label = chart.seriesContainer.createChild(am4core.Label);

            label.horizontalCenter = "middle";
            label.verticalCenter = "middle";
            label.fontSize = 50;

            dummyData1 = [];
            data = {};
            data["인문사회"] = json[5]["size"];
            data["자연과학"] = json[6]["size"];
            data["공학"] = json[7]["size"];
            data["예체능"] = json[8]["size"];
            data["내국인"] = json[4]["size"];
            data["total"] = data["인문사회"] + data["자연과학"] + data["공학"] + data["예체능"] + data["내국인"];
            data["per"] = ((data["인문사회"] + data["자연과학"] + data["공학"] + data["예체능"]) / data["total"] * 100).toFixed(1)
            dummyData1.push(data);
            console.log(dummyData1);


            label.text = "{dummyData.0.per}%";
            label.dummyData = dummyData1;
            console.log(label.dummyData);



            // Add and configure Series
            var span_legend1 = document.getElementsByName("span_legend1");

            var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "size";
            pieSeries.dataFields.category = "sector";
            pieSeries.slices.template.tooltipText = "[bold]{category}[/]: {value.percent.formatNumber('#.0')}%({value}명)";
            pieSeries.colors.list = [
                am4core.color(span_legend1[0].style.color),
                am4core.color(span_legend1[1].style.color),
                am4core.color(span_legend1[2].style.color),
                am4core.color(span_legend1[3].style.color),
                am4core.color("rgb(247, 247, 136)")
            ];

            pieSeries.slices.template.events.on("hit", function (ev) {
                var series = ev.target.dataItem.component;
                series.slices.each(function (item) {
                    if (item.isActive && item != ev.target) {
                        item.isActive = false;
                    }
                })
            });
        });
    }); // end am4core.ready()

}

