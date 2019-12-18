const path = "../../../json/등록/복수전공/";
var filename;
var raw_data;
var level = {};
var color = [];

function init() {
    level["ordered"] = getSelectedbox("sel_ord");
    level["semester"] = getSelectedbox("sel_sbs");

    filename = level["semester"];
    filename = filename.slice(0, 4) + "_" + filename.slice(5, 6) + "_dualdegree.json";

    //TODO:
    //FILE IS DUMMY DATA!!!
    //MODIFY THE FILE NAME OF REAL DATA.
    raw_data = loadJSON(path + filename, success);
    executeProgram();
}

function loadJSON(path, success) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200 || xhr.response.length > 0) {
                success(JSON.parse(xhr.responseText));
            }
        }
    }
    xhr.open("GET", path);
    xhr.send();
}

function success(data) {
    raw_data = data;
    executeProgram();
}

function sortByMajor(a, b) {
    return a["major1"] > b["major1"] ? 1 : (a["major1"] < b["major1"] ? -1 : (a["major2"] > b["major2"] ? 1 : -1));
}

function sortByDivision(a, b) {
    return a["div_major1"] > b["div_major1"] ?
        1 : (a["div_major1"] < b["div_major1"] ?
            -1 : (a["div_major2"] > b["div_major2"] ?
                1 : (a["div_major2"] < b["div_major2"] ? -1 : sortByMajor(a, b))));
}

function sortByFrequency(a, b) {
    return a["total"] > b["total"] ?
        -1 : (a["total"] < b["total"] ? 1 : sortByMajor(a, b));
}

function sortData(data) {
    if (level["ordered"] == "major") {
        data = data.sort((a, b) => { return sortByMajor(a, b) });
    } else if (level["ordered"] == "division") {
        data = data.sort((a, b) => { return sortByDivision(a, b) });
    }
    else {
        data = data.sort((a, b) => { return sortByFrequency(a, b) });
    }
    return data;
}

function addColor(data){
    getColorsByDvisions()
}

function executeProgram() {
    let data = raw_data.slice(0);
    sortData(data);
    addColor(data);
    drawChart(data);
}