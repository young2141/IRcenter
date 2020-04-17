var jdata = []

function parse3(callback) {
    $.getJSON("../../../json/대학분류.json", json1 => {
        callback(json1);
    });
}

function parse4(callback, path) {
    $.getJSON("../../../json/" + path, json2 => {
        callback(json2);
    });
}

function check_data2(json, major_dict, affiliation, type) {
    var result = []
    var obj_temp = {}
    var keys = []
    var keys2 = []
    var mj = ["전체","간호대학","경상대학","공과대학","과학기술대학","농업생명과학대학","법과대학","사범대학","사회과학대학","생태환경대학","생활과학대학","수의과대학","약학대학","예술대학","의과대학","인문대학","자연과학대학","치과대학","IT대학","단과대구분없음"]
    
    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "재학생": 0,
            "총" : 0,
            "1인당" : 0
        }

        keys = Object.keys(json[i])


        for(var k = 0; k<mj.length;k++){

            for (var j = 0; j < keys.length; j++) {
                if (keys[j] == "year" || major_dict[keys[j]]!=affiliation&&affiliation != "(전체)") continue 
                obj_temp["재학생"] += json[i][keys[j]]["재학생"]

                keys2 = Object.keys(json[i][keys[j]])
                for (var n = 0; n < keys2.length; n++) {
                    if (keys2[n] != "재학생" && keys2[n] != "수혜인원") {
                        if ($.inArray(keys2[n], type) != -1)
                            obj_temp["총"] += json[i][keys[j]][keys2[n]]
                    }
                }
            }
            
            obj_temp["1인당"] = (obj_temp["총"] / obj_temp["재학생"]).toFixed(2)

        }
        


        result.push(obj_temp)
    }

    console.log(result)
    return result
}

function draw_graph2(_sem, _aff, _type) {
    parse3(json1=> {

        parse4(json2 => {


        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart);

            // Add data
            chart.data = check_data2(json2, json1,_aff,_type)
            
            // Create category axis
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.grid.template.location = 0;
            
            // Create value axis
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            //valueAxis.title.text = "Place taken";
            //valueAxis.renderer.minLabelPosition = 0.01;
            valueAxis.extraMin = 0.15;
            valueAxis.extraMax = 0.15
        

            function P1CurvedcreateSeries(value, clr) {

                var P1Cseries = chart.series.push(new am4charts.LineSeries());
                P1Cseries.dataFields.valueY = value;
                P1Cseries.strokeDasharray = "2, 2"
                P1Cseries.strokeOpacity = 1;
                P1Cseries.strokeWidth = 2;
                P1Cseries.dataFields.categoryX = "year";
                P1Cseries.stroke = am4core.color(clr);
                P1Cseries.strokeWidth = 3;

                var bullet = P1Cseries.bullets.push(new am4charts.Bullet());
                bullet.fill = am4core.color("#fff"); // tooltips grab fill from parent by default
                bullet.tooltipText = value+" {valueY}"
                var circle = bullet.createChild(am4core.Circle);
                circle.radius = 4;
                circle.fill = am4core.color(clr);
                circle.strokeWidth = 3;
            }

            P1CurvedcreateSeries("1인당", "#FE4459");            
            // var axisBreak = valueAxis.axisBreaks.create();
            //     axisBreak.startValue = 10;
            //     axisBreak.endValue = 65;
            //     axisBreak.breakSize = 0.01;
            
            }); // end am4core.ready()

        }, "scholarship_" + _sem + ".json");
    });
}