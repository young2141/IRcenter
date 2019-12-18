var chart;

function selectSelectbox(id, value) {
    switch (id) {
        case "sel_ord":
            level["ordered"] = value;
            if(value == "major") {
                chart.data.sort((a,b) => {return sortByMajor(a, b)});
            }
            else if (value == "division") {
                chart.data.sort((a,b) => {return sortByDivision(a, b)});
            }
            else if (value == "frequency") {
                chart.data.sort((a,b) => {return sortByFrequency(a, b)});
            }
            
            chart.invalidateData();
            // updateGraph(value);
            // executeProgram();
            break;
        case "sel_sbs":
            level["semester"] = value;
            filename = level["semester"];
            filename = filename.slice(0, 4) + "_" + filename.slice(5, 6) + "_dualdegree.json";
            loadJSON(path + filename, success);
            break;
    }
}

function drawChart(data) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = data;
        // chart.animationDuration = 5000;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        xAxis.dataFields.category = "major2";
        xAxis.renderer.labels.template.fontSize = 10;
        xAxis.renderer.labels.template.rotation = 270;
        xAxis.renderer.labels.template.horizontalCenter = "left";
        xAxis.renderer.labels.template.verticalCenter = "middle";
        xAxis.renderer.labels.template.propertyFields.fill = "div2_color";
        xAxis.renderer.labels.template.width = 100;
        xAxis.renderer.labels.template.truncate = true;
        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 10;
        xAxis.renderer.opposite = true;

        yAxis.dataFields.category = "major1";
        yAxis.renderer.labels.template.fontSize = 10;
        yAxis.renderer.labels.template.propertyFields.fill = "div1_color";
        yAxis.renderer.labels.template.width = 100;
        yAxis.renderer.labels.template.truncate = true;
        yAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.minGridDistance = 10;
        yAxis.renderer.inversed = true;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "major2";
        series.dataFields.categoryY = "major1";
        series.dataFields.value = "total";
        // series.sequencedInterpolation = true;
        // series.defaultState.transitionDuration = 5000;
        // series.hiddenState.transitionDuration = 5000;
        // series.animationDuration = 5000;

        var column = series.columns.template;
        column.strokeOpacity = 0;
        column.width = am4core.percent(80);
        column.height = am4core.percent(80);
        column.tooltipText = "복수전공: {categoryY} + {categoryX}\n인원: {total}";
        column.propertyFields.fill = "color";
        // column.sequencedInterpolation = true;
        // column.defaultState.transitionDuration = 5000;
        // column.hiddenState.transitionDuration = 5000;
        // column.animationDuration = 5000;     
    });
}

// function updateGraph(value) {
    // if(value == "major") {
    //     data = data.sort((a,b) => {return sortByMajor(a, b)});
    // }
    // else if (value == "division") {
    //     data = data.sort((a,b) => {return sortByDivision(a, b)});
    // }
    // else if (value == "frequency") {
    //     data = data.sort((a,b) => {return sortByFrequency(a, b)});
    // }

//     chart.dataProvider = data;

//     // use Animate plugin
//     // chart.animateData( newData, { duration: 1000 } );
//   }