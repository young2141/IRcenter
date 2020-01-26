var selval1, selval2, total, dummyData1;
function parse(callback) {
    $.getJSON("../../../json/foreigner.json", json => {

    });
}
am4core.ready(function () {

    jQuery.getJSON("../../../json/foreigner.json", json => {

        // Themes begin
        am4core.useTheme(am4themes_frozen);
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.PieChart);

        var chartData = json;
        chart.data = json;

        // Add label
        chart.innerRadius = 100;
        var label = chart.seriesContainer.createChild(am4core.Label);

        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 50;

        dummyData1 = [];
        data = {};
        data["외국인"] = json[0]["size"];
        data["내국인"] = json[1]["size"];
        data["total"] = json[0]["size"] + json[1]["size"];
        data["per"] = (json[0]["size"] / (json[0]["size"] + json[1]["size"]) * 100).toFixed(1);
        dummyData1.push(data);
        console.log(dummyData1);


        label.text = "{dummyData.0.per}%";
        label.dummyData = dummyData1;
        console.log(label.dummyData);



        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "sector";
        pieSeries.slices.template.tooltipText = "[bold]{category}[/]: {value.percent.formatNumber('#.0')}%({value}명)";
        pieSeries.colors.list = [
            am4core.color("#ff0000"),
            am4core.color("#FBFBEF")
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

