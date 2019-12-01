//level: 적절한 데이터 값 얻기 위한 오브젝트
var level = {};
//데이터 제공 연도
//현재 2010년 ~ 2019년
var years = [];
//rawData: JSON 파일로부터 읽어들인 처리하기 전 데이터
var rawData = [];
//allMajors: JSON 모든 파일에 있는 학과들을 모아놓은 배열
var allMajors = [];
//dataClassifiedByMajor: 학과별로 연도별 데이터를 모아둔 데이터
//object 형식:
//[ {
//    "major": ...,
//    "data": [{
//         "year": ...,
//         "bachelor": ...,
//               ...
//         },
//              ...
//         }]
//  }
//         , ...
//]
var dataClassifiedByMajor = [];
var processedData;
var majorInChart = [];
var majorNumberInChart = [];

//파일 경로
const folder_path = "../../json/6/";

/*////////////////////////////////////////////////////////
//     프로그램 시작과 동시에 raw data 읽기 시작
/////////////////////////////////////////////////////////*/

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

function getData() {
    for (let year = 2010; year < 2020; ++year) {
        const file_name = String(year) + "_graduation.json";
        rawData.push(loadJSON(folder_path + file_name));
    }
}

function programStart() {
    //시작시 셀렉트에서 디폴트로 체크된 값들을 가져와서 Level object에 저장
    level["degree"] = getIdSelectedSelect("select_degree");
    level["gender"] = getIdSelectedSelect("select_gender");
    level["major_class"] = getIdSelectedSelect("select_major_class");

    //JSON 파일을 읽어들여 rawData에 저장
    getData();

    //처리 전 데이터 깊은 복사
    let preData = rawData.slice(0);
    //데이터를 전공별로 분류
    classifyRawdataByMajor(preData);

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
//     프로그램 시작과 동시에 raw data 읽기 끝
/////////////////////////////////////////////////////////*/




/*////////////////////////////////////////////////////////
//     차트를 위한 데이터 만드는 부분 시작
/////////////////////////////////////////////////////////*/

function setYears(start, end) {
    for (let year = start; year <= end; ++year) {
        year.push(String(year));
    }
}

//raw data를 차트를 위한 데이터로 변형하기 위한 기초적인 데이터 형성
//전공별로 데이터가 분류된다.
function classifyRawdataByMajor(rawData) {
    for (let i = 0, year = 2010; i < rawData.length; ++i, ++year) {
        for (let j = 0; j < rawData[i].length; ++j) {
            //얕은 복사
            //let aData = rawData[i][j];
            //깊은 복사
            let aData = JSON.parse(JSON.stringify(rawData[i][j]));
            if (allMajors.includes(aData.major)) {
                const idx = dataClassifiedByMajor.findIndex((target) => target.major == aData.major);
                aData["year"] = String(year);
                delete aData["major"];
                delete aData["major_class"];
                dataClassifiedByMajor[idx]["data"].push(aData);
            } else {
                allMajors.push(aData.major);

                let obj = {};
                obj["major"] = aData.major;
                obj["major_class"] = aData.major_class;
                obj["data"] = [];

                aData["year"] = String(year);
                delete aData["major"];
                delete aData["major_class"];
                obj["data"].push(aData);

                dataClassifiedByMajor.push(obj);
            }
        }
    }
}

//차트를 그리기 위한 필요한 데이터만을 가져옴
function getCoreData(data, degreeAndGender) {
    var ret = [];
    var major = data.major;
    data.data.forEach(function (element) {
        let obj = {};
        obj["major"] = major;
        obj["year"] = element.year;
        obj[degreeAndGender] = element[degreeAndGender];
        // obj[major + "_" + element.year + "_" + degreeAndGender] = element[degreeAndGender];
        ret.push(obj);
    });
    return ret;
}

function getWhichKey() {
    switch (level["gender"]) {
        case "all":
            return level["degree"];
        case "male":
            return level["degree"] + "_" + "man";
        case "female":
            return level["degree"] + "_" + "woman";
    }
}

//학과 계열에 따른 데이터 생성 함수
function getDataForChart(data) {
    //chart를 위한 데이터 생성 결과 값
    var ret = [];

    //JSON 파일로부터 받아온 데이터 파일의 어떤 키 값을 가져올지를 받아오는지를 알려주는 값이 value
    //예를 들어, 학사 남자, 학사 여자, 학사 전체, ... 등
    //이런 키 값을 가져오기 위한 변수
    var degreeAndGender = getWhichKey();

    //필요 전공 계열(인문사회, 자연과학, 공학, 예체능) 데이터만 뽑아냄
    data = data.filter(element => majorInChart.includes(element.major));

    for (let i = 0; i < 1; ++i) {
    // for (let i = 0; i < data.length; ++i) {
        data[i] = getCoreData(data[i], degreeAndGender);
        for (let j = 0; j < data[i].length; ++j) {
            ret.push(data[i][j]);
        }
    }

    // //i는 2010년부터 2019년까지의 총 데이터
    // for (let i = 0, year = 2010; i < input.length; ++i, ++year) {
    //     //원하는 값만 받아옴
    //     //예를 들어서, JSON 데이터에서 학사 데이터만 필요하면 bachelor 데이터만 뽑아오고,
    //     //석사 남성 데이터만 필요하면 bachelor_man 데이터를 뽑아온다
    //     data[i] = getCoreData(data[i], degreeAndGender);

    //     //각 데이터에 연도 값을 넣어줌
    //     for (let j = 0; j < rawData[i].length; ++j) {
    //         rawData[i][j]["year"] = String(year);
    //         ret.push(rawData[i][j]);
    //     }
    // }
    return ret;
}



/*////////////////////////////////////////////////////////
//     차트를 위한 데이터 만드는 부분 끝
/////////////////////////////////////////////////////////*/