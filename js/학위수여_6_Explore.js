const path = "../../json/학위수여_6_Explore.json";
var data = [];

//
var num_major;

//데이터 분류를 위한 변수들
var degree = "학사",
    division = "인문사회",
    gender = "(전체)",
    major = [];

//그래프 축 관련 변수들
const rangeYear = 10;
const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

//데이터 불러오기
function loadJSON(path, success) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.response.length > 0 || xhr.status == 200) {
                success(JSON.parse(xhr.responseText));
            }
        }
    }
    xhr.open("GET", path, true);
    xhr.send();
}

//Select 클릭 시 이벤트 처리 리스너
function onClickListernerForSelect(input_type, name, value) {
    let _data = data.slice(0);
    switch (name) {
        case "select_gender":
            gender = value;
            _data = makeDataForGraph(_data);
            break;
        case "select_degree":
            _data = makeDataForGraph(_data);
            degree = value;
            break;
        case "select_division":
            division = value;

            _data = makeDataForGraph(_data);
            break;
    }
    // drawChart(_data);
}

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 시작
/////////////////////////////////////////////////////////*/

//체크박스 클릭시 보이는 뷰
var expanded = false;

function createCheckboxes(input) {
    var checkboxes = document.getElementById("checkboxes");
    majorInChart = getMajorNamesForCheckbox(input).sort();

    while (checkboxes.hasChildNodes()) {
        checkboxes.removeChild(checkboxes.firstChild);
    }

    let label = document.createElement("label");
    label.htmlFor = "(전체)";

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = "(전체)";
    checkbox.value = "(전체)";
    checkbox.checked = "checked";
    checkbox.addEventListener('click', selectCheckbox);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode("(전체)"));
    checkboxes.appendChild(label);

    for (let i = 0; i < majorInChart.length; ++i) {
        let label = document.createElement("label");
        label.htmlFor = majorInChart[i];

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = majorInChart[i];
        checkbox.value = majorInChart[i];
        checkbox.checked = "checked";
        checkbox.addEventListener('click', selectCheckbox);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(majorInChart[i]));
        checkboxes.appendChild(label);
    }
}

// function showCheckBoxes() {
//     var checkboxes = document.getElementById("checkboxes");
//     if (!expanded) {
//         checkboxes.style.display = "block";
//         expanded = true;
//     } else {
//         checkboxes.style.display = "none";
//         expanded = false;
//     }
// }

// function selectCheckbox(event) {
//     var checkboxes = document.getElementById("checkboxes");
//     var whichTargetValue = event.target.defaultValue;
//     let isChecked = false;
//     if (whichTargetValue == "(전체)") {
//         if (document.getElementById(whichTargetValue).checked) {
//             isChecked = true;
//             clickFormSelection('select', 'major_class', level["major_class"]);
//             return;
//         } else {

//             let children = checkboxes.children;
//             for (let i = 0; i < children.length; ++i) {
//                 var checkbox = children[i].firstChild;
//                 checkbox.checked = isChecked;
//             }
//             majorInChart = [];
//         }
//     } else {
//         isChecked = document.getElementById(whichTargetValue).checked;
//         if (isChecked && !majorInChart.includes(whichTargetValue)) {
//             majorInChart.push(whichTargetValue);
//             majorNumberInChart[whichTargetValue] = majorNumberInChart.length;
//         } else {
//             const idx = majorInChart.findIndex(element => element === whichTargetValue);
//             majorInChart.splice(idx, 1);
//         }
//     }

//     //분류 데이터 깊은 복사 및 선택 계열 데이터만 복사
//     let data = dataClassifiedByMajor.slice(0).filter(element => element.major_class == level["major_class"]);
//     //처리 결과 데이터
//     processedData = getDataForChart(data);

//     var value = getWhichKey();
//     drawChart(processedData, value);
// }

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 끝
/////////////////////////////////////////////////////////*/



function checkChangeMajor() {
    let majors = [];
    let yearForMajor = {};
    let division = {};

    //중간에 생기거나 없어진 전공을 확인
    data.forEach(e => {
        if (!majors.includes(e["전공"])) {
            majors.push(e["전공"]);
            division[e["전공"]] = e["계열"]
            yearForMajor[e["전공"]] = [];
            num_major += 1;
        }
        yearForMajor[e["전공"]].push(e["연도"]);
    });

    //만약 중간에 생기거나 없어진 전공인 경우 그 데이터를 생성해줌
    Object.keys(yearForMajor).map(key => {
        if (yearForMajor[key].length < rangeYear) {
            for (let year = 2010; year < 2020; ++year) {
                if (!yearForMajor[key].includes(year.toString())) {
                    let obj = {
                        "연도": year.toString(),
                        "전공": key,
                        "계열": division[key],
                        "학사_남": 0,
                        "학사_여": 0,
                        "석사_남": 0,
                        "석사_여": 0,
                        "박사_남": 0,
                        "박사_여": 0
                    };
                    data.push(obj);
                }
            }
        }
    });
}

function makeDataForGraph(_data) {
    _data = _data.filter(e => e["계열"] == division);
    _data = _data.map(e => {
        let value = 0;
        Object.keys(e).map(key => {
            if (key.includes(degree)) {
                if (gender != ("전체") && key.includes(gender)) {
                    value += e[key];
                }else{
                    value += e[key];
                }
            }
        })
        return { "year": e["연도"], "major": e["전공"], "value": value };
    });
    return _data;
}

function init() {
    loadJSON(path, (_data) => {
        data = _data.slice(0);
        checkChangeMajor();
        _data = makeDataForGraph(_data);
        drawChart(_data);
    });
}

function drawChart(data, value) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv", am4core.XYChart);
        chart.data = data;

        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "year";
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 1;

        for (let i = 0, idx = 0; i < majorInChart.length; ++i, idx += 10) {
            let arr = data.slice(idx, idx + 10);

            if (i != majorInChart.length - 1) {
                xAxis.renderer.labels.template.disabled = true;
                xAxis.renderer.labels.template.align = "center";
                xAxis.renderer.labels.template.vAlign = "bottom";
                xAxis.renderer.labels.template.fontWeight = "bold";
            }

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.renderer.labels.template.disabled = true;
            yAxis.min = 0;
            yAxis.max = maxValue + 10;

            yAxis.title.text = arr[0].major;
            yAxis.title.align = "center";
            yAxis.title.valign = "middle";
            yAxis.title.rotation = 0;
            yAxis.title.paddingRight = 20;
            yAxis.title.maxWidth = 120;
            yAxis.title.wrap = true;
            yAxis.title.width = 120;
            yAxis.title.strokeWidth = 2;
            yAxis.title.fontSize = 12;


            let gender;
            switch (level["gender"]) {
                case "male":
                    gender = "남자";
                    break;
                case "female":
                    gender = "여자";
                    break;
                default:
                    gender = "";
            }

            let degree;
            switch (level["degree"]) {
                case "bachelor":
                    degree = "학사";
                    break;
                case "master":
                    degree = "석사";
                    break;
                case "phd":
                    degree = "박사";
                    break;
            }

            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = value;
            series.columns.template.tooltipText = "{categoryX}학년도 {major}\n" + gender + " " + degree + " 학위수여자는 {valueY}명입니다.";
            series.tooltip.getFillFromObject = false;

            series.tooltip.autoTextColor = false;
            series.tooltip.background.fill = am4core.color("#FFFFFF");
            series.tooltip.label.fill = am4core.color("#000000");
            // (2019)학년도 (전자공학부) (남자) (학사) 학위수여자는 ( )명입니다

            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.label.fondSize = 8;
            labelBullet.label.minGridDistance = 5;
            // labelBullet.label.wrap = true;
            labelBullet.label.dy = -7;
        }

    }); // end am4core.ready()
}