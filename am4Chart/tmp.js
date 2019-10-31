
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
        type[i] = val[i].value
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
        
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
    
        var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
        var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
        data = []
            
        parse((json)=> {
            for(key in json){
                line = json[key]

                if(type[0] == 1){
                    var str = line["category"] + " 학사";
                    var val = line["bachelor"];
                    tmp = {}
                    tmp['name'] = str
                    tmp['value'] = val
                    data.push(tmp);
                }
                if(type[1] == 2){
                    var str = line["category"] + " 석사";
                    var val = line["master"];
                    tmp = {}
                    tmp['name'] = str
                    tmp['value'] = val
                    data.push(tmp);
                }
                if(type[2] == 3){
                    var str = line["category"] + " 박사";
                    var val = line["doctor"];
                    tmp['name'] = str
                    tmp['value'] = val
                    data.push(tmp);
                }                    
            }

        tmp = {}
        tmp['name'] = "2019"
        tmp['children'] = data
        
        networkSeries.data = [];
        networkSeries.data.push(tmp)
        console.log(networkSeries.data)
        
        // networkSeries.data = [{
        //     name: '2019',
        //         children: [{
        //         name : 't1', value : 1
        //         },{
        //         name : 't2', value : 3
        //         }
        //       ]
        // }]
    
    
        networkSeries.dataFields.linkWith = "linkWith";
        networkSeries.dataFields.name = "name";
        networkSeries.dataFields.id = "name";
        networkSeries.dataFields.value = "value";
        networkSeries.dataFields.children = "children";
        networkSeries.links.template.distance = 1;
        networkSeries.nodes.template.tooltipText = "{name}";
        networkSeries.nodes.template.fillOpacity = 1;
        networkSeries.nodes.template.outerCircle.scale = 1;
    
        networkSeries.nodes.template.label.text = "{name}"
        networkSeries.fontSize = 8;
        networkSeries.nodes.template.label.hideOversized = true;
        networkSeries.nodes.template.label.truncate = true;
        networkSeries.minRadius = am4core.percent(2);
        networkSeries.manyBodyStrength = -5;
        networkSeries.links.template.strokeOpacity = 0;
        }, year)
        
        
    
    }); // end am4core.ready()    
}