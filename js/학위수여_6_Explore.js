const path = "../../json/학위수여_6_Explore.json";
var data = [];

//전공 데이터에 대한 정보
var majors = [],
    year_for_major = {},
    division_for_major = {},
    displayed_major = [],
    num_major_for_division = {};

//데이터 분류를 위한 변수들
var degree = "학사",
    division = "인문사회",
    gender = "(전체)",
    major = [];

//그래프 축 관련 변수들
const rangeYear = 10;
const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

//그래프 관련 변수들
var max = 0,
    chart_height = 100,
    chartdiv,
    container,
    chart = [];

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
function onClickListernerForSelect(name, value) {
    let _data = data.slice(0);
    switch (name) {
        case "select_gender":
            gender = value;
            _data = makeDataForGraph(_data);
            reloadGraph(_data);
            break;
        case "select_degree":
            degree = value;
            _data = makeDataForGraph(_data);
            reloadGraph(_data);
            break;
        case "select_division":
            division = value;
            displayed_major = [];
            createCheckboxes();
            _data = makeDataForGraph(_data);
            drawChart(_data);
            // resetChart(_data);
            break;
    }
}

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 시작
/////////////////////////////////////////////////////////*/

//체크박스 클릭시 보이는 뷰
var expanded = false;

//계열별 검색에서 항목 변경 시, 해당하는 계열의 전공에 대한 옵션 변경
function createCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    var selected_major = majors.filter(major => division_for_major[major] == division).sort();

    while (checkboxes.firstChild) {
        checkboxes.firstChild.remove();
    }

    //(전체) 항목에 대한 옵션 추가
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

    //변경 계열에 대한 전공 옵션 추가
    for (let i = 0; i < selected_major.length; ++i) {
        let label = document.createElement("label");
        label.htmlFor = selected_major[i];
        displayed_major.push(selected_major[i]);

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = selected_major[i];
        checkbox.value = selected_major[i];
        checkbox.checked = "checked";
        checkbox.addEventListener('click', selectCheckbox);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(selected_major[i]));
        checkboxes.appendChild(label);
    }
}

//checkbox 클릭시 펼쳐지거나/접어지는 현상 구현
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

//체크박스 옵션 클릭시 호출되는 함수
function selectCheckbox(event) {
    //checkboxes: 체크박스 tag를 id로 불러옴
    var checkboxes = document.getElementById("checkboxes");
    //whichTargetValue: 선택된 옵션의 값
    var whichTargetValue = event.target.defaultValue;
    //option: 선택된 옵션
    var option = document.getElementById(whichTargetValue);

    //선택된 옵션이 (전체)인 경우
    if (whichTargetValue == "(전체)") {
        let children = checkboxes.children;
        //해제된 상태에서 체크된 상태
        if (option.checked) {
            //해당 계열의 전공 전체를 displayed_major에 추가해주고 체크표현을 전부 해준다
            displayed_major = [];
            for (let i = 0; i < children.length; ++i) {
                if (i > 0) {
                    displayed_major.push(children[i].firstChild.getAttribute("value"));
                }
                children[i].firstChild.checked = true;
                if (i != children.length - 1) {
                    chart[i].disabled = false;
                }
            }
        }
        //체크된 상태에서 해제된 상태
        else {
            //displayed_major의 배열을 비우고, 체크표현을 전부 해제한다.
            displayed_major = [];
            for (let i = 0; i < children.length; ++i) {
                children[i].firstChild.checked = false;
                if (i != children.length - 1) {
                    chart[i].disabled = true;
                }
            }
        }
    }
    //그 외의 경우
    else {
        //해당 인덱스를 찾고, 옵션의 체크가 체크됐는지, 해제됐는지 확인을 하고 displayed_major에 추가 또는 삭제한다.
        let idx = displayed_major.findIndex(e => e == whichTargetValue);
        option.checked ? displayed_major.push(whichTargetValue) : displayed_major.splice(idx, 1);
        let chart = container.children._values;
        for (let i = 0; i < chart.length; ++i) {
            if (whichTargetValue == chart[i].data[0]["전공"]) {
                option.checked ? chart[i].disabled = false : chart[i].disabled = true;
                break;
            }
        }
    }
}

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 끝
/////////////////////////////////////////////////////////*/

function checkChangeMajor() {
    //중간에 생기거나 없어진 전공을 확인
    data.forEach(e => {
        e["연도"] = e["연도"].toString();
        if (!majors.includes(e["전공"])) {
            majors.push(e["전공"]);
            division_for_major[e["전공"]] = e["계열"]
            year_for_major[e["전공"]] = [];
        }
        year_for_major[e["전공"]].push(e["연도"]);
    });

    //만약 중간에 생기거나 없어진 전공인 경우 그 나머지 연도에 대한 데이터를 생성해줌
    Object.keys(year_for_major).map(key => {
        if (year_for_major[key].length < rangeYear) {
            for (let year = 2010; year < 2020; ++year) {
                if (!year_for_major[key].includes(year.toString())) {
                    let obj = {
                        "연도": year.toString(),
                        "전공": key,
                        "계열": division_for_major[key],
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

function checkDivisionLength() {
    var tag_division = document.getElementById("select_division");
    var children = tag_division.children;
    var divisions = [];
    for (let i = 0; i < children.length; ++i) {
        divisions.push(children[i].getAttribute("value"));
    }

    var len = [];
    len.length = divisions.length;
    for (let i = 0; i < len.length; ++i) {
        len[i] = 0;
    }

    for (let i = 0; i < majors.length; ++i) {
        for (let j = 0; j < divisions.length; ++j) {
            if (division_for_major[majors[i]] == divisions[j]) {
                len[j] += 1;
            }
        }
    }

    var max_len = 0;
    for (let i = 0; i < len.length; ++i) {
        max_len = max_len > len[i] ? max_len : len[i];
        num_major_for_division[divisions[i]] = len[i];
    }

    chart.length = max_len;
}

function makeDataForGraph(_data) {
    _data = _data.filter(e => e["계열"] == division && displayed_major.includes(e["전공"]));
    _data = _data.map(e => {
        let value = 0;
        Object.keys(e).map(key => {
            if (key.includes(degree)) {
                if (gender == "(전체)") {
                    value += e[key];
                } else if (key.includes(gender)) {
                    value += e[key];
                }
            }
        })

        let obj = {};
        obj["year"] = e["연도"];
        obj["major"] = e["전공"];
        obj["value"] = value;
        max = max > value ? max : value;
        return obj;
    });
    return _data;
}

function init() {
    loadJSON(path, (_data) => {
        data = _data.slice(0);
        checkChangeMajor();
        checkDivisionLength();
        createCheckboxes();
        _data = makeDataForGraph(_data);
        drawChart(_data);
        // resetChart(_data);
    });
}

function drawChart(_data) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        chartdiv = document.getElementById("chartdiv");
        chartdiv.style.height = displayed_major.length * chart_height + 30;

        container = am4core.create("chartdiv", am4core.Container);
        container.width = am4core.percent(100);
        container.height = displayed_major.length * chart_height + 30;
        container.layout = "vertical";
        container.autoMargins = false;

        // let dump_data = {
        //     "year": "0",
        //     "major": "dump",
        //     "value": 0
        // };

        for (let i = 0; i < displayed_major.length; ++i) {
            let chart_data = _data.filter(e => e["major"] == displayed_major[i]);
            chart[i] = container.createChild(am4charts.XYChart);
            chart[i].width = am4core.percent(95);
            chart[i].height = chart_height;
            chart[i].data = chart_data;
            chart[i].paddingBottom = 0;
            chart[i].paddingTop = 1;
            // chart[i].disabled = true;
            

            let xAxis = chart[i].xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "year";
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.labels.template.disabled = true;
            xAxis.renderer.grid.template.minGridDistance = 10;

            let yAxis = chart[i].yAxes.push(new am4charts.ValueAxis());
            yAxis.renderer.grid.template.location = 0;
            yAxis.renderer.labels.template.disabled = true;
            yAxis.min = 0;
            yAxis.max = max + 10;

            yAxis.title.text = displayed_major[i];
            yAxis.title.rotation = 0;
            yAxis.title.maxWidth = 180;
            yAxis.title.wrap = true;
            yAxis.title.width = 180;

            let series = chart[i].series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = "value";
            series.tooltip.getFillFromObject = false;
            series.tooltip.autoTextColor = false;
            series.tooltip.background.fill = am4core.color("#FFFFFF");
            series.tooltip.label.fill = am4core.color("#000000");
            // (2019)학년도 (전자공학부) (남자) (학사) 학위수여자는 ( )명입니다

            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.label.fondSize = 8;
            labelBullet.label.minGridDistance = 5;
            labelBullet.label.dy = -10;
        }
    }); // end am4core.ready()
}

function reloadGraph(_data) {
    for (let i = 0; i < displayed_major.length; ++i) {
        let chart_data = _data.filter(e => e["major"] == displayed_major[i]);
        chart[i].data = chart_data;
    }
}

function resetChart(_data) {
    chartdiv = document.getElementById("chartdiv");
    chartdiv.style.height = displayed_major.length * chart_height + 30;
    container.height = displayed_major.length * chart_height + 30;

    for (let i = 0; i < chart.length; ++i) {
        chart[i].disabled = true;
    }

    var len_major = num_major_for_division[division];
    for (let i = 0; i < len_major; ++i) {
        let chart_data = _data.filter(e => e["major"] == displayed_major[i]);
        chart[i].data = chart_data;
        chart[i].height = chart_height;
        chart[i].disabled = false;

        let xAxis = chart[i].xAxes._values[0];
        let yAxis = chart[i].yAxes._values[0];
        let series = chart[i].series._values[0];
        // series.appeared = true;

        xAxis.renderer.labels.template.disabled = true;
        if (i == displayed_major.length - 1) {
            chart[i].height = chart_height + 30;
            xAxis.renderer.labels.template.disabled = false;
        }

        let comment = "{year}학년도 {major}\n" + gender + " " + degree + " 학위수여자는 {value}명입니다."
        if (gender == "(전체)") {
            comment = "{year}학년도 {major}\n" + degree + " 학위수여자는 {value}명입니다."
        }
       
        // series.dataFields.categoryX = "year";
        // series.dataFields.valueY = "value";
        yAxis.title.text = displayed_major[i];
        series.columns.template.tooltipText = comment;
        // console.log(series.columns.template.tooltipText);
    }
}