function parse4(callback) {
    $.getJSON("../../../json/공동연구_4.json", json => {
        callback(json);
    });
}
function drawChart3(value) {
    parse4(json => {

        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            var chart = am4core.create("chartdiv4", am4charts.PieChart);
            
            var data=[]
            for (var i = 0; i < json.length; i++) {
                if(json[i].year==value){
                    data.push(json[i])
                }
            }
                
            chart.data = data

            var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "value";
            pieSeries.dataFields.category = "type";
            pieSeries.slices.template.propertyFields.fill = "color";
            pieSeries.slices.template.strokeWidth = 0;
        });

    });
}