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
        let obj = {};
        obj["major_class"] = element.major_class;
        obj["major"] = element.major;
        obj[value] = element[value];
        ret.push(obj);
    });
    return ret;
}

//to get the core key of object
function getIntegerValue(obj) {
    for (let key in obj) {
        //the value of key is number, return it
        //in other words, this is the number of student, bachelor, master, phd who is man or woman or all
        if (typeof (obj[key]) == "number") {
            return obj[key];
        }
    }
}

function getProperDataForSelection(data) {
    //filter the data by department class
    if (level["major_class"] != "all") {
        data = data.filter(element => element.major_class == level["major_class"]);
    }

    //get the key string represent that
    //the number of student, bachelor, master, phd who is man or woman or all 
    var value = level["degree"];
    var gender;
    switch (level["gender"]) {
        case "male":
            gender = "man";
            break;
        case "female":
            gender = "woman";
            break;
        case "all":
            gender = "all";
    }
    if (gender != "all") {
        value += "_" + gender;
    }

    var ret = getCoreData(data, value).sort(function (a, b) {
        //sort order by desc
        return getIntegerValue(b) - getIntegerValue(a);
    });

    while (ret.length > level["num_selected"]) {
        ret.pop();
    }

    return [ret, value];
}

function getFontSize() {
    switch (Number(level["num_selected"])) {
        case 10:
            return 18;
        case 20:
            return 15;
        case 30:
            return 13
        case 50:
            return 12;
        case 70:
            return 10;
        default:
            return 10;
    }
}

function setChartdivHeight(num_column) {
    var chartdiv = document.getElementById("chartdiv");
    var height;
    if (num_column <= 10)
        height = "300";
    else if (num_column <= 20)
        height = "400";
    else if (num_column <= 30)
        height = "500";
    else if (num_column <= 50)
        height = "700";
    else if (num_column <= 70)
        height = "900";
    else
        height = "700"
    chartdiv.style.height = String(height) + "px";
}

function drawChart(input) {
    //get the proper data for selection(options: degree, gender, class of major)
    var ret = getProperDataForSelection(input)
    var data = ret[0];
    //value means the number of student, bachelor, master, phd
    var value = ret[1];
    //console.log(data);
    setChartdivHeight(data.length);

    //chart
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "major";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.inversed = true;
        categoryAxis.fontSize = getFontSize();

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "major";
        series.dataFields.valueX = value;
        series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
        series.columns.template.fillOpacity = .8;
    });
}