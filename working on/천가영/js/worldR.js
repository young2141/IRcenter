function parse(callback) {
    $.getJSON("../json/radar.json", json => {
        callback(json);
    });
}
jQuery.getJSON("../json/worldR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        // Data for both series
        var data = json;
        console.log(json);
        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;

        /* Create value axis */
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]rank: {rrank} [/]";


        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 1;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {

        $.getJSON("../json/worldR.json", function (data) {
            var lastObj = data.reverse();
            $("#word").html(lastObj[0]["rrank"]);
        });
    });


    var picture = document.getElementById("picture");
    if (json[4]["rank"] > json[3]["rank"]) {
        picture.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;" onload="arrow()"></img>';
    } else if (json[4]["rank"] < json[3]["rank"]) {
        console.log(json[4]["rank"]);
        console.log(json[4]["rank"]);
        picture.innerHTML = '';
        picture.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;" onload="arrow()"></img>';
    } else if (json[4]["rank"] = json[3]["rank"]) {
        picture.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;" onload="arrow()"></img>';
    }
});

// function call() {
//     var Select1 = document.getElementById("year_selectbar1");
//     var Select2 = document.getElementById("year_selectbar2");
//     var year1 = Select1.options[Select1.selectedIndex].value;
//     var year2 = Select2.options[Select2.selectedIndex].value;

//     parse(json => {
//         data = [];
//         for (var i = 0; i < json.length; i++) {
//             yearly_data = {};
//             console.log(json);
//             for (var key in json[i]) {
//                 if (key == "year") yearly_data[key] = json[i]["year"];
//                 else {
//                     yearly_data[key]["name"] = json[year1][key]["name"]
//                     yearly_data[key]["score"] = json[year1][key]["score"]
//                     yearly_data[key]["avg"] = json[year1][key]["avg"]
//                 }
//                 // else yearly_data[key] = json[i][key][sex];
//             }
//             data.push(yearly_data);
//             console.log(data);
//         }
//         radargraph1(data);
//     });
// }


function radargraph1() {
    jQuery.getJSON("../json/radar.json", json => {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            /* Create chart instance */
            var chart = am4core.create("chartdiv2", am4charts.RadarChart);

            // var Select1 = document.getElementById("year_selectbar1");
            // var Select2 = document.getElementById("year_selectbar2");
            // var year1 = Select1.options[Select1.selectedIndex].value;
            // var year2 = Select2.options[Select2.selectedIndex].value;

            // data = [];
            // yearly_data = {};
            // for (var key in json[year1][i]) {
            //     yearly_data[i][key]= json[year1][i][key];
            //     yearly_data["name"] = json[year1][key]["name"];
            //     yearly_data["score"] = json[year1][key]["score"];
            //     yearly_data["avg"] = json[year1][key]["avg"];
            // }
            
            // data.push(yearly_data);
            // console.log(data);

            /* Add data */
            // chart.data = data;
            chart.data = [{
                "country": "Academic Reputation",
                "litres": 501,
                "avg": 400
            }, {
                "country": "Employer Reputation",
                "litres": 301,
                "avg": 400
            }, {
                "country": "Citations per Faculty",
                "litres": 266,
                "avg": 400
            }, {
                "country": "Faculty Student",
                "litres": 165,
                "avg": 400
            }, {
                "country": "International Faculty",
                "litres": 139,
                "avg": 400
            }, {
                "country": "Internaional Students",
                "litres": 336,
                "avg": 400
            }];


            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "country";

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            /* Create and configure series */
            var series1 = chart.series.push(new am4charts.RadarSeries());
            series1.dataFields.valueY = "litres";
            series1.dataFields.categoryX = "country";
            // series1.name = "Sales";
            series1.fillOpacity = 1;
            series1.fill = am4core.color("#CC3333");
            series1.strokeWidth = 0;

            var series2 = chart.series.push(new am4charts.RadarSeries());
            series2.dataFields.valueY = "avg";
            series2.dataFields.categoryX = "country";
            // series2.name = "Sales";
            series2.strokeWidth = 3;
        }); // end am4core.ready()
    });
}


am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    /* Create chart instance */
    var chart = am4core.create("chartdiv3", am4charts.RadarChart);

    /* Add data */
    chart.data = [{
        "country": "Academic Reputation",
        "litres": 501,
        "avg": 400
    }, {
        "country": "Employer Reputation",
        "litres": 301,
        "avg": 400
    }, {
        "country": "Citations per Faculty",
        "litres": 266,
        "avg": 400
    }, {
        "country": "Faculty Student",
        "litres": 165,
        "avg": 400
    }, {
        "country": "International Faculty",
        "litres": 139,
        "avg": 400
    }, {
        "country": "Internaional Students",
        "litres": 336,
        "avg": 400
    }];

    /* Create axes */
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


    /* Create and configure series */
    var series1 = chart.series.push(new am4charts.RadarSeries());
    series1.dataFields.valueY = "litres";
    series1.dataFields.categoryX = "country";
    series1.fillOpacity = 1;
    series1.name = "Sales";
    series1.fill = am4core.color("#CC3333");
    series1.strokeWidth = 0;

    var series2 = chart.series.push(new am4charts.RadarSeries());
    series2.dataFields.valueY = "avg";
    series2.dataFields.categoryX = "country";
    series2.name = "Sales";
    series2.strokeWidth = 3;
}); // end am4core.ready()

am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv4", am4charts.XYChart);

    // Add data
    chart.data = [
        {
            "state": "Internaional Students",
            "sales": 920,
            "target": 450
        },
        {
            "state": "International Faculty",
            "sales": 920,
            "target": 400
        },
        {
            "state": "Faculty Student",
            "sales": 1317,
            "target": 500
        },
        {
            "state": "Citations per Faculty",
            "sales": 2916,
            "target": 1000
        },
        {
            "state": "Employer Reputation",
            "sales": 4577,
            "target": 2200
        },
        {
            "state": "Academic Reputation",
            "sales": 2500,
            "target": 2000
        },
        {
            "state": "Overall",
            "sales": 3000,
            "target": 1500
        }
    ];

    // Create axes
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "state";
    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;

    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "sales";
    series.dataFields.categoryY = "state";
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeWidth = 0;
    series.fill = am4core.color("#d3d3d3");

    var series2 = chart.series.push(new am4charts.StepLineSeries());
    series2.dataFields.valueX = "target";
    series2.dataFields.categoryY = "state";
    series2.strokeWidth = 3;
    series2.noRisers = true;
    series2.startLocation = 0;
    series2.endLocation = 1;
    series2.tooltipText = "{valueX}"
    series2.stroke = am4core.color("#f5bd1f");

}); // end am4core.ready()

am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv5", am4charts.XYChart);

    // Add data
    chart.data = [
        {
            "state": "Internaional Students",
            "sales": 920,
            "target": 450
        },
        {
            "state": "International Faculty",
            "sales": 920,
            "target": 400
        },
        {
            "state": "Faculty Student",
            "sales": 1317,
            "target": 500
        },
        {
            "state": "Citations per Faculty",
            "sales": 2916,
            "target": 1000
        },
        {
            "state": "Employer Reputation",
            "sales": 4577,
            "target": 2200
        },
        {
            "state": "Academic Reputation",
            "sales": 2500,
            "target": 2000
        },
        {
            "state": "Overall",
            "sales": 3000,
            "target": 1500
        }
    ];

    // Create axes
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "state";
    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;

    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "sales";
    series.dataFields.categoryY = "state";
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeWidth = 0;
    series.fill = am4core.color("#d3d3d3");

    var series2 = chart.series.push(new am4charts.StepLineSeries());
    series2.dataFields.valueX = "target";
    series2.dataFields.categoryY = "state";
    series2.strokeWidth = 3;
    series2.noRisers = true;
    series2.startLocation = 0;
    series2.endLocation = 1;
    series2.tooltipText = "{valueX}"
    series2.stroke = am4core.color("#f5bd1f");

}); // end am4core.ready()
