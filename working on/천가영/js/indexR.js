// academic --------------------------------------------------------------------------------------------------------------------------------------
jQuery.getJSON("../json/academicR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min=1;
        valueAxis.max=800;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rrank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {
        $.getJSON("../json/academicR.json", function (data) {
            var lastObj = data.reverse();
            $("#word1").html(lastObj[0]["rrank"]);
        });
    });

    $(document).ready(function () {
        $.getJSON("../json/academicR.json", function (data) {
            var lastObj = data;
            $("#title1").html('1. ' + lastObj[0]["index"] + '(' + lastObj[0]["part"] + ')');
        });
    });

    var picture1 = document.getElementById("picture1");
    if (json[4]["rrank"] > json[3]["rrank"]) {
        picture1.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] < json[3]["rrank"]) {
        picture1.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] == json[3]["rrank"]) {
        picture1.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});

// employer --------------------------------------------------------------------------------------------------------------------------------------

jQuery.getJSON("../json/employerR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv2", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min=1;
        valueAxis.max=800;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rrank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {
        $.getJSON("../json/employerR.json", function (data) {
            var lastObj1 = data.reverse();
            $("#word2").html(lastObj1[0]["rrank"]);
        });
    });

    $(document).ready(function () {
        $.getJSON("../json/employerR.json", function (data) {
            var lastObj1 = data;
            $("#title2").html('2. ' + lastObj1[0]["index"] + '(' + lastObj1[0]["part"] + ')');
        });
    });

    var picture2 = document.getElementById("picture2");
    if (json[4]["rrank"] > json[3]["rrank"]) {
        picture2.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] < json[3]["rrank"]) {
        picture2.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] == json[3]["rrank"]) {
        picture2.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});

// faculty --------------------------------------------------------------------------------------------------------------------------------------

jQuery.getJSON("../json/facultyR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv3", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min=1;
        valueAxis.max=800;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rrank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {
        $.getJSON("../json/facultyR.json", function (data) {
            var lastObj2 = data.reverse();
            $("#word3").html(lastObj2[0]["rrank"]);
        });
    });

    $(document).ready(function () {
        $.getJSON("../json/facultyR.json", function (data) {
            var lastObj2 = data;
            $("#title3").html('3. ' + lastObj2[0]["index"] + '(' + lastObj2[0]["part"] + ')');
        });
    });

    var picture3 = document.getElementById("picture3");
    if (json[4]["rrank"] > json[3]["rrank"]) {
        picture3.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] < json[3]["rrank"]) {
        picture3.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] == json[3]["rrank"]) {
        picture3.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});

// citation --------------------------------------------------------------------------------------------------------------------------------------

jQuery.getJSON("../json/citationR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv4", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min=1;
        valueAxis.max=800;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rrank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {
        $.getJSON("../json/citationR.json", function (data) {
            var lastObj4 = data.reverse();
            $("#word4").html(lastObj4[0]["rrank"]);
        });
    });

    $(document).ready(function () {
        $.getJSON("../json/citationR.json", function (data) {
            var lastObj4 = data;
            $("#title4").html('4. ' + lastObj4[0]["index"] + '(' + lastObj4[0]["part"] + ')');
        });
    });

    var picture4 = document.getElementById("picture4");
    if (json[4]["rrank"] > json[3]["rrank"]) {
        picture4.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] < json[3]["rrank"]) {
        picture4.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] == json[3]["rrank"]) {
        picture4.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});

// Ifaculty --------------------------------------------------------------------------------------------------------------------------------------

jQuery.getJSON("../json/IfacultyR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv5", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min=1;
        valueAxis.max=800;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rrank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {
        $.getJSON("../json/IfacultyR.json", function (data) {
            var lastObj5 = data.reverse();
            $("#word5").html(lastObj5[0]["rrank"]);
        });
    });

    $(document).ready(function () {
        $.getJSON("../json/IfacultyR.json", function (data) {
            var lastObj5 = data;
            $("#title5").html('5. ' + lastObj5[0]["index"] + '(' + lastObj5[0]["part"] + ')');
        });
    });

    var picture5 = document.getElementById("picture5");
    if (json[4]["rrank"] > json[3]["rrank"]) {
        picture5.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] < json[3]["rrank"]) {
        picture5.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] == json[3]["rrank"]) {
        picture5.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});

// Istudent --------------------------------------------------------------------------------------------------------------------------------------

jQuery.getJSON("../json/IstudentR.json", json => {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv6", am4charts.XYChart);

        // Data for both series
        var data = json;

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.3;
        categoryAxis.endLocation = 0.8;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.minLabelPosition = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min=1;
        valueAxis.max=800;
        valueAxis.renderer.inversed = true;

        /* Create series */
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "rrank";
        lineSeries.dataFields.valueY = "rank";
        lineSeries.dataFields.categoryX = "year";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 5;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[font-size: 15px]{year}\nRank: [bold]#{rrank} [/]";

        // var slabel = lineSeries.bullets.push(new am4charts.LabelBullet());
        // slabel.label.text = "rank: {rrank}";
        // slabel.label.dy = -10;

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.strokeWidth = 3;

        chart.data = data;
    }); // end am4core.ready()

    $(document).ready(function () {
        $.getJSON("../json/IstudentR.json", function (data) {
            var lastObj6 = data.reverse();
            $("#word6").html(lastObj6[0]["rrank"]);
        });
    });

    $(document).ready(function () {
        $.getJSON("../json/IstudentR.json", function (data) {
            var lastObj6 = data;
            $("#title6").html('6. ' + lastObj6[0]["index"] + '(' + lastObj6[0]["part"] + ')');
        });
    });

    var picture6 = document.getElementById("picture6");
    if (json[4]["rrank"] > json[3]["rrank"]) {
        picture6.innerHTML = '<img src="../down-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] < json[3]["rrank"]) {
        picture6.innerHTML = '<img src="../up-arrow.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    } else if (json[4]["rrank"] == json[3]["rrank"]) {
        picture6.innerHTML = '<img src="../equal.svg" style="width:50px; position: absolute; top:25%; left: 30%;">';
    }
});