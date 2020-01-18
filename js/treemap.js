am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // create chart
    var chart = am4core.create("chartdiv2", am4charts.TreeMap);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    jQuery.getJSON("../../../json/treemap.json", json => {
        chartele(json);
    });
    function chartele(json) {
        chart.data = json;
    }

    chart.colors.step = 2;

    // define data fields
    chart.dataFields.value = "value";
    // chart.dataFields.name = "name";
    // chart.dataFields.id = "val1";
    chart.dataFields.children = "children";
    chart.dataFields.color = "color";
    chart.zoomable = false;
    var bgColor = new am4core.InterfaceColorSet().getFor("background");

    // level 0 series template
    // var level0SeriesTemplate = chart.seriesTemplates.create("0");
    // var level0ColumnTemplate = level0SeriesTemplate.columns.template;

    // level0ColumnTemplate.column.cornerRadius(5, 5, 5, 5);
    // level0ColumnTemplate.fillOpacity = 0;
    // level0ColumnTemplate.strokeWidth = 4;
    // level0ColumnTemplate.strokeOpacity = 0;

    // level 1 series template
    var level1SeriesTemplate = chart.seriesTemplates.create("1");
    var level1ColumnTemplate = level1SeriesTemplate.columns.template;

    level1SeriesTemplate.tooltip.animationDuration = 0;
    level1SeriesTemplate.strokeOpacity = 1;
    level1ColumnTemplate.tooltipText = "[bold]{name}[/]: [font-size:14px]{value}%({value}명)";
    // level1ColumnTemplate.tooltipHTML = `<center><strong>{name}</strong><br>{val1}%({val2}명)</center>`;
    level1SeriesTemplate.tooltip.pointerOrientation = "vertical";
    level1SeriesTemplate.tooltip.dy = -25;


    // level1ColumnTemplate.column.cornerRadius(5, 5, 5, 5)
    level1ColumnTemplate.fillOpacity = 1;
    // level1ColumnTemplate.strokeWidth = 4;
    level1ColumnTemplate.stroke = bgColor;


    //series1
    var bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
    bullet1.locationY = 0.5;
    bullet1.locationX = 0.5;
    // var myname = {name};
    // myname = parseString(myname)
    // myname2 = myname.slice(0,5);
    // myname2 += "\n";
    // myname2 += myname.slice(5,12);
    // bullet1.label.text = "[font-size: 25px][bold]{name}[/][font-size: 12px] {val1}%";
    bullet1.label.html = `<div style='font-size:10px;'><center><strong>{name}</strong> {value}%</center></div>`;
    // bullet1.label.fill = am4core.color("#ffffff");
    // bullet1.tooltipText = "{name} \n {val1}%,{val2}명"

    chart.maxLevels = 3;


}); // end am4core.ready()

function changegraph() {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // create chart
        var chart = am4core.create("chartdiv2", am4charts.TreeMap);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

        jQuery.getJSON("../../../json/treemap.json", json => {
            // 데이터 수정
            chartele(json);
        });
        function chartele(json) {
            chart.data = json;
        }

        chart.colors.step = 2;

        // define data fields
        chart.dataFields.value = "value";
        // chart.dataFields.name = "name";
        // chart.dataFields.id = "val1";
        chart.dataFields.children = "children";
        chart.dataFields.color = "color";
        chart.zoomable = false;
        var bgColor = new am4core.InterfaceColorSet().getFor("background");

        // level 0 series template
        // var level0SeriesTemplate = chart.seriesTemplates.create("0");
        // var level0ColumnTemplate = level0SeriesTemplate.columns.template;

        // level0ColumnTemplate.column.cornerRadius(5, 5, 5, 5);
        // level0ColumnTemplate.fillOpacity = 0;
        // level0ColumnTemplate.strokeWidth = 4;
        // level0ColumnTemplate.strokeOpacity = 0;

        // level 1 series template
        var level1SeriesTemplate = chart.seriesTemplates.create("1");
        var level1ColumnTemplate = level1SeriesTemplate.columns.template;

        level1SeriesTemplate.tooltip.animationDuration = 0;
        level1SeriesTemplate.strokeOpacity = 1;
        level1ColumnTemplate.tooltipText = "[bold]{name}[/]: [font-size:14px]{val1}%({val2}명)";
        // level1ColumnTemplate.tooltipHTML = `<center><strong>{name}</strong><br>{val1}%({val2}명)</center>`;
        level1SeriesTemplate.tooltip.pointerOrientation = "vertical";
        level1SeriesTemplate.tooltip.dy = -25;


        // level1ColumnTemplate.column.cornerRadius(5, 5, 5, 5)
        level1ColumnTemplate.fillOpacity = 1;
        // level1ColumnTemplate.strokeWidth = 4;
        level1ColumnTemplate.stroke = bgColor;


        //series1
        var bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
        bullet1.locationY = 0.5;
        bullet1.locationX = 0.5;
        // var myname = {name};
        // myname = parseString(myname)
        // myname2 = myname.slice(0,5);
        // myname2 += "\n";
        // myname2 += myname.slice(5,12);
        // bullet1.label.text = "[font-size: 25px][bold]{name}[/][font-size: 12px] {val1}%";
        bullet1.label.html = `<div style='font-size:10px;'><center><strong>{name}</strong> {val1}%</center></div>`;
        // bullet1.label.fill = am4core.color("#ffffff");
        // bullet1.tooltipText = "{name} \n {val1}%,{val2}명"

        chart.maxLevels = 3;


    }); // end am4core.ready()
}