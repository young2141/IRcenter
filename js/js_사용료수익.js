function parse(callback) {
    $.getJSON("../../../json/공동연구_4.json", json => {
        callback(json);
    });
}

parse(json => {

    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv4", am4charts.PieChart);
        chart.data = json;

        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "type";
        pieSeries.slices.template.propertyFields.fill = "color";
        pieSeries.slices.template.strokeWidth = 0;
    });




});