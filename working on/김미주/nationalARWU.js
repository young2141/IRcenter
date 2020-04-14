jQuery.getJSON("worldARWU.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv1-2", am4charts.XYChart);

        var data = json;
        chart.data = data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.disabled = true;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;

        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.categoryX = "year";
        lineSeries.dataFields.valueY = "nationalrank";
        lineSeries.strokeWidth = 5;
        lineSeries.stroke = am4core.color("#FF8700");

        var bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
        bullet.circle.fill = am4core.color("#FF8700");
        bullet.circle.fillOpacity = 0;
        bullet.circle.strokeOpacity = 0;

        var labelBullet = lineSeries.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "rank: {nationalrank}";
        labelBullet.label.dy = -20;

    }); // end am4core.ready()

    $(document).ready(function () {

        $.getJSON("worldARWU.json", function (data) {
            var lastObj = data.reverse();
            $("#word2").html(lastObj[0]["nationalrank"]);
        });
    });


    var picture = document.getElementById("picture2");
    if (json[4]["worldrank"] > json[3]["worldrank"]) {
        picture.innerHTML = '<img src="arrow-141-64-2.png" style="width:50px; position: absolute; top:25%; left: 30%;" onload="arrow()"></img>';
    } else if (json[4]["worldrank"] < json[3]["worldrank"]) {
        picture.innerHTML = '';
        picture.innerHTML = '<img src="arrow-141-64.png" style="width:50px; position: absolute; top:25%; left: 30%;" onload="arrow()"></img>';
    } else if (json[4]["worldrank"] = json[3]["worldrank"]) {
        picture.innerHTML = '<img src="equal-sign-3-64.svg" style="width:50px; position: absolute; top:25%; left: 30%;" onload="arrow()"></img>';
    }
});