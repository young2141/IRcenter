jQuery.getJSON("../json/national.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1-2", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        // categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        // categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = -0.5;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 40;
        valueAxis.min=1;
        valueAxis.max=100;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        // lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {

        $.getJSON("../json/national.json", function (data) {
            var lastObj = data.reverse();
            $("#word2").html(lastObj[1]["rank"]);
        });
    });


    var picture = document.getElementById("picture2");
    if (json[3]["rank"] > json[2]["rank"]) {
        picture.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[3]["rank"] < json[2]["rank"]) {
        console.log(picture);
        picture.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[3]["rank"] == json[2]["rank"]) {
        picture.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});
