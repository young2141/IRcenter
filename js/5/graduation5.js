var level = {};
var data;

function getIdCheckedRadio(radio_name) {
    const radio_btns = document.getElementsByName(radio_name);
    for (let i = 0; i < radio_btns.length; ++i) {
        if (radio_btns[i].checked) {
            return radio_btns[i].id;
        }
    }
    return "None";
}

function getIdSelectedCheckbox(select_id) {
    const select = document.getElementById(select_id);
    // console.log(select);
    for (let i = 0; i < select.length; ++i) {
        if (select[i].selected) {
            return select[i].value;
        }
    }
    return "None";
}


function loadJSON(path) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200 || xhr.response.length > 0) {
                data = JSON.parse(xhr.responseText);
                drawChart(data);
            }
        }
        // else{
        //     error(xhr);
        // }
    }
    xhr.open("GET", path, true);
    xhr.send();
}

function clickFormSelection(input_type, name, value) {
    //event by clicked radio
    if (input_type == "radio") {
        switch (name) {
            case "radio_degree":
                level["degree"] = value;
                break;

            //TODO, if there are another radios, add here
            default:
        }
    }

    //event by clicked select
    else if (input_type == "select") {
        switch (name) {
            case "select_gender":
                level["gender"] = value;
                break;
            case "select_major_class":
                level["major_class"] = value;
                break;
            case "select_num_selected":
                level["num_selected"] = value;
                break;
            //TODO, if there are another selects, add here
            default:
        }
    }
    drawChart(data);
}

//get the array consisted of major_class, class
//the number of student, bachelor, master, phd who is man or woman or all 
function getCoreData(data) {
    var ret = [];
    var value = level["degree"] + "_" + level["gender"];
    data.forEach(function (element) {
        if (element[value] > 0) {
            let obj = {};
            obj["major"] = element.major;
            obj["man_percent"] = parseInt(element[level["degree"] + "_man"] / element[level["degree"]] * 100, 10);
            obj["man"] = element[level["degree"] + "_man"];
            obj["woman_percent"] = 100 - obj["man_percent"];
            obj["woman"] = element[level["degree"] + "_woman"];
            obj["total_headcount"] = element[level["degree"]];
            ret.push(obj);
        }
    });
    return ret;
}

function getProperDataForSelection(data) {
    //filter the data by department class
    if (level["major_class"] != "all") {
        data = data.filter(element => element.major_class == level["major_class"]);
    }

    //get the key string represent that
    //the number of student, bachelor, master, phd who is man or woman or all 
    var ret = getCoreData(data).sort(function (a, b) {
        //sort order by desc
        return b[level["gender"] + "_percent"] - a[level["gender"] + "_percent"];
    });

    while (ret.length > level["num_selected"]) {
        ret.pop();
    }

    return ret;
}


function drawChart(input) {
    //get the proper data for selection(options: degree, gender, class of major)
    var data = getProperDataForSelection(input)
    //console.log(data);

    chartdiv.style.height = "700px";
    //chart
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "major";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.inversed = true;
        categoryAxis.fontSize = 12;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.max = 100;
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "major";
        series.dataFields.valueX = level["gender"] + "_percent";
        series.stacked = true;
        series.sequencedInterpolation = true;

        // var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        let other_gender;
        if (level["gender"] == "man") {
            series.columns.template.tooltipText = "전공: {categoryY}\n남자 비율: {valueX}\n전체 인원수: {total_headcount}";
            series.fill = am4core.color("#4B89DC");
            other_gender = "woman_percent";

            // labelBullet.label.text = "{man_percent}%  n = {man}";
        }
        else {
            series.columns.template.tooltipText = "전공: {categoryY}\n여자 비율: {valueX}\n전체 인원수: {total_headcount}";
            series.fill = am4core.color("#DB4455");
            other_gender = "man_percent";
            // labelBullet.label.text = "{woman_percent}%  n = {woman}";
        }

        // labelBullet.label.fontSize = 12;
        // labelBullet.label.dx = 40;

        series.columns.template.fillOpacity = .8;

        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color("#FFFFFF");
        series.tooltip.autoTextColor = false;
        series.tooltip.label.fill = am4core.color("#000000");

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.categoryY = "major";
        series2.dataFields.valueX = other_gender;
        series2.stacked = true;
        series2.sequencedInterpolation = true;

        series2.tooltip.getFillFromObject = false;
        series2.tooltip.background.fill = am4core.color("#FFFFFF");
        series2.tooltip.autoTextColor = false;
        series2.tooltip.label.fill = am4core.color("#000000");

        if (level["gender"] == "man") {
            series2.columns.template.tooltipText = "전공: {categoryY}\n여자 비율: {valueX}\n전체 인원수: {total_headcount}";
            series2.fill = am4core.color("#DB4455");
        }
        else {
            series2.columns.template.tooltipText = "전공: {categoryY}\n남자 비율: {valueX}\n전체 인원수: {total_headcount}";
            series2.fill = am4core.color("#4B89DC");
        }


    });
}