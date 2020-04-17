var jdata = []

function parse1(callback) {
    $.getJSON("../../../json/대학분류.json", json1 => {
        callback(json1);
    });
}

function parse2(callback, path) {
    $.getJSON("../../../json/" + path, json2 => {
        callback(json2);
    });
}

function check_data(json, major_dict, year, affiliation, type) {
    var result = []
    var obj_temp = {}
    var keys = []
    var keys2 = []
    var mj = ["간호대학","경상대학","공과대학","과학기술대학","농업생명과학대학","법과대학","사범대학","사회과학대학","생태환경대학","생활과학대학","수의과대학","약학대학","예술대학","의과대학","인문대학","자연과학대학","치과대학","IT대학","단과대구분없음"]
    for (var i = 0; i < json.length; i++) {
        if(json[i].year!=year)continue;
        

        keys = Object.keys(json[i])

        for(var k = 0; k<mj.length;k++){
            obj_temp = {
                "col":"",
                "재학생": 0,
                "총":0,
                "수혜인원": 0,
                "수혜율": 0
            }

            
            for (var j = 0; j < keys.length; j++) {
                if (keys[j] == "year" || major_dict[keys[j]]!=mj[k]) continue 
                obj_temp["col"] = mj[k]
                obj_temp["재학생"] += json[i][keys[j]]["재학생"]
                obj_temp["수혜인원"] += json[i][keys[j]]["수혜인원"]
                // if(mj[k]=="과학기술대학")
                //     alert(keys[j] + " "+json[i][keys[j]]["수혜인원"])

                keys2 = Object.keys(json[i][keys[j]])
                for (var n = 0; n < keys2.length; n++) {
                    if (keys2[n] != "재학생" && keys2[n] != "수혜인원") {
                        if ($.inArray(keys2[n], type) != -1)
                            obj_temp["총"] += json[i][keys[j]][keys2[n]]
                    }
                }

            }
            obj_temp["총"] = obj_temp["총"]*0.001
            obj_temp["수혜율"] = (obj_temp["수혜인원"] * 100 / obj_temp["재학생"]).toFixed(2)

            result.push(obj_temp)




        }
        


        
    }

    return result
}

function draw_graph(_year, _sem, _aff, _type) {
    parse1(json1=> {

        parse2(json2 => {

            jdata = check_data(json2, json1, _year, _aff, _type)
            var studentmax=jdata[0].재학생
            var studentmin=jdata[0].재학생
            var moneymax=jdata[0].총
            var moneymin=jdata[0].총
            for(var i =0;i<jdata.length;i++){
                if(jdata[i].재학생>studentmax){
                    studentmax= jdata[i].재학생
                }
                if(jdata[i].재학생<studentmin){
                    studentmin= jdata[i].재학생
                }
                if(jdata[i].총>moneymax){
                    moneymax= jdata[i].총
                }
                if(jdata[i].총<moneymin){
                    moneymin= jdata[i].총
                }

            }

            am4core.ready(function() {
                am4core.useTheme(am4themes_animated);

                var container = am4core.create("chartdiv2", am4core.Container);
                container.layout = "grid";
                container.fixedWidthGrid = false;
                container.width = am4core.percent(100);
                container.height = am4core.percent(100);

                // Functions that create various sparklines
                function createMale2(data, color, flag, menucondition) {
                    var json=[]
                    json.push(data)
                    var maleChart = container.createChild(am4charts.XYChart);
                    maleChart.width = am4core.percent(30);
                    if (flag == false)
                        maleChart.height = 110;
                    else
                        maleChart.height = 70;

                    maleChart.data = json;
                    maleChart.padding(20, 5, 2, 5);

                    var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
                    maleCategoryAxis.dataFields.category = "col";
                    maleCategoryAxis.renderer.grid.template.location = 0;
                    maleCategoryAxis.renderer.labels.template.hide();
                    maleCategoryAxis.renderer.labels.template.fontSize = 0;
                    maleCategoryAxis.renderer.minGridDistance = 1;

                    var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
                    maleValueAxis.renderer.inversed = true;
                    maleValueAxis.min = 0
                    maleValueAxis.max = studentmax*1.25
                    maleValueAxis.strictMinMax = true;

                    maleCategoryAxis.renderer.grid.template.disabled = true;
                    maleCategoryAxis.renderer.axisFills.template.disabled = true;
                    maleCategoryAxis.renderer.ticks.template.disabled = true;

                    maleValueAxis.renderer.axisFills.template.disabled = true;
                    maleValueAxis.renderer.grid.template.disabled = true;
                    maleValueAxis.renderer.ticks.template.disabled = true;
                    maleValueAxis.renderer.labels.template.disabled = flag;

                    var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
                    maleSeries.dataFields.valueX = "재학생";
                    maleSeries.fill = color;
                    maleSeries.stroke = color;
                    maleSeries.strokeWidth = 3;
                    maleSeries.dataFields.categoryY = "col";
                    maleSeries.interpolationDuration = 1000;
                    maleSeries.columns.template.tooltipText = "{col}의 재학생 수는 {재학생}명입니다.";
                    maleSeries.sequencedInterpolation = true;

                    var maleSerieslabel = maleSeries.bullets.push(new am4charts.LabelBullet());
                    maleSerieslabel.label.text = "{valueX}";
                    maleSerieslabel.label.truncate = false;
                    maleSerieslabel.label.fill = menucondition;
                    if (menucondition == "#ff0000") {
                        maleSerieslabel.label.fontSize = 20;
                        maleSerieslabel.label.fontWeight = "bold";
                    }
                    maleSerieslabel.label.dx = -25;
                    //return chart2;
                }

                function createLabel2(id, text, menucondtion) {
                    $('<div id=' + id + ">");
                    var label = container.createChild(am4core.Label);
                    label.width = am4core.percent(15);
                    label.height = 70;
                    label.padding(35, 5, 2, 5);

                    label.text = text;
                    label.fontSize = 15;
                    label.fill = menucondtion;
                    if (menucondtion == "#ff0000") {
                        label.fontWeight = "bold";
                        label.fontSize = 20;
                    }
                    label.textAlign = "middle";
                    $('</div>');
                    //return chart2;
                }
                function createFemale2(data, color, flag, menucondition) {
                    var json=[]
                    json.push(data)
                    var femaleChart = container.createChild(am4charts.XYChart);
                    femaleChart.width = am4core.percent(30);
                    femaleChart.marginRight = 50
                    if (flag == false)
                        femaleChart.height = 110;
                    else
                        femaleChart.height = 70;

                    femaleChart.data = json;

                    femaleChart.padding(20, 5, 2, 5);

                    var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
                    femaleCategoryAxis.dataFields.category = "col";
                    femaleCategoryAxis.renderer.opposite = true;
                    femaleCategoryAxis.renderer.grid.template.location = 0;
                    femaleCategoryAxis.renderer.minGridDistance = 15;
                    femaleCategoryAxis.renderer.labels.template.fontSize = 0;

                    var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
                    femaleValueAxis.min = 0
                    femaleValueAxis.max = moneymax*1.5
                    femaleValueAxis.strictMinMax = true;

                    femaleCategoryAxis.renderer.grid.template.disabled = true;
                    femaleCategoryAxis.renderer.axisFills.template.disabled = true;
                    femaleCategoryAxis.renderer.ticks.template.disabled = true;

                    femaleValueAxis.renderer.axisFills.template.disabled = true;
                    femaleValueAxis.renderer.grid.template.disabled = true;
                    femaleValueAxis.renderer.ticks.template.disabled = true;
                    femaleValueAxis.renderer.labels.template.disabled = flag;

                    // Create series
                    var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
                    femaleSeries.dataFields.valueX = "총";
                    femaleSeries.fill = color;
                    femaleSeries.stroke = color;
                    femaleSeries.strokeWidth = 3;
                    femaleSeries.sequencedInterpolation = true;
                    femaleSeries.columns.template.tooltipText = "{col}의 장학금 지급 금액 {총}천원 입니다.";
                    femaleSeries.dataFields.categoryY = "col";

                    var femaleSerieslabel = femaleSeries.bullets.push(new am4charts.LabelBullet());
                    femaleSerieslabel.label.text = "  {valueX}";
                    femaleSerieslabel.label.truncate = false;
                    femaleSerieslabel.label.fill = menucondition;
                    if (menucondition == "#ff0000") {
                        femaleSerieslabel.label.fontSize = 20;
                        femaleSerieslabel.label.fontWeight = "bold";
                    }
                    femaleSerieslabel.label.dx = 60;
                    femaleSerieslabel.label.textAlign = "left"
                    //return chart2;
                }

                function createPie2(data) {
                    var chart = container.createChild(am4charts.PieChart);
                    chart.width = am4core.percent(10);
                    chart.height = 70;
                    chart.padding(20, 5, 2, 5);

                    chart.data = data;

                    // Add and configure Series
                    var pieSeries = chart.series.push(new am4charts.PieSeries());
                    pieSeries.dataFields.value = "value";
                    pieSeries.dataFields.category = "type";
                    pieSeries.labels.template.disabled = true;
                    pieSeries.ticks.template.disabled = true;
                    pieSeries.slices.template.propertyFields.fill = "color";
                    //pieSeries.slices.template.stroke = "#ffffff";

                    // chart.chartContainer.minHeight = 40;
                    // chart.chartContainer.minWidth = 40;

                    //return chart2;
                }

                function createBottom2() {
                    var label1 = container.createChild(am4core.Label);
                    label1.width = am4core.percent(30);
                    label1.height = 30;
                    label1.padding(30, 5, 2, 5);

                    label1.text = "재학생수";
                    label1.fontSize = 30;
                    label1.fontWeight = "bold";
                    label1.textAlign = "middle";

                    var label2 = container.createChild(am4core.Label);
                    label2.width = am4core.percent(10);
                    label2.height = 30;
                    label2.padding(30, 5, 2, 5);

                    var label3 = container.createChild(am4core.Label);
                    label3.width = am4core.percent(30);
                    label3.height = 30;
                    label3.padding(30, 5, 2, 5);

                    label3.text = "장학금 지급 금액";
                    label3.fontSize = 30;
                    label3.fontWeight = "bold";
                    label3.textAlign = "middle";

                    var label4 = container.createChild(am4core.Label);
                    label4.width = am4core.percent(10);
                    label4.height = 30;
                    label4.padding(30, 5, 2, 5);

                    label4.text = "수혜율";
                    label4.fontSize = 30;
                    label4.fontWeight = "bold";
                    label4.textAlign = "middle";

                    //return chart2;
                }

                var cond = $("select[name=menu]").val();
                
                var mj = ["간호대학","경상대학","공과대학","과학기술대학","농업생명과학대학","법과대학","사범대학","사회과학대학","생태환경대학","생활과학대학","수의과대학","약학대학","예술대학","의과대학","인문대학","자연과학대학","치과대학","IT대학","단과대구분없음"]
    

                var flag = true;
                
                createBottom2();

                for (var i = 0; i < mj.length; i++) {
                    var data={}
                    for (var j = 0; j < mj.length; j++) {
                        if(mj[i]==jdata[j].col)
                            data=jdata[j];
                    }
                    console.log(data)

                    if (i == mj.length - 1)
                        flag = false;
                    if (cond == "전체") {
                        createMale2(data, "#fcd12a", flag, "#000000");
                        createLabel2(mj[i], mj[i], "#000000");
                        createFemale2(data, "#6794dc", flag, "#000000");            
                    }
                    else {
                        if (mj[i] == cond) {
                            createMale2(data, "#fcd12a", flag, "#ff0000");
                            createLabel2(mj[i],mj[i], "#ff0000");
                            createFemale2(data, "#6794dc", flag, "#ff0000");
                        }
                        else {
                            createMale2(data, "#fcd12a", flag, "#000000");
                            createLabel2(mj[i],mj[i], "#000000");
                            createFemale2(data, "#6794dc", flag, "#000000");
                        }
                    }
                    createPie2([{ "type": "수혜율", "value": data.수혜율, "color": "#fcd12a" }, { "type": "비수혜율", "value": 100-data.수혜율, "color": "#6794dc" }]);
                }
                

            }); // end am4core.ready()
        }, "scholarship_" + _sem + ".json")
    })
}