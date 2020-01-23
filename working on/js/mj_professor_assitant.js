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
        maleChart.padding(2, 5, 2, 5);

        var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
        maleCategoryAxis.dataFields.category = "type";
        maleCategoryAxis.renderer.grid.template.location = 0;
        maleCategoryAxis.renderer.labels.template.hide();
        maleCategoryAxis.renderer.labels.template.fontSize = 0;
        maleCategoryAxis.renderer.minGridDistance = 15;

        var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
        maleValueAxis.renderer.inversed = true;
        maleValueAxis.min = 0;
        maleValueAxis.max = 1500;
        maleValueAxis.strictMinMax = true;

        maleValueAxis.renderer.grid.template.disabled = true; //가운데줄
        maleValueAxis.renderer.baseGrid.disabled = true;
        maleValueAxis.renderer.labels.template.disabled = flag; //valueaxis

        //maleValueAxis.cursorTooltipEnabled = false;

        var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
        maleSeries.dataFields.valueX = "male";
        maleSeries.fill = color;
        maleSeries.stroke = maleSeries.fill;
        maleSeries.dataFields.categoryY = "type";
        maleSeries.interpolationDuration = 1300;
        maleSeries.columns.template.tooltipText = "{type}의 남자는 {male}명입니다.";
        maleSeries.sequencedInterpolation = true;

        var maleserieslabel = maleSeries.bullets.push(new am4charts.LabelBullet());
        maleserieslabel.label.text = "{valueX}";
        maleserieslabel.label.truncate = false;
        maleserieslabel.label.dx = -20;

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

        femaleChart.padding(2, 5, 2, 5);

        var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
        femaleCategoryAxis.dataFields.category = "type";
        femaleCategoryAxis.renderer.opposite = true;
        femaleCategoryAxis.renderer.grid.template.location = 0;
        femaleCategoryAxis.renderer.minGridDistance = 15;
        femaleCategoryAxis.renderer.labels.template.fontSize = 0;

        var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
        femaleValueAxis.min = 0;
        femaleValueAxis.max = 1500;
        femaleValueAxis.baseInterval = 500;
        femaleValueAxis.strictMinMax = true;

        femaleValueAxis.renderer.grid.template.disabled = true;
        femaleValueAxis.renderer.baseGrid.disabled = true;
        femaleValueAxis.renderer.labels.template.disabled = flag;
        femaleValueAxis.cursorTooltipEnabled = false;

        // Create series
        var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
        femaleSeries.dataFields.valueX = "female";
        femaleSeries.fill = color;
        femaleSeries.stroke = femaleSeries.fill;
        femaleSeries.sequencedInterpolation = false;
        femaleSeries.columns.template.tooltipText = "{type}의 여자는 {female}명입니다.";
        femaleSeries.dataFields.categoryY = "type";

        var femaleserieslabel = femaleSeries.bullets.push(new am4charts.LabelBullet());
        femaleserieslabel.label.text = "{valueX}";
        femaleserieslabel.label.truncate = false;
        femaleserieslabel.label.dx = 20;

        return chart;
    }

    function createPie(data) {
        var chart = container.createChild(am4charts.PieChart);
        chart.width = am4core.percent(10);
        chart.height = 70;
        chart.padding(2, 5, 2, 5);

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
        var typename_kr = ["교수", "부교수", "조교수", "비전임교원"];
        var flag = true;
        for (var i = 0; i < typename.length; i++) {
            if (i == typename.length - 1)
                flag = false;
            createMale([_data[typename[i]]], "#0000ff", flag);
            createLabel(typename_kr[i]);
            createFemale([_data[typename[i]]], "#ffff00", flag);
            createPie([{ "type": "male", "value": _data[typename[i]]["male"], "color": "#0000ff" }, { "type": "female", "value": _data[typename[i]]["female"], "color": "#ffff00" }]);
        }
    }
    else {
        createMale([_data["assistant"]], "#0000ff", false);
        createLabel("조교");
        createFemale([_data["assistant"]], "#ffff00", false);
        createPie([{ "type": "male", "value": _data["assistant"]["male"], "color": "#0000ff" }, { "type": "female", "value": _data["assistant"]["female"], "color": "#ffff00" }]);
    }
}