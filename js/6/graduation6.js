var level = {};
var yearRange = [];
var data = [];

//path of data file
const folder_path = "../../json/6/";

function getData(){
    for (let year = 2010; year < 2020; ++year) {
        const file_name = String(year) + "_graduation.json";
        data.push(loadJSON(folder_path + file_name));
    }
}

function setYearRange(start, end) {
    for (let i = start; i <= end; ++i) {
        yearRange.push(i);
    }
}

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
    let data;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.response.length > 0 || xhr.status == 200) {
                data = JSON.parse(xhr.responseText);
            }
        }
        // else{
        //     error(xhr);
        // }
    }
    xhr.open("GET", path, false);
    xhr.send();
    return data;
}

function clickFormSelection(input_type, name, value) {
    //deprecated
    //event by clicked radio
    // if (input_type == "radio") {
    //     switch (name) {
    //         case "radio_degree":
    //             level["degree"] = value;
    //             break;
    //         case "radio_gender":
    //             level["gender"] = value;
    //             break;
    //         //TODO, if there are another radios, add here
    //         default:
    //     }
    // }

    //event by clicked select
    if (input_type == "select") {
        switch (name) {
            case "select_gender":
                level["gender"] = value;
                break;
            case "select_degree":
                level["degree"] = value;
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
    //get the key string represent that
    //the number of student, bachelor, master, phd who is man or woman or all 
    var value = level["degree"];
    var gender;
    switch (level["gender"]) {
        case "all":
            gender = "all";
            break;
        case "male":
            gender = "man";
            break;
        case "female":
            gender = "woman";
            break;
    }
    if (gender != "all") {
        value += "_" + gender;
    }

    ret = [];
    var year = 2010;
    var cnts = [];
    // var majorNames = [];
    var idx = 0;
    for (let i = 0; i < data.length; ++i) {
        //filter the data by department class
        if (level["major_class"] != "all") {
            data[i] = data[i].filter(element => element.major_class == level["major_class"]);
        }
        var temp = getCoreData(data[i], value).sort(function (a, b) {
            //sort order by desc
            return getIntegerValue(b) - getIntegerValue(a);
        });

        while (temp.length > level["num_selected"]) {
            temp.pop();
        }

        year_cnt = [];
        for (let j = 0; j < temp.length; ++j) {
            if (j == 0 || j == temp.length - 1)
                year_cnt.push(idx);
            let obj = {};
            obj["year"] = String(year);
            obj["major"] = String(year) + "_" + temp[j].major;
            obj[value] = temp[j][value];
            ret.push(obj);
            ++idx;
        }
        cnts.push(year_cnt);
        year += 1;
        //ret.push(temp);
    }

    return [ret, value, cnts];
}

function getFontSize() {
    switch (Number(level["num_selected"])) {
        case 3:
            return 12;
        case 5:
            return 8;
        case 10:
            return 6;
        case 15:
            return 7;
        case 20:
            return 7;
        default:
            return 10;
    }
}

function setChartdivHeight(num_column) {
    var chartdiv = document.getElementById("chartdiv");
    var height;
    if (num_column <= 3)
        height = "500";
    else if (num_column <= 5)
        height = "600";
    else if (num_column <= 10)
        height = "700";
    else if (num_column <= 15)
        height = "800";
    else if (num_column <= 20)
        height = "900";
    else
        height = "500";
    chartdiv.style.height = String(height) + "px";
}

function getLabelX() {
    switch (Number(level["num_selected"])) {
        case 3:
            return -180;
        case 5:
            return -130;
        case 10:
            return -110;
        case 15:
            return -150;
        case 20:
            return -150;
        default:
            return -180;
    }
}

function getLabelY() {
    switch (Number(level["num_selected"])) {
        case 3:
            return -5;
        case 5:
            return 0;
        case 10:
            return 2;
        case 15:
            return 5;
        case 20:
            return 7;
        default:
            return -5;
    }
}


function drawChart(input) {
    console.log(input);
    //get the proper data for selection(options: degree, gender, class of major)
    var ret = getProperDataForSelection(input)
    var data = ret[0];
    console.log(data);
    //value means the number of student, bachelor, master, phd
    var value = ret[1];
    var cnts = ret[2];
    //console.log(data);
    //console.log(value);
    //setChartdivHeight(data.length);

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add data
        chart.data = data;

        // Create axes
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        yAxis.dataFields.category = "major";
        yAxis.renderer.grid.template.location = 0;
        yAxis.renderer.labels.template.fontSize = getFontSize();
        yAxis.renderer.minGridDistance = 5;
        yAxis.renderer.inversed = true;
        yAxis.renderer.labels.template.adapter.add("textOutput", function (text) {
            return text.replace(/[0-9]*[_]/, "");
        })

        var xAxis = chart.xAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = value;
        series.dataFields.categoryY = "major";
        series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
        series.columns.template.strokeWidth = 0;
        series.columns.template.adapter.add("fill", function (fill, target) {
            if (target.dataItem) {
                // let idx;
                // if(idx = getYearInfo(target.dataItem.dataContext.year)){
                //     return chart.colors.getIndex(idx - 1);
                // }
                switch (target.dataItem.dataContext.year) {
                    case "2010":
                        return chart.colors.getIndex(0);
                    case "2011":
                        return chart.colors.getIndex(1);
                    case "2012":
                        return chart.colors.getIndex(2);
                    case "2013":
                        return chart.colors.getIndex(3);
                    case "2014":
                        return chart.colors.getIndex(4);
                    case "2015":
                        return chart.colors.getIndex(5);
                    case "2016":
                        return chart.colors.getIndex(6);
                    case "2017":
                        return chart.colors.getIndex(7);
                    case "2018":
                        return chart.colors.getIndex(8);
                    case "2019":
                        return chart.colors.getIndex(9);
                }
            }
            return fill;
        });

        // Add ranges
        function addRange(label, start, end, color) {
            var range = yAxis.axisRanges.create();
            range.category = start;
            range.endCategory = end;
            range.label.text = label;
            range.label.disabled = false;
            range.label.fill = color;
            range.label.location = 0;
            range.label.dx = getLabelX();
            range.label.dy = getLabelY();
            range.label.fontWeight = "bold";
            range.label.fontSize = 12;
            range.label.horizontalCenter = "left"
            range.label.inside = true;

            range.grid.stroke = am4core.color("#396478");
            range.grid.strokeOpacity = 1;
            range.grid.location = 1;
            range.tick.length = 200;
            range.tick.strokeOpacity = 0.6;
            range.tick.stroke = am4core.color("#396478");
            range.tick.location = 1;

            range.locations.category = 1;
        }

        let cellSize = 15;
        chart.events.on("datavalidated", function (ev) {

            // Get objects of interest
            let chart = ev.target;
            let categoryAxis = chart.yAxes.getIndex(0);

            // Calculate how we need to adjust chart height
            let adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

            // get current chart height
            let targetHeight = chart.pixelHeight + adjustHeight;

            // Set it on chart's container
            chart.svgContainer.htmlElement.style.height = targetHeight + "px";
        });

        for (let year = 2010; year < 2020; ++year) {
            let idx = year - 2010;
            addRange(String(year), data[cnts[idx][0]].major, data[cnts[idx][1]].major, chart.colors.getIndex(idx));
        }

    }); // end am4core.ready()
}