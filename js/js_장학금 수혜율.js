var jdata = []

function parse1(callback) {
    $.getJSON("../../../json/전공분류.json", json1 => {
        callback(json1);
    });
}

function parse2(callback, path) {
    $.getJSON("../../../json/" + path, json2 => {
        callback(json2);
    });
}

function check_data(json, major_dict) {
    var result = []
    var obj_temp = {}
    var keys = []
    var keys2 = []
    var mj = ["전체","인문사회계열","자연과학계열","공학계열","예체능계열","의학계열"]

    for (var i = 0; i < json.length; i++) {
        obj_temp = {
            "year": json[i]["year"],
            "재학생": 0,
            "수혜인원": 0,
            "수혜율": 0
        }

        keys = Object.keys(json[i])

        for(var k = 0; k<mj.length;k++){
            for (var j = 0; j < keys.length; j++) {
                if (keys[j] == "year" || major_dict[keys[j]]!=mj[k]&&k!=0) continue 
                obj_temp["재학생"] += json[i][keys[j]]["재학생"]
                obj_temp["수혜인원"] += json[i][keys[j]]["수혜인원"]
            }
            obj_temp[mj[k]] = (obj_temp["수혜인원"] * 100 / obj_temp["재학생"]).toFixed(2)
            obj_temp["재학생"] =0
            obj_temp["수혜인원"] =0
        }
        


        result.push(obj_temp)
    }

    return result
}

function drawChart(_sem) {
    parse1(json1=> {

        parse2(json2 => {


        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);

            // Add data
            chart.data = check_data(json2, json1)
            
            // Create category axis
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.renderer.grid.template.location = 0;
            
            // Create value axis
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            //valueAxis.title.text = "Place taken";
            //valueAxis.renderer.minLabelPosition = 0.01;
            valueAxis.extraMin = 0.15
            valueAxis.extraMax = 0.15
            

            function P1CurvedcreateSeries(value, clr) {

                var P1Cseries = chart.series.push(new am4charts.LineSeries());
                P1Cseries.dataFields.valueY = value;
                if (value != "전체") P1Cseries.strokeDasharray = "2, 2"
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

            P1CurvedcreateSeries("전체", "#FE4459"); // 전체
            P1CurvedcreateSeries("인문사회계열", "#E8A343"); // 전체
            P1CurvedcreateSeries("자연과학계열", "#FCFF57"); // 전체
            P1CurvedcreateSeries("공학계열", "#43E884"); // 전체
            P1CurvedcreateSeries("예체능계열", "#52A1FF"); // 전체
            P1CurvedcreateSeries("의학계열", "navy"); // 전체
            
            // var axisBreak = valueAxis.axisBreaks.create();
            //     axisBreak.startValue = 10;
            //     axisBreak.endValue = 65;
            //     axisBreak.breakSize = 0.01;
            
            }); // end am4core.ready()

        }, "scholarship_" + _sem + ".json");
    });
}