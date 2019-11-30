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
function getCoreData(data, value) {
    var ret = [];
    data.forEach(function (element) {
        if (element[value] > 0) {
            let obj = {};
            obj["major"] = element.major;
            obj["percent"] = parseInt(element[value]/ element[level["degree"]] * 100, 10);
            obj["gender"] = element[value];
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
    var value = level["degree"] + "_" + level["gender"];

    var ret = getCoreData(data, value).sort(function (a, b) {
        //sort order by desc
        return b["percent"] - a["percent"];
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

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "major";
        series.dataFields.valueX = "percent";
        series.columns.template.tooltipText = "전공: {categoryY}\n비율: {valueX}\n전체 인원수: {total_headcount}";
        series.columns.template.fillOpacity = .8;

        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color("#FFFFFF");
        series.tooltip.autoTextColor = false;
        series.tooltip.label.fill = am4core.color("#000000");

        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{percent}%  n = {gender}";
        labelBullet.label.fontSize = 12;
        labelBullet.label.dx = 40;
    });
}