//const localPath = "http://localhost:80/data/graduation3/Top10";
const localPath = "../../json/3/Top10";
var degree = "bachelor";
var gender = "total";

//load JSON files by pure javascript methods
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

//sort the data for each year
//and then rearrange by the 'standard' number.
function sortData(data, standard) {
    data.sort(function (a, b) {
        return a[standard] < b[standard] ? 1 : a[standard] > b[standard] ? -1 : 0;
    });
    //console.log(data);
}

function checkRadioButton(name, id) {
    //the type of check
    //1. change of degree
    //2. change of gender
    switch (name) {
        case "학위":
            if (id == "T1") {
                degree = "masters";
            }
            else if (id == "T1") {
                degree = "bachelor";
            }
            else {
                degree = "phd";
            }
            //change of file path
            path = localPath + degree + ".json";
            break;
        case "menu":
            gender = id;
    }
    loadJSON(path, function (data) {
        genDataForAllInOne(data);
    })
}

//make the data for usage in this process
//data:
//[
//    {
//   "year":
//   "data":[
//              ...  
//          ]
//    },
//  ...
//]
function genDataForChart(input) {
    const name = "series";
    var series = [];
    var data = [];

    var year = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
    var int_year = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
    var checkForLastYear = [];
    var checkForFirstYear = [];
    var firstYearMajors = [];
    var headCount = [];

    for (let i = 0; i < input.length; ++i) {
        var year_info = new Object();
        var rank = 0;

        year_info["year"] = year[i];
        dataOfYear = input[i].data;
        let headCountObj = {};
        headCountObj["year"] = year[i];
        headCountObj["info"] = [];

        for (let j = 0; j < 10; ++j) {
            ++rank;
            let headCountDepartment = {};
            major = dataOfYear[j].major;
            headCountDepartment["major"] = major;
            headCountDepartment["headcount"] = dataOfYear[j][gender];
            headCountObj["info"].push(headCountDepartment);

            let idx = series.findIndex(
                (item) => {
                    return item == major;
                });

            //case 1:
            //series was not find
            if (idx == -1) {
                series.push(major);
                var seriesName = name + (series.length - 1);
                year_info[seriesName] = rank;
                if (i == 0) {
                    firstYearMajors.push(major);
                    checkForFirstYear[seriesName] = int_year[i] - 2010;
                }
            }
            //case 2:
            //series found
            else {
                var seriesName = name + idx;
                year_info[seriesName] = rank;
                //year_info[seriesName+"ShowTooltip"] = false;
            }

            //the process, make the data marking the tooltip for last year
            let isThere = false;
            let idx2;
            for (let k = 0; k < checkForLastYear.length; ++k) {
                if (checkForLastYear[k].major == major) {
                    isThere = true;
                    idx2 = k;
                    break;
                }
            }

            if (isThere) {
                checkForLastYear[idx2].year = year[i];
            } else {
                checkForLastYear.push({
                    "major": major,
                    "year": year[i]
                });
            }
        }
        data.push(year_info);
        headCount.push(headCountObj);
    }
    return [series, data, checkForLastYear, checkForFirstYear, firstYearMajors, headCount];
}

// mark the tooltip for last year
function markLastYear(data, checkForLastYear, namesOfSeries, firstYearMajors) {
    const seriesPrefix = "series";
    for (let i = 0; i < checkForLastYear.length; ++i) {
        let seriesName = seriesPrefix + i;
        if(!firstYearMajors.includes(checkForLastYear[i].major)){
            for(let j = 0;j<data.length;++j){
                if(data[j].year == checkForLastYear[i].year){
                    data[j]["series" + String(i) + "ShowTooltip"] = true;
                }
            }
        }
    }
    return data;
}

function RGB2Hexa(colors) {
    //console.log(colors);
    var r = colors["r"];
    var g = colors["g"];
    var b = colors["b"];
    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
}

//generate data for chart and then use it for chart.
function genDataForAllInOne(data) {
    for (var i = 0; i < 9; ++i)
        sortData(data[i].data, gender);

    var returns = genDataForChart(data);
    var namesOfSeries = returns[0];
    var data = returns[1];
    var checkForLastYear = returns[2];
    var checkForFirstYear = returns[3];
    var firstYearMajors = returns[4];
    var headCount = returns[5];

    data = markLastYear(data, checkForLastYear, namesOfSeries, firstYearMajors);

    //console.log(namesOfSeries);
    //console.log(data);

    //initiate for am4chart
    am4core.ready(function () {
        //setting for amcharts theme
        am4core.useTheme(am4themes_animated);

        //setting the charts at html <div id="chartdiv"></div>
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;
        chart.padding = 30;

        //x-axis for chart
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.grid.template.disabled = true;

        //y-axis for chart
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.inversed = true;
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.minGridDistance = 15;

        //the series about x and y-axis for chart
        for (let i = 0; i < namesOfSeries.length; ++i) {
            const seriesName = "series" + i;
            let major = namesOfSeries[i];
            //series creation and then push it "chart object" by series
            var series = chart.series.push(new am4charts.LineSeries());
            //console.log(series);

            //mapping x, y axis data of the series to chart x, y axis
            series.dataFields.valueY = seriesName;
            series.dataFields.categoryX = "year";

            //extra setting for series
            series.name = namesOfSeries[i];
            series.id = i;
            series.strokeWidth = 8;

            //setting for tooltip of series
            series.tooltip.fontSize = 15;
            series.tooltip.pointerOrientation = "vertical";
            series.tooltip.dy = -10;

            series.events.on("hit", (target) => {
                console.log(target._value);
            }, this);

            var label_bullet = series.bullets.push(new am4charts.LabelBullet());
            label_bullet.label.adapter.add("text", (text, target, key) => {
                if (!target.dataItem) return "";
                const index = target.dataItem.index;
                if (index == checkForFirstYear[seriesName])
                    return text;
            })
            label_bullet.label.text = major;
            label_bullet.label.dx = -5;
            label_bullet.label.dy = 20;
            label_bullet.label.fontSize = 12;
            label_bullet.label.fill = RGB2Hexa(series.fill._value);
            label_bullet.togglable = true;

            //the bullet, points of data insertion on a series for x-axis.
            var bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.strokeWidth = 10;
            bullet.tooltipText = namesOfSeries[i];
            bullet.propertyFields.alwaysShowTooltip = seriesName + "ShowTooltip";

            //the label of bullet, marking the rank for each year.
            var valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{valueY}";
        }
    });
}