const path = "../../../json/등록/복수전공/";
var filename;
var data;
var level = {};
var color = {};
var division = {};

function init() {
    level["ordered"] = getSelectedbox("sel_ord");
    level["semester"] = getSelectedbox("sel_sbs");
    division["인문사회계열"] = "hs";
    division["자연과학계열"] = "ns";
    division["공학계열"] = "en";
    division["예체능계열"] = "amp";
    division["타계열"] = "dd";

    filename = level["semester"];
    filename = filename.slice(0, 4) + "_" + filename.slice(5, 6) + "_dualdegree.json";

    //TODO:
    //FILE IS DUMMY DATA!!!
    //MODIFY THE FILE NAME OF REAL DATA.
    loadJSON(path + filename, success);
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

function success(input) {
    data = input;
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

function addColor(data) {
    getColorsByDvisions();

    for (let i = 0; i < data.length; ++i) {
        data[i]["div1_color"] = am4core.color(color[division[data[i]["div_major1"]]]);
        data[i]["div2_color"] = am4core.color(color[division[data[i]["div_major2"]]]);
        if (data[i].major1 == data[i].major2 || data[i].total == 0) {
            data[i]["color"] = am4core.color("#FFFFFF");
            continue;
        }

        switch (data[i].div_major1) {
            case "인문사회계열":
                if (data[i].div_major2 == "인문사회계열") {
                    data[i]["color"] = am4core.color(color.hs);
                } else {
                    data[i]["color"] = am4core.color(color.dd);
                }
                break;
            case "자연과학계열":
                if (data[i].div_major2 == "자연과학계열") {
                    data[i]["color"] = am4core.color(color.ns);
                } else {
                    data[i]["color"] = am4core.color(color.dd);
                }
                break;
            case "공학계열":
                if (data[i].div_major2 == "공학계열") {
                    data[i]["color"] = am4core.color(color.en);
                } else {
                    data[i]["color"] = am4core.color(color.dd);
                }
                break;
            case "예체능계열":
                if (data[i].div_major2 == "예체능계열") {
                    data[i]["color"] = am4core.color(color.amp);
                } else {
                    data[i]["color"] = am4core.color(color.dd);
                }
                break;
        }

        //alpha condition
        let alpha = 1;
        if(data[i].total <10) alpha = 0.3;
        else if( data[i].total <= 20) alpha = 0.7;

        data[i]["color"].alpha = alpha;
    }
}

function executeProgram() {
    let input = data.slice(0);
    sortData(input);
    addColor(input);
    // d3_darwChart(input);
    drawChart(input);
}