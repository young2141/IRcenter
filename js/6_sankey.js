function parsing() {
    var filename = "doyeong_sankey_dumy.json";
    var color1 = {
        "인문대학" : "#99ff6a",
        "사회과학대학" : "#ff0000",
        "자연과학대학" : "#00ff00",
        "경상대학" : "#0000ff",
        "공과대학" : "#ffff00",
        "IT대학" : "#ff00ff",
        "농업생명과학대학" : "#00ffff",
        "예술대학" : "#f0000f",
        "사범대학" : "#f00f00",
        "의과대학" : "#f000f0",
        "치과대학" : "#f0f0f0",
        "수의과대학" : "#f0f0ff",
        "생활과학대학" : "#f00fff",
        "간호대학" : "#f0ffff",
        "약학대학" : "#ffff0f",
        "글로벌인재학부" : "#f00fff",
        "행정학부" : "#123456",
        "법과대학" : "#66ffff",
        "자율전공부" : "#29845a",
        "No Degree" : "#0f0f0f"
    };
    var color2 = {
        "인문대학" : "#99ff6b",
        "사회과학대학" : "#ff0001",
        "자연과학대학" : "#00ff01",
        "경상대학" : "#0000fe",
        "공과대학" : "#ffff01",
        "IT대학" : "#ff00fe",
        "농업생명과학대학" : "#00fffe",
        "예술대학" : "#f0000e",
        "사범대학" : "#f00f01",
        "의과대학" : "#f000f1",
        "치과대학" : "#f0f0f1",
        "수의과대학" : "#f0f0fe",
        "생활과학대학" : "#f00ffe",
        "간호대학" : "#f0fffe",
        "약학대학" : "#ffff0e",
        "글로벌인재학부" : "#f00ffe",
        "행정학부" : "#123455",
        "법과대학" : "#66fffe",
        "자율전공부" : "#29845b",
        "No Degree" : "#0f0f0e"
    }
    $.getJSON("../../../json/" + filename, (jsonData) => {
        var keys = Object.keys(color1);
        var pre = "";
        var len = jsonData.length;

        for(var i=0; i<len; i++){
            if(jsonData[i].category == "입학후전입")    
                jsonData[i].color = color1[(jsonData[i].from).trim()];
            else{
                if(pre == jsonData[i].from.trim()) continue
                pre = jsonData[i].from.trim();
                jsonData.push({
                    "from" : jsonData[i].from,
                    "color" : color1[jsonData[i].from.trim()]
                });

                jsonData.push({
                    "to" : jsonData[i].to,
                    "color" : color1[jsonData[i].to.trim()]
                });
            }            
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
        chart.dataFields.color = "color";
    
        //chart.links.template.propertyFields.id = "id";
        chart.links.template.colorMode = "solid";
        chart.links.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        chart.links.template.fillOpacity = 0.1;
        chart.links.template.tooltipText = "";
    
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

        // make nodes draggable
        var nodeTemplate = chart.nodes.template;
        nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
        nodeTemplate.showSystemTooltip = true;
        nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer
    
    }); // end am4core.ready()
}

