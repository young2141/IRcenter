/*////////////////////////////////////////////////////////
//     셀렉트 처리관련 영역 시작
/////////////////////////////////////////////////////////*/

//시작 시 디폴트로 체크되는 select 값 체크
function getIdSelectedSelect(select_id) {
    const select = document.getElementById(select_id);
    // console.log(select);
    for (let i = 0; i < select.length; ++i) {
        if (select[i].selected) {
            return select[i].value;
        }
    }
    return "None";
}

//Select 클릭 시 이벤트 처리 리스너
function clickFormSelection(input_type, name, value) {
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
            default:
        }
    }

    //분류 데이터 깊은 복사 및 선택 계열 데이터만 복사
    let data = dataClassifiedByMajor.slice(0).filter(element => element.major_class == level["major_class"]);
    //checkbox 생성
    createCheckboxes(data);
    //처리 결과 데이터
    processedData = getDataForChart(data);

    var value = getWhichKey();
    drawChart(processedData, value);
}

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 끝
/////////////////////////////////////////////////////////*/


/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 시작
/////////////////////////////////////////////////////////*/

//체크박스 클릭시 보이는 뷰
var expanded = false;

function getMajorNamesForCheckbox(input) {
    var ret = [];

    majorNumberInChart = [];
    for (let i = 0; i < input.length; ++i) {
        ret.push(input[i].major);
        let obj = {};
        obj[input[i].major] = i;
        majorNumberInChart.push(obj);
    }
    return ret;
}

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

function selectCheckbox(event) {
    var checkboxes = document.getElementById("checkboxes");
    var whichTargetValue = event.target.defaultValue;
    let isChecked = false;
    if (whichTargetValue == "(전체)") {
        if (document.getElementById(whichTargetValue).checked) {
            isChecked = true;
            clickFormSelection('select', 'major_class', level["major_class"]);
            return;
        } else {

            let children = checkboxes.children;
            for (let i = 0; i < children.length; ++i) {
                var checkbox = children[i].firstChild;
                checkbox.checked = isChecked;
            }
            majorInChart = [];
        }
    } else {
        isChecked = document.getElementById(whichTargetValue).checked;
        if (isChecked && !majorInChart.includes(whichTargetValue)) {
            majorInChart.push(whichTargetValue);
            majorNumberInChart[whichTargetValue] = majorNumberInChart.length;
        } else {
            const idx = majorInChart.findIndex(element => element === whichTargetValue);
            majorInChart.splice(idx, 1);
        }
    }

    //분류 데이터 깊은 복사 및 선택 계열 데이터만 복사
    let data = dataClassifiedByMajor.slice(0).filter(element => element.major_class == level["major_class"]);
    //처리 결과 데이터
    processedData = getDataForChart(data);

    var value = getWhichKey();
    drawChart(processedData, value);
}

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 끝
/////////////////////////////////////////////////////////*/