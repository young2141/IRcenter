am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv", am4charts.SankeyDiagram);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    var colleges = ["인문대학", "사회과학대학", "자연과학대학", "경상대학", "법과대학", "공과대학", "IT대학", "농업생명과학대학", "예술대학", "사범대학", "수의과대학", "생활과학대학", "간호대학", "약학대학", "글로벌인재학부", "행정학부"];
    var temp = ["", " ", "  "];

    var data = [];
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < colleges.length; j++) {
            var sum = Math.floor(Math.random() * 10) + 1;
            for (var k = 0; k < colleges.length; k++) {
                var val = Math.floor(Math.random() * 3);
                if (sum < val) val = 0;
                else sum -= val;
                data.push({
                    from: colleges[j] + temp[i],
                    to: colleges[k] + temp[i + 1],
                    value: val,
                    id: colleges[j] + String(k) + "-" + String(i)
                })
            }
        }
    }



    console.log(data);

    chart.data = data;

    // chart.data = [
    //     { from: "A", to: "E", value: 1, id: "A0-0" },
    //     { from: "A", to: "F", value: 1, id: "A1-0" },
    //     { from: "A", to: "G", value: 1, id: "A2-0" },

    //     { from: "B", to: "E", value: 1, id: "B0-0" },
    //     { from: "B", to: "F", value: 1, id: "B1-0" },
    //     { from: "B", to: "G", value: 1, id: "B2-0" },

    //     { from: "C", to: "F", value: 1, id: "C0-0" },
    //     { from: "C", to: "G", value: 1, id: "C1-0" },
    //     { from: "C", to: "H", value: 1, id: "C2-0" },

    //     { from: "D", to: "E", value: 1, id: "D0-0" },
    //     { from: "D", to: "F", value: 1, id: "D1-0" },
    //     { from: "D", to: "G", value: 1, id: "D2-0" },
    //     { from: "D", to: "H", value: 1, id: "D3-0" },

    //     { from: "E", to: "I", value: 1, id: "A0-1" },
    //     { from: "E", to: "I", value: 1, id: "B0-1" },
    //     { from: "E", to: "L", value: 1, id: "D0-1" },

    //     { from: "F", to: "I", value: 1, id: "A1-1" },
    //     { from: "F", to: "I", value: 1, id: "C0-1" },
    //     { from: "F", to: "I", value: 1, id: "D1-1" },
    //     { from: "F", to: "M", value: 1, id: "B1-1" },

    //     { from: "G", to: "I", value: 1, id: "A2-1" },
    //     { from: "G", to: "I", value: 1, id: "B2-1" },
    //     { from: "G", to: "J", value: 1, id: "C1-1" },
    //     { from: "G", to: "N", value: 1, id: "D2-1" },

    //     { from: "H", to: "K", value: 1, id: "C2-1" },
    //     { from: "H", to: "N", value: 1, id: "D3-1" },

    //     { from: "I", to: "O", value: 1, id: "A0-2" },
    //     { from: "I", to: "O", value: 1, id: "B2-2" },
    //     { from: "I", to: "Q", value: 1, id: "A1-2" },
    //     { from: "I", to: "R", value: 1, id: "A2-2" },
    //     { from: "I", to: "S", value: 1, id: "D1-2" },
    //     { from: "I", to: "T", value: 1, id: "B0-2" },
    //     { from: "I", to: "Q", value: 1, id: "C0-2" },

    //     { from: "J", to: "U", value: 1, id: "C1-2" },

    //     { from: "K", to: "V", value: 1, id: "C2-2" },
    //     { from: "M", to: "U", value: 1, id: "B1-2" },

    //     { from: "N", to: "Q", value: 1, id: "D2-2" },
    //     { from: "N", to: "Q", value: 1, id: "D3-2" },

    //     { from: "L", to: "W", value: 1, id: "D0-2" }
    // ];

    let hoverState = chart.links.template.states.create("hover");
    hoverState.properties.fillOpacity = 0.6;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";

    //chart.links.template.propertyFields.id = "id";
    chart.links.template.colorMode = "solid";
    chart.links.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    chart.links.template.fillOpacity = 0.1;
    chart.links.template.tooltipText = "";

    // highlight all links with the same id beginning
    // chart.links.template.events.on("over", function (event) {
    //     let link = event.target;
    //     let id = link.id.split("-")[0];

    //     chart.links.each(function (link) {
    //         if (link.id.indexOf(id) != -1) {
    //             link.isHover = false;
    //         }
    //     })
    // })

    chart.links.template.events.on("out", function (event) {
        chart.links.each(function (link) {
            link.isHover = false;
        })
    })

    // for right-most label to fit
    chart.paddingRight = 150;

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.inert = true;
    nodeTemplate.readerTitle = "Drag me!";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.width = 20;

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

}); // end am4core.ready()