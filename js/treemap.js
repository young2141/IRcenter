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
    chart.dataFields.value = "val2";
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
    level1ColumnTemplate.tooltipText="[bold]{name}[/]\n[font-size:14px]{val1}({val2})";
    level1SeriesTemplate.tooltip.pointerOrientation = "vertical";
    level1SeriesTemplate.tooltip.dy=-25;


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
    bullet1.label.text = "[font-size:20px][bold]{name}[/] [font-size:12px]{val1}";
    // bullet1.label.fill = am4core.color("#ffffff");
    // bullet1.tooltipText = "{name} \n {val1}%,{val2}명"

    chart.maxLevels = 3;

    // jQuery.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/treemap.json", json => {
    //     data = [];
    //     for (var i = 0; i < json.length; i++) {
    //         new_data = {};
    //         for (var key in json[i]) {
    //             if (key == "name") new_data["name"] = json[i]["name"];
    //             else if (key == "children") { new_data["val1"] = json[i]["children"]["val1"]; new_data["val2"] = json[i]["children"]["val2"]; }
    //         }
    //         data.push(new_data);
    //     }
    //     chartele(data);
    //     console.log(data);
    // });

}); // end am4core.ready()