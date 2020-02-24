const path = "../../json/학위수여_3_학위수여10.json";
var chart,
    data,
    degree = "학사",
    gender = "(전체)",
    lastest_year = 2019,
    displayed_major = [],
    //처음과 마지막에 라벨 표현하기 위한 마킹오브젝트
    marking_for_major = {};



//파일 읽어오기
function loadJSON(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.responseText.length > 0) {
                success(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

//가장 처음 실행되는 함수
function init() {
    loadJSON(path, function (_data) {
        data = _data.slice(0);
        _data = processDataForChart();
        drawChart(_data);
    });
}

//인풋에 따라 데이터 조건 값이 변경될 시, 차트를 새로 그리지 않고 있는 차트의 데이터값을 변경해줌
function reloadChart(_data) {
    marking_for_major = {};
    var series = chart.series.values;
    chart.data = _data;
    //차트의 모든 시리즈를 보이지 않게 설정하여, 이후 필요한 개수만큼만 활성화하여 표현해준다.
    series.forEach(s => s.diabled = true);

    displayed_major.forEach((major, i) => {
        //시리즈가 표현되는 전공의 수보다 적은 경우 시리즈를 생성해준다.
        if (series.length < i + 1) {
            //series creation and then push it "chart object" by series
            let series = chart.series.push(new am4charts.LineSeries());
            series.data = _data.filter(e => e["major"] == major);
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = "rank";
            series.strokeWidth = 9;

            var label_bullet = series.bullets.push(new am4charts.LabelBullet());
            label_bullet.label.text = major;
            label_bullet.label.adapter.add("text", (text, target, key) => {
                let dataItem = target.dataItem;
                let year = dataItem.dataContext["year"];
                let major = dataItem.dataContext["major"];
                if (dataItem && (year == marking_for_major[major]["first"] || year == marking_for_major[major]["final"])) {
                    target.dy = 25;
                    return text;
                } else {
                    return "";
                }
            });

            //the bullet, points of data insertion on a series for x-axis.
            var bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.strokeWidth = 17;

            //the label of bullet, marking the rank for each year.
            var valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{valueY}";

            marking_for_major[major] = {};
            marking_for_major[major]["first"] = series.data[series.data.length - 1]["year"];
            marking_for_major[major]["final"] = series.data[0]["year"];

            if (gender != "(전체)") {
                bullet.tooltipText = "{categoryX}학년도 {major}" + gender + " " + degree + " 학위수여자는 {value}명으로, 학위수여자가 " + "{valueY}" + "번째로 많은 전공입니다.";
            } else {
                bullet.tooltipText = "{categoryX}학년도 {major} " + degree + " 학위수여자는 {value}명으로, 학위수여자가 " + "{valueY}" + "번째로 많은 전공입니다.";
            }
        } 
        // 기존에 있는 시리즈를 이용할 시 데이터를 변경과 필요한 부분에 대해 변경해준다.
        else {
            series[i].disabled = false;
            series[i].data = _data.filter(e => e["major"] == major);

            marking_for_major[major] = {};
            marking_for_major[major]["first"] = series[i].data[series[i].data.length - 1]["year"];
            marking_for_major[major]["final"] = series[i].data[0]["year"];


            let label_bullet = series[i].bullets.values[0];
            label_bullet.label.text = major;

            //불렛은 총 3가지가 있는데 그 중 원불렛에 대한 툴팁만 변경해준다.
            bullet = series[i].bullets.values[1];
            if (gender != "(전체)") {
                bullet.tooltipText = "{categoryX}학년도 {major}" + gender + " " + degree + " 학위수여자는 {value}명으로, 학위수여자가 " + "{valueY}" + "번째로 많은 전공입니다.";
            } else {
                bullet.tooltipText = "{categoryX}학년도 {major} " + degree + " 학위수여자는 {value}명으로, 학위수여자가 " + "{valueY}" + "번째로 많은 전공입니다.";
            }
        }
    });
}

//셀렉트 또는 라디오 인풋에 대한 처리 함수
function onClickListerner(name, value) {
    if (name == "학위") {
        degree = value;
    } else if (name == "성별") {
        gender = value;
    }
    let _data = processDataForChart();
    reloadChart(_data);
}

function processDataForChart() {
    let _data = [];
    displayed_major = [];

    //json에서 로드한 data 중 필요한 데이터만 추출
    data.forEach(e => {
        let obj = {};
        obj["year"] = e["연도"].toString();
        obj["major"] = e["전공"].trim();
        obj["value"] = 0;
        Object.keys(e).map(key => {
            if (key != "연도" && key != "전공" && key.includes(degree)) {
                if (gender == "(전체)") {
                    obj["value"] += e[key];
                } else if (gender != "(전체)" && key.includes(gender.substr(0, 1))) {
                    obj["value"] = e[key];
                }
            }
        });
        _data.push(obj);
    });

    let graph_data = [];

    //연도별로 가장 인원이 많은 10개 학과를 추출
    for (let year = lastest_year; year > lastest_year - 10; --year) {
        let year_data = _data.filter(e => e["year"] == year);
        year_data = year_data.sort((a, b) => { return a["value"] - b["value"] < 0 ? 1 : -1 }).slice(0, 10);
        let rank = 1;
        year_data.map(e => {
            e["rank"] = rank++;
            graph_data.push(e)
        });
    }

    graph_data.forEach(e => {
        if (!displayed_major.includes(e["major"])) {
            displayed_major.push(e["major"]);
        }
    });

    return graph_data;
}

function drawChart(_data) {
    am4core.ready(function () {
        chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = _data;

        //x축 구현
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.grid.template.disabled = true;

        //y축 구현
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inversed = true;
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.baseGrid.disabled = true;

        //초기 데이터에 대한 필요한 개수만큼 시리즈를 생성해준다.
        for (let i = 0; i < displayed_major.length; ++i) {
            let major = displayed_major[i];

            //series creation and then push it "chart object" by series
            let series = chart.series.push(new am4charts.LineSeries());
            series.data = _data.filter(e => e["major"] == major);
            series.dataFields.categoryX = "year";
            series.dataFields.valueY = "rank";
            series.strokeWidth = 9;

            //하나의 전공 시리즈에 대한 처음과 끝의 원 불렛에 대한 라벨을 표현해주기 위함
            marking_for_major[major] = {};
            marking_for_major[major]["first"] = series.data[series.data.length - 1]["year"];
            marking_for_major[major]["final"] = series.data[0]["year"];

            var label_bullet = series.bullets.push(new am4charts.LabelBullet());
            label_bullet.label.text = major;
            label_bullet.label.adapter.add("text", (text, target, key) => {
                let dataItem = target.dataItem;
                let year = dataItem.dataContext["year"];
                let major = dataItem.dataContext["major"];
                if (dataItem && (year == marking_for_major[major]["first"] || year == marking_for_major[major]["final"])) {
                    target.dy = 25;
                    return text;
                } else {
                    return "";
                }
            });

            //원 불렛을 생성해주고 필요한 툴팁을 넣어준다.
            var bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.strokeWidth = 17;
            if (gender != "(전체)") {
                bullet.tooltipText = "{categoryX}학년도 {major}" + gender + " " + degree + " 학위수여자는 {value}명으로, 학위수여자가 " + "{valueY}" + "번째로 많은 전공입니다.";
            } else {
                bullet.tooltipText = "{categoryX}학년도 {major} " + degree + " 학위수여자는 {value}명으로, 학위수여자가 " + "{valueY}" + "번째로 많은 전공입니다.";
            }
            series.tooltip.pointerOrientation = "vertical";

            //원 불렛 안에 랭크를 표현해주기 위한 라벨 불렛
            var valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{valueY}";
        }
    });
}