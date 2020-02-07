var color1 = {
    "인문대학": "#FFD8D8",
    "사회과학대학": "#F15F5F",
    "자연과학대학": "#FAE0D4",
    "경상대학": "#F29661",
    "공과대학": "#FAECC5",
    "IT대학": "#F2CB61",
    "농업생명과학대학": "#FAF4C0",
    "예술대학": "#E5D85C",
    "사범대학": "#34F7BA",
    "의과대학": "#BCE55C",
    "치과대학": "#CEF279",
    "수의과대학": "#9FC93C",
    "생활과학대학": "#B7F0B1",
    "간호대학": "#47C8CE",
    "약학대학": "#B2EBF4",
    "글로벌인재학부": "#5CD1E5",
    "행정학부": "#D9E5FF",
    "법과대학": "#6699FF",
    "자율전공부": "#DAD9FF",
    "No Degree": "#6B66FF"
};
function parsing() {
    var filename = "doyeong_sankey_dumy.json";

    $.getJSON("../../../json/" + filename, (jsonData) => {
        var len = jsonData.length;

        for (var i = 0; i < len; i++) {
            jsonData[i].color = color1[(jsonData[i].from).trim()];
        }

        drawSankey(jsonData);
    })
}

function drawSankey(_data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv", am4charts.SankeyDiagram);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.data = _data;

        let hoverState = chart.links.template.states.create("hover");
        hoverState.properties.fillOpacity = 0.6;

        chart.dataFields.fromName = "from";
        chart.dataFields.toName = "to";
        chart.dataFields.value = "value";
        //chart.dataFields.color = "color";

        console.log(chart.dataItem);
        //chart.links.template.propertyFields.id = "id";
        chart.links.template.colorMode = "solid";
        chart.links.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        chart.links.template.fillOpacity = 0.1;
        chart.links.template.tooltipText = "{fromName} -> {toName} : {value}";

        // highlight all links with the same id beginning
        // chart.links.template.events.on("over", function (event) {
        //     let link = event.target;
        //     let id = link.id.split("-")[0];
        //     console.log("아이디값 : " + id);

        //     chart.links.each(function (link) {
        //         if (link.id.indexOf(id) != -1) {
        //             link.isHover = false;
        //         }
        //     })
        // })

        // chart.links.template.events.on("out", function (event) {
        //     chart.links.each(function (link) {
        //         link.isHover = false;
        //     })
        // })

        // for right-most label to fit
        chart.paddingRight = 150;

        // make nodes draggable
        var nodeTemplate = chart.nodes.template;
        nodeTemplate.inert = true;
        nodeTemplate.readerTitle = "Drag me!";
        nodeTemplate.showSystemTooltip = true;
        nodeTemplate.width = 20;

        nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
        nodeTemplate.showSystemTooltip = true;
        nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer


        nodeTemplate.adapter.add("fill", function (fill, target) {
            clr = color1[target.dataItem.fromName.trim()];
            return am4core.color(clr);
        });

    }); // end am4core.ready()
}

