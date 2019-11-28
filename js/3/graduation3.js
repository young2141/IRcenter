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
    loadJSON(path, function (data){
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

    var year = ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
    var checkForLastYear = [];
    for (let i = 0; i < input.length; ++i) {
        var year_info = new Object();
        var rank = 0;

        year_info["year"] = year[i];
        dataOfYear = input[i].data;
        for (let j = 0; j < 10; ++j) {
            ++rank;
            major = dataOfYear[j].major;

            let idx = series.findIndex((item, idx) => {
                return item == major;
            });

            //case 1:
            //series was not find
            if (idx == -1) {
                series.push(major);
                var seriesName = name + (series.length - 1);
                year_info[seriesName] = rank;
                //year_info[seriesName+"ShowTooltip"] = true;
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
                    "year": year
                });
            }
        }
        data.push(year_info);
    }
    return [series, data, checkForLastYear];
}

//mark the tooltip for last year
function markLastYear(data, checkForLastYear, namesOfSeries) {
    const seriesPrefix = "series";
    for (let i = 0; i < checkForLastYear.length; ++i) {
        let seriesName = seriesPrefix + i;
        let major = namesOfSeries[i];
        console.log(name);
        for (let j = 0; j < checkForLastYear.length; ++j) {
            if (checkForLastYear[j].major != major) continue;
            var year = checkForLastYear[j].year;
            for (let k = 0; k < data.length; ++k) {
                if (data[k].year == year) {
                    data[k][seriesName + "ShowTooltip"] = true;
                }
            }
        }
    }
    return data;
}

//generate data for chart and then use it for chart.
function genDataForAllInOne(data) {
    console.log("raw " + data);
    for (var i = 0; i < 9; ++i)
        sortData(data[i].data, gender);
    console.log("sorted "+ data);

    var returns = genDataForChart(data);
    var namesOfSeries = returns[0];
    var data = returns[1];
    var checkForLastYear = returns[2];

    data = markLastYear(data, checkForLastYear, namesOfSeries);

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

            //the bullet, points of data insertion on a series for x-axis.
            var bullet = series.bullets.push(new am4charts.CircleBullet());
            //console.log(bullet);
            bullet.strokeWidth = 10;
            bullet.tooltipText = namesOfSeries[i];
            bullet.propertyFields.alwaysShowTooltip = seriesName + "ShowTooltip";

            //the label of bullet, marking the rank for each year.
            var valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{valueY}";
        }
    });
}