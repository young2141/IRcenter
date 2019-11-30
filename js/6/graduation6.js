var level = {};
var yearRange = [];
var data = [];

//path of data file
const folder_path = "../../json/6/";

function getData() {
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
    }
    xhr.open("GET", path, false);
    xhr.send();
    return data;
}

function clickFormSelection(input_type, name, value) {
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
function getCoreData(data) {
    var ret = [];
    //JSON 파일로부터 받아온 데이터 파일의 어떤 키 값을 가져올지를 받아오는지를 알려주는 값이 value
    //예를 들어, 학사 남자, 학사 여자, 학사 전체, ... 등
    //이런 키 값을 가져오기 위한 변수
    var value = getWhichKey();
    data.forEach(function (element) {
        let obj = {};
        obj["major"] = element.major;
        obj[value] = element[value];
        ret.push(obj);
    });
    return ret;
}

var expanded = false;

function showCheckBoxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

function getWhichKey() {
    var ret = level["degree"];
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
        ret += "_" + gender;
    }
    return ret;
}

function getMajorNamesForAllMajor(input) {
    var ret = [];
    ret.push("(전체)");
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[i].length; ++j) {
            if (!ret.includes(input[i][j].major)) {
                ret.push(input[i][j].major);
            }
        }
        break;
    }
    return ret;
}

//데이터 생성 함수
function getDataForChart(input) {

    //chart를 위한 데이터 생성 결과 값
    var ret = [];
    //i는 2010년부터 2019년까지의 총 데이터
    for (let i = 0, year = 2010; i < input.length; ++i, ++year) {
        //전공 계열(인문사회, 자연과학, 공학, 예체능) 등으로 먼저 분류
        input[i] = input[i].filter(element => element.major_class == level["major_class"]);
        input[i] = getCoreData(input[i]);

        //각 데이터에 연도 값을 넣어줌
        for (let j = 0; j < input[i].length; ++j) {
            input[i][j]["year"] = String(year);
            ret.push(input[i][j]);
        }
    }

    return ret;
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

function selectCheckbox(event) {
    var checkboxes = document.getElementById("checkboxes");
    var whichTargetValue = event.target.defaultValue;

    if (whichTargetValue == "(전체)") {
        let isChecked = false;
        if(document.getElementById("(전체)").checked){
            isChecked = true;
        }

        let children = checkboxes.children;
        for(let i =0;i< children.length;++i){
            var checkbox = children[i].firstChild;
            checkbox.checked = isChecked;
        }
    }else{

    }
    drawChart()
}

function createCheckboxes(input) {
    var checkboxes = document.getElementById("checkboxes");
    var allMajors = getMajorNamesForAllMajor(input).sort();

    while (checkboxes.hasChildNodes()) {
        checkboxes.removeChild(checkboxes.firstChild);
    }

    for (let i = 0; i < allMajors.length; ++i) {
        let label = document.createElement("label");
        label.htmlFor = allMajors[i];

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = allMajors[i];
        checkbox.value = allMajors[i];
        checkbox.checked = "checked";
        checkbox.addEventListener('click', selectCheckbox);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(allMajors[i]));
        checkboxes.appendChild(label);
    }
}

var result;


function drawChart(input) {
    //처리 전 데이터
    var preData = input.slice(0);
    //chart에 적절한 데이터 값
    var result = getDataForChart(preData)
    var value = getWhichKey();

    createCheckboxes(preData);

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add data
        chart.data = data;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "year";

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "year";
        series.dataFields.dataY = value;

        // // Create axes
        // var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        // yAxis.dataFields.category = "major";
        // yAxis.renderer.grid.template.location = 0;
        // yAxis.renderer.labels.template.fontSize = getFontSize();
        // yAxis.renderer.minGridDistance = 5;
        // yAxis.renderer.inversed = true;
        // yAxis.renderer.labels.template.adapter.add("textOutput", function (text) {
        //     return text.replace(/[0-9]*[_]/, "");
        // })

        // var xAxis = chart.xAxes.push(new am4charts.ValueAxis());

        // // Create series
        // var series = chart.series.push(new am4charts.ColumnSeries());
        // series.dataFields.valueX = value;
        // series.dataFields.categoryY = "major";
        // series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
        // series.columns.template.strokeWidth = 0;
        // series.columns.template.adapter.add("fill", function (fill, target) {
        //     if (target.dataItem) {
        //         // let idx;
        //         // if(idx = getYearInfo(target.dataItem.dataContext.year)){
        //         //     return chart.colors.getIndex(idx - 1);
        //         // }
        //         switch (target.dataItem.dataContext.year) {
        //             case "2010":
        //                 return chart.colors.getIndex(0);
        //             case "2011":
        //                 return chart.colors.getIndex(1);
        //             case "2012":
        //                 return chart.colors.getIndex(2);
        //             case "2013":
        //                 return chart.colors.getIndex(3);
        //             case "2014":
        //                 return chart.colors.getIndex(4);
        //             case "2015":
        //                 return chart.colors.getIndex(5);
        //             case "2016":
        //                 return chart.colors.getIndex(6);
        //             case "2017":
        //                 return chart.colors.getIndex(7);
        //             case "2018":
        //                 return chart.colors.getIndex(8);
        //             case "2019":
        //                 return chart.colors.getIndex(9);
        //         }
        //     }
        //     return fill;
        // });

        // // Add ranges
        // function addRange(label, start, end, color) {
        //     var range = yAxis.axisRanges.create();
        //     range.category = start;
        //     range.endCategory = end;
        //     range.label.text = label;
        //     range.label.disabled = false;
        //     range.label.fill = color;
        //     range.label.location = 0;
        //     range.label.dx = getLabelX();
        //     range.label.dy = getLabelY();
        //     range.label.fontWeight = "bold";
        //     range.label.fontSize = 12;
        //     range.label.horizontalCenter = "left"
        //     range.label.inside = true;

        //     range.grid.stroke = am4core.color("#396478");
        //     range.grid.strokeOpacity = 1;
        //     range.grid.location = 1;
        //     range.tick.length = 200;
        //     range.tick.strokeOpacity = 0.6;
        //     range.tick.stroke = am4core.color("#396478");
        //     range.tick.location = 1;

        //     range.locations.category = 1;
        // }

        // let cellSize = 15;
        // chart.events.on("datavalidated", function (ev) {

        //     // Get objects of interest
        //     let chart = ev.target;
        //     let categoryAxis = chart.yAxes.getIndex(0);

        //     // Calculate how we need to adjust chart height
        //     let adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

        //     // get current chart height
        //     let targetHeight = chart.pixelHeight + adjustHeight;

        //     // Set it on chart's container
        //     chart.svgContainer.htmlElement.style.height = targetHeight + "px";
        // });

        // for (let year = 2010; year < 2020; ++year) {
        //     let idx = year - 2010;
        //     addRange(String(year), data[cnts[idx][0]].major, data[cnts[idx][1]].major, chart.colors.getIndex(idx));
        // }

    }); // end am4core.ready()
}