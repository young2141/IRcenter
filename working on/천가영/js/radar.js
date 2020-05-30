function parse1(callback) {
    $.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/radar.json", json => {
        callback(json);
    });
}
function parse2(callback) {
    $.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/radar.json", json => {
        callback(json);
    });
}


$(document).ready(function () {

    $.getJSON("../json/radar_year.json", function (data) {
        var rdata = data.reverse();
        for(var count = 0; count < data.length; count++){
            if(rdata[count]["year"]=="2020")                
                var option1 = $("<option value="+rdata[count]["year"]+">"+rdata[count]["year"]+"</option>");
            else
                var option1 = $("<option value="+rdata[count]["year"]+">"+rdata[count]["year"]+"</option>");
            $('#year_selectbar1').append(option1);
        }
    });
});

$(document).ready(function () {

    $.getJSON("../json/radar_year.json", function (data) {
        var rdata = data.reverse();
        for(var count = 0; count < data.length; count++){                
            var option2 = $("<option value="+rdata[count]["year"]+">"+rdata[count]["year"]+"</option>");
            $('#year_selectbar2').append(option2);
        }
    });
});



function call1() {
    var year1 = $("#year_selectbar1 option:selected").val();
    var key;
    console.log(year1);

    parse1(json => {
        data = [];

        data1 = {};
        if(key ="Academic Reputation")
        data1["name"] = json[year1]["Academic Reputation"]["name"];
        data1["score"] = json[year1]["Academic Reputation"]["score"];
        data1["avg"] = json[year1]["Academic Reputation"]["avg"];
        data.push(data1);

        data2 = {};
        if(key ="Employer Reputation")
        data2["name"] = json[year1]["Employer Reputation"]["name"];
        data2["score"] = json[year1]["Employer Reputation"]["score"];
        data2["avg"] = json[year1]["Employer Reputation"]["avg"];
        data.push(data2);

        data3 = {};
        if(key ="Faculty Student")
        data3["name"] = json[year1]["Faculty Student"]["name"];
        data3["score"] = json[year1]["Faculty Student"]["score"];
        data3["avg"] = json[year1]["Faculty Student"]["avg"];
        data.push(data3);

        data4 = {};
        if(key ="Citations per Faculty")
        data4["name"] = json[year1]["Citations per Faculty"]["name"];
        data4["score"] = json[year1]["Citations per Faculty"]["score"];
        data4["avg"] = json[year1]["Citations per Faculty"]["avg"];
        data.push(data4);

        data5 = {};
        if(key ="International Faculty")
        data5["name"] = json[year1]["International Faculty"]["name"];
        data5["score"] = json[year1]["International Faculty"]["score"];
        data5["avg"] = json[year1]["International Faculty"]["avg"];
        data.push(data5);

        data6 = {};
        if(key ="Internaional Students")
        data6["name"] = json[year1]["Internaional Students"]["name"];
        data6["score"] = json[year1]["Internaional Students"]["score"];
        data6["avg"] = json[year1]["Internaional Students"]["avg"];
        data.push(data6);

        radargraph1(data);
        bargraph1(data);
    });
}

function call2() {
    var Select1 = document.getElementById("year_selectbar1");
    var Select2 = document.getElementById("year_selectbar2");
    var year1 = Select1.options[Select1.selectedIndex].value;
    var year2 = Select2.options[Select2.selectedIndex].value;
    var key;

    parse2(json => {
        data = [];

        data1 = {};
        if(key ="Academic Reputation")
        data1["name"] = json[year2]["Academic Reputation"]["name"];
        data1["score"] = json[year2]["Academic Reputation"]["score"];
        data1["avg"] = json[year2]["Academic Reputation"]["avg"];
        data.push(data1);

        data2 = {};
        if(key ="Employer Reputation")
        data2["name"] = json[year2]["Employer Reputation"]["name"];
        data2["score"] = json[year2]["Employer Reputation"]["score"];
        data2["avg"] = json[year2]["Employer Reputation"]["avg"];
        data.push(data2);

        data3 = {};
        if(key ="Faculty Student")
        data3["name"] = json[year2]["Faculty Student"]["name"];
        data3["score"] = json[year2]["Faculty Student"]["score"];
        data3["avg"] = json[year2]["Faculty Student"]["avg"];
        data.push(data3);

        data4 = {};
        if(key ="Citations per Faculty")
        data4["name"] = json[year2]["Citations per Faculty"]["name"];
        data4["score"] = json[year2]["Citations per Faculty"]["score"];
        data4["avg"] = json[year2]["Citations per Faculty"]["avg"];
        data.push(data4);

        data5 = {};
        if(key ="International Faculty")
        data5["name"] = json[year2]["International Faculty"]["name"];
        data5["score"] = json[year2]["International Faculty"]["score"];
        data5["avg"] = json[year2]["International Faculty"]["avg"];
        data.push(data5);

        data6 = {};
        if(key ="Internaional Students")
        data6["name"] = json[year2]["Internaional Students"]["name"];
        data6["score"] = json[year2]["Internaional Students"]["score"];
        data6["avg"] = json[year2]["Internaional Students"]["avg"];
        data.push(data6);

        radargraph2(data);
        bargraph2(data);
    });
}


function radargraph1(data) {
    jQuery.getJSON("../json/radar.json", json => {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            /* Create chart instance */
            var chart = am4core.create("chartdiv1-1", am4charts.RadarChart);

            /* Add data */
            chart.data = data;

            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "name";

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            /* Create and configure series */
            var series1 = chart.series.push(new am4charts.RadarSeries());
            series1.dataFields.valueY = "score";
            series1.dataFields.categoryX = "name";
            // series1.name = "Sales";
            series1.fillOpacity = 1;
            series1.fill = am4core.color("#CC3333");
            series1.strokeWidth = 0;

            var series2 = chart.series.push(new am4charts.RadarSeries());
            series2.dataFields.valueY = "avg";
            series2.dataFields.categoryX = "name";
            // series2.name = "Sales";
            series2.strokeWidth = 3;
        }); // end am4core.ready()
    });
}

function radargraph2(data) {
    jQuery.getJSON("../json/radar.json", json => {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            /* Create chart instance */
            var chart = am4core.create("chartdiv1-2", am4charts.RadarChart);

            /* Add data */
            chart.data = data;

            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "name";

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            /* Create and configure series */
            var series1 = chart.series.push(new am4charts.RadarSeries());
            series1.dataFields.valueY = "score";
            series1.dataFields.categoryX = "name";
            // series1.name = "Sales";
            series1.fillOpacity = 1;
            series1.fill = am4core.color("#CC3333");
            series1.strokeWidth = 0;

            var series2 = chart.series.push(new am4charts.RadarSeries());
            series2.dataFields.valueY = "avg";
            series2.dataFields.categoryX = "name";
            // series2.name = "Sales";
            series2.strokeWidth = 3;
        }); // end am4core.ready()
    });
}

function bargraph1(data){
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
    
        // Create chart instance
        var chart = am4core.create("chartdiv2-1", am4charts.XYChart);
    
        // Add data
        chart.data = data;
    
        // Create axes
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        yAxis.dataFields.category = "name";
        yAxis.renderer.grid.template.location = 0;
        yAxis.renderer.labels.template.fontSize = 10;
        yAxis.renderer.minGridDistance = 10;
    
        var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = "score";
        series.dataFields.categoryY = "name";
        series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
        series.columns.template.strokeWidth = 0;
        series.fill = am4core.color("#d3d3d3");
    
        var series2 = chart.series.push(new am4charts.StepLineSeries());
        series2.dataFields.valueX = "avg";
        series2.dataFields.categoryY = "name";
        series2.strokeWidth = 3;
        series2.noRisers = true;
        series2.startLocation = 0;
        series2.endLocation = 1;
        series2.tooltipText = "{valueX}"
        series2.stroke = am4core.color("#f5bd1f");
    
    }); // end am4core.ready()
}


function bargraph2(data){
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
    
        // Create chart instance
        var chart = am4core.create("chartdiv2-2", am4charts.XYChart);
    
        // Add data
        chart.data = data;
    
        // Create axes
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        yAxis.dataFields.category = "name";
        yAxis.renderer.grid.template.location = 0;
        yAxis.renderer.labels.template.fontSize = 10;
        yAxis.renderer.minGridDistance = 10;
    
        var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = "score";
        series.dataFields.categoryY = "name";
        series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
        series.columns.template.strokeWidth = 0;
        series.fill = am4core.color("#d3d3d3");
    
        var series2 = chart.series.push(new am4charts.StepLineSeries());
        series2.dataFields.valueX = "avg";
        series2.dataFields.categoryY = "name";
        series2.strokeWidth = 3;
        series2.noRisers = true;
        series2.startLocation = 0;
        series2.endLocation = 1;
        series2.tooltipText = "{valueX}"
        series2.stroke = am4core.color("#f5bd1f");
    
    }); // end am4core.ready()
}
