function parse(callback) {
    $.getJSON("../../../json/4-2.json", json => {
        callback(json);
    });
}

parse(json => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv2", am4charts.PieChart);

        // Add data
        chart.data = json;

        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "field";
        pieSeries.dataFields.category = "name";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
    }); // end am4core.ready()}

}
)