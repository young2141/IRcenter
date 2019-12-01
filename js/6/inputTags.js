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
            case "select_num_selected":
                level["num_selected"] = value;
                break;
            //TODO, if there are another selects, add here
            default:
        }
    }

    //처리 전 데이터
    var preData = rawData.slice(0);
    createCheckboxes(preData);
    //chart에 적절한 데이터 값
    var processedData = getDataForChart(preData);
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

function createCheckboxes(input) {
    var checkboxes = document.getElementById("checkboxes");
    var allMajorsSelected = getMajorNamesForAllMajor(input).sort();

    majorInChart = allMajorsSelected;
    while (checkboxes.hasChildNodes()) {
        checkboxes.removeChild(checkboxes.firstChild);
    }

    for (let i = 0; i < allMajorsSelected.length; ++i) {
        let label = document.createElement("label");
        label.htmlFor = allMajorsSelected[i];

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = allMajorsSelected[i];
        checkbox.value = allMajorsSelected[i];
        checkbox.checked = "checked";
        checkbox.addEventListener('click', selectCheckbox);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(allMajorsSelected[i]));
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
        }

        let children = checkboxes.children;
        for (let i = 0; i < children.length; ++i) {
            var checkbox = children[i].firstChild;
            checkbox.checked = isChecked;
        }
    } else {
        isChecked = document.getElementById(whichTargetValue).checked;
        if (isChecked && !majorInChart.includes(whichTargetValue)) {
            majorInChart.push(whichTargetValue);
        } else {
            const idx = majorInChart.findIndex(whichTargetValue);
            majorInChart.splice(idx, 1);
        }
    }
    //drawChart()
}

/*////////////////////////////////////////////////////////
//     체크박스 처리관련 영역 끝
/////////////////////////////////////////////////////////*/