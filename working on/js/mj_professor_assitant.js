function chart() {
    var year = document.getElementById("years").value;
    if ($(":input:radio[name=chk_info]:checked").val() == 'professor') {
        $.getJSON("../../../json/mj_professor.json", jsonData => {
            //var data = calrate(jsonData[year], "professor");
            drawPyramid(jsonData[year], "professor");
        });
    }
    else {
        $.getJSON("../../../json/mj_assistant.json", jsonData => {
            drawPyramid(jsonData[year], "assistant");
        });
    }   
}
/*
function calrate(_data, flag, year) {
    var result;
    console.log("year :", year)
    if (flag == "professor") {
        result = {
            "professor": {
                "type": "교수",
                "male": _data[0]["male"],
                "female": _data[0]["female"],
                "malerate": _data[0]["male"] * 100 / (_data[0]["male"] + _data[0]["female"]),
                "femalerate": 100 - _data[0]["male"] * 100 / (_data[0]["male"] + _data[0]["female"])
            }
            ,
            "associate": {
                "type": "부교수",
                "male": _data[1]["male"],
                "female": _data[1]["female"],
                "malerate": _data[1]["male"] * 100 / (_data[1]["male"] + _data[1]["female"]),
                "femalerate": 100 - _data[1]["male"] * 100 / (_data[1]["male"] + _data[1]["female"])
            },
            "assistant": {
                "type": "조교수",
                "male": _data[1]["male"],
                "female": _data[1]["female"],
                "malerate": _data[2]["male"] * 100 / (_data[2]["male"] + _data[2]["female"]),
                "femalerate": 100 - _data[2]["male"] * 100 / (_data[2]["male"] + _data[2]["female"])
            },
            "none": {
                "type": "비전임교수",
                "male": _data[1]["male"],
                "female": _data[1]["female"],
                "malerate": _data[3]["male"] * 100 / (_data[3]["male"] + _data[3]["female"]),
                "femalerate": 100 - _data[3]["male"] * 100 / (_data[3]["male"] + _data[3]["female"])
            }
        }
    }
    else {
        result = {
            "assistant": {
                "type": "조교",
                "male": _data[0]["male"],
                "female": _data[0]["female"],
                "malerate": _data[0]["male"] * 100 / (_data[0]["male"] + _data[0]["female"]),
                "femalerate": 100 - _data[0]["male"] * 100 / (_data[0]["male"] + _data[0]["female"])
            }
        }
    }

    console.log(JSON.stringify(result));
    return result;
}
*/
function drawPyramid(_data, flag) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var container = am4core.create("chartdiv1", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    // Functions that create various sparklines
    function createMale(data, color, flag) {
        var maleChart = container.createChild(am4charts.XYChart);
        maleChart.width = am4core.percent(30);
        if(flag == false)
            maleChart.height = 110;
        else 
            maleChart.height = 70;

        maleChart.data = data;
        maleChart.padding(20, 5, 2, 5);

        var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
        maleCategoryAxis.dataFields.category = "type";
        maleCategoryAxis.renderer.grid.template.location = 0;
        maleCategoryAxis.renderer.labels.template.hide();
        maleCategoryAxis.renderer.labels.template.fontSize = 0;
        maleCategoryAxis.renderer.minGridDistance = 15;

        var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
        maleValueAxis.renderer.inversed = true;
        maleValueAxis.min = 0;
        maleValueAxis.max = 100;
        maleValueAxis.strictMinMax = true;
        maleValueAxis.numberFormatter = new am4core.NumberFormatter();
        maleValueAxis.numberFormatter.numberFormat = "#.#'%'";

        maleValueAxis.renderer.grid.template.disabled = true;
        maleValueAxis.renderer.baseGrid.disabled = true;
        maleValueAxis.renderer.labels.template.disabled = flag;
        maleValueAxis.cursorTooltipEnabled = false;

        var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
        maleSeries.dataFields.valueX = "malerate";
        maleSeries.fill = color;
        maleSeries.stroke = maleSeries.fill;
        maleSeries.dataFields.categoryY = "type";
        maleSeries.interpolationDuration = 1000;
        //maleSeries.columns.template.tooltipText = "Males, age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
        //maleSeries.sequencedInterpolation = true;

        return chart;
    }

    function createLabel(text) {
        var label = container.createChild(am4core.Label);
        label.width = am4core.percent(15);
        label.height = 70;
        label.padding(30, 5, 2, 5);

        label.text = text;
        label.fontSize = 15;
        label.textAlign = "middle";

        return chart;
    }
    function createFemale(data, color, flag) {
        var femaleChart = container.createChild(am4charts.XYChart);
        femaleChart.width = am4core.percent(30);
        if (flag == false)
            femaleChart.height = 110;
        else
            femaleChart.height = 70;

        femaleChart.data = data;

        femaleChart.padding(20, 5, 2, 5);

        var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
        femaleCategoryAxis.dataFields.category = "type";
        femaleCategoryAxis.renderer.opposite = true;
        femaleCategoryAxis.renderer.grid.template.location = 0;
        femaleCategoryAxis.renderer.minGridDistance = 15;
        femaleCategoryAxis.renderer.labels.template.fontSize = 0;

        var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
        femaleValueAxis.min = 0;
        femaleValueAxis.max = 100;
        femaleValueAxis.strictMinMax = true;
        femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
        femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";

        femaleValueAxis.renderer.grid.template.disabled = true;
        femaleValueAxis.renderer.baseGrid.disabled = true;
        femaleValueAxis.renderer.labels.template.disabled = flag;
        femaleValueAxis.cursorTooltipEnabled = false;

        // Create series
        var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
        femaleSeries.dataFields.valueX = "femalerate";
        femaleSeries.fill = color;
        femaleSeries.stroke = femaleSeries.fill;
        //femaleSeries.sequencedInterpolation = true;
        //femaleSeries.columns.template.tooltipText = "Females, age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
        femaleSeries.dataFields.categoryY = "type";
       
        return chart;
    }

    function createPie(data) {
        var chart = container.createChild(am4charts.PieChart);
        chart.width = am4core.percent(10);
        chart.height = 70;
        chart.padding(20, 5, 2, 5);

        chart.data = data;

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "type";
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
        pieSeries.slices.template.propertyFields.fill = "color";
        //pieSeries.slices.template.adapter.add("fill", function () { return color[1] });
        pieSeries.slices.template.stroke = am4core.color("#fff");

        // chart.chartContainer.minHeight = 40;
        // chart.chartContainer.minWidth = 40;

        return chart;
    }

    if (flag == "professor") {
        var typename = ["professor", "associate", "assistant", "none"];
        var typename_kr = ["교수", "부교수", "조교수", "비전임교수"];
        var flag = true;
        for (var i = 0; i < typename.length; i++) {
            if (i == typename.length - 1)
                flag = false;
            createMale([_data[typename[i]]], "#0000ff", flag);
            createLabel(typename_kr[i]);
            createFemale([_data[typename[i]]], "#ffff00", flag);
            createPie([{ "type": "male", "value": _data[typename[i]]["malerate"], "color": "#0000ff" }, { "type": "female", "value": _data[typename[i]]["femalerate"], "color": "#ffff00" }]);
        }
    }
    else {
        createMale([_data["assistant"]], "#0000ff", false);
        createLabel("조교");
        createFemale([_data["assistant"]], "#ffff00", false);
        createPie([{ "type": "male", "value": _data["assistant"]["malerate"], "color": "#0000ff" }, { "type": "female", "value": _data["assistant"]["femalerate"], "color": "#ffff00" }]);
    }
}