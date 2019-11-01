
function parse(callback, year){
    // no data yet
    if(year <= 2018) year = 2018
    console.log(String(year))
    $.getJSON("../data/degree/json/"+String(year)+"_dgree_by_major.json", (json)=> {
        //console.log(json)
        callback(json)
    })
}


function check(){
    var val = document.getElementsByName("chk_type");
    var type = [0,0,0]
    var year = 0
    for(var i=0; i<val.length; i++){
        if(val[i].checked){
        console.log(val[i].value + "체크")
        type[i] = Number(val[i].value)
        }
        else console.log(val[i].value + "안체크")
    }
    
    var y = document.getElementsByName("chk_year");
    for(var i=0; i< y.length; i++)
        if(y[i].checked){
            console.log(y[i].value)
            year = y[i].value
            continue
        }
    callAm4core(type, year)
}

function callAm4core(type, year){
    am4core.ready(function () {
        console.log(type)
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end    
        var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
        var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())        

        bachelor = []
        master = []
        doctor = []
        parse((json)=> {
            for(key in json){
                line = json[key]

                if(type[0] == 1){
                    var str = line["category"];
                    var val = line["bachelor"];
                    if(val == 0) continue
                    tmp = {}
                    tmp['name'] = str
                    tmp['value'] = val                    
                    bachelor.push(tmp);                    
                }
                if(type[1] == 2){
                    var str = line["category"];
                    var val = line["master"];
                    if(val == 0) continue
                    tmp = {}
                    tmp['name'] = str
                    tmp['value'] = val
                    master.push(tmp);
                }
                if(type[2] == 3){
                    var str = line["category"];
                    var val = line["doctor"];
                    if(val == 0) continue
                    tmp={}
                    tmp['name'] = str
                    tmp['value'] = val
                    doctor.push(tmp);
                }                    
            }
            
        networkSeries.data = [{
            name: year
        }]
        
        if(type[0] == 1){
            tmp = {}
            tmp['name'] = "학사"
            tmp['children'] = bachelor
            networkSeries.data.push(tmp)
        }
        if(type[1] == 2){
            tmp = {}
            tmp['name'] = "석사"
            tmp['children'] = master
            networkSeries.data.push(tmp)
        }
        if(type[2] == 3){
            tmp = {}
            tmp['name'] = "박사"
            tmp['children'] = doctor
            networkSeries.data.push(tmp)
        }
        console.log(networkSeries.data)
        
        networkSeries.dataFields.linkWith = "linkWith";
        networkSeries.dataFields.name = "name";
        networkSeries.dataFields.id = "name";
        networkSeries.dataFields.value = "value";
        networkSeries.dataFields.children = "children";
        networkSeries.links.template.distance = 0;
        networkSeries.links.template.strength = 1;
        networkSeries.nodes.template.tooltipText = "{name} : {value}";
        networkSeries.nodes.template.fillOpacity = 1;
        networkSeries.nodes.template.outerCircle.strokeOpacity = 0;
        networkSeries.nodes.template.outerCircle.fillOpacity = 0;
        networkSeries.nodes.template.label.text = "{name}"
        networkSeries.fontSize = 8;
        networkSeries.minRadius = 15;
        networkSeries.nodes.template.label.hideOversized = true;
        networkSeries.nodes.template.label.truncate = true;
        networkSeries.centerStrength = 1;
        networkSeries.manyBodyStrength = -2.5;
        networkSeries.links.template.strokeOpacity = 0;
    /*
        networkSeries.dataFields.linkWith = "linkWith";
        networkSeries.dataFields.name = "name";
        networkSeries.dataFields.id = "name";
        networkSeries.dataFields.value = "value";
        networkSeries.dataFields.children = "children";
        networkSeries.links.template.distance = 1;
        networkSeries.nodes.template.tooltipText = "[#000 font-size: 15px]{value}"; 
        
        var bullet = P1Cseries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fff"); // tooltips grab fill from parent by default
            bullet.tooltipText = "[#000 font-size: 15px]{categoryX}학년도 " + value_kr + "계열의 경쟁률은 {valueY}% 입니다."

        networkSeries.nodes.template.fillOpacity = 10;
        networkSeries.nodes.template.outerCircle.scale = 0;
    
        networkSeries.nodes.template.label.text = "{name}"
        networkSeries.fontSize = 8;
        networkSeries.nodes.template.label.hideOversized = false;
        networkSeries.nodes.template.label.truncate = false;
        networkSeries.minRadius = am4core.percent(3);
        networkSeries.manyBodyStrength = -5;
        networkSeries.links.template.strokeOpacity = 0;
        */
        }, year)
        
        
    
    }); // end am4core.ready()    
}