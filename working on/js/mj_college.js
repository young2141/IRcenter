function chart() {
    var year = document.getElementById("years").value;

    $.getJSON("../../../json/mj_college.json", jsonData => {       
        drawPyramid(jsonData[year]);
    });
}

function drawPyramid(_data) {
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
    function createMale(data, color, flag, menucondition) {
        var maleChart = container.createChild(am4charts.XYChart);
        maleChart.width = am4core.percent(30);
        if (flag == false)
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
        maleSeries.dataFields.valueX = "male";
        maleSeries.fill = "#0000ff";
        maleSeries.stroke = "#0000ff";
        maleSeries.strokeWidth = 3;
        maleSeries.dataFields.categoryY = "type";
        maleSeries.interpolationDuration = 1000;
        maleSeries.columns.template.tooltipText = "{type}의 남자는 {male}명입니다.";
        maleSeries.sequencedInterpolation = true;

        var maleserieslabel = maleSeries.bullets.push(new am4charts.LabelBullet());
        maleserieslabel.label.text = "{valueX}";
        maleserieslabel.label.truncate = false;
        maleserieslabel.label.fill = menucondition;
        maleserieslabel.label.dx = -20;
        return chart;
    }

    function createLabel(text, menucondtion) {
        var label = container.createChild(am4core.Label);
        label.width = am4core.percent(15);
        label.height = 70;
        label.padding(30, 5, 2, 5);

        label.text = text;
        label.fontSize = 15;
        label.fill = menucondtion;
        if (menucondtion == "#ff0000") {
            label.fontWeight = "bold";
        }
        label.textAlign = "middle";

        return chart;
    }
    function createFemale(data, color, flag, menucondition) {
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
        femaleSeries.dataFields.valueX = "female";
        femaleSeries.fill = "#ffff00";
        femaleSeries.stroke = "#ffff00";
        femaleSeries.strokeWidth = 3;
        femaleSeries.sequencedInterpolation = true;
        femaleSeries.columns.template.tooltipText = "{type}의 여자는 {female}명입니다.";
        femaleSeries.dataFields.categoryY = "type";

        var femaleSerieslabel = femaleSeries.bullets.push(new am4charts.LabelBullet());
        femaleSerieslabel.label.text = "{valueX}";
        femaleSerieslabel.label.truncate = false;
        femaleSerieslabel.label.fill = menucondition;
        femaleSerieslabel.label.dx = 20;
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
        pieSeries.slices.template.stroke = "#ffffff";

        // chart.chartContainer.minHeight = 40;
        // chart.chartContainer.minWidth = 40;

        return chart;
    }

    var typename = ["humanities", "society", "science", "economy", "mechanic", "IT", "farm", "art", "teach", "pet", "life", "nurse", "medicine", "admin", "law", "medical", "dental", "etc"];
    var typename_kr = ["인문대학", "사회과학대학", "자연과학대학", "경상대학", "공과대학", "IT대학", "농업생명과학대학", "예술대학", "사범대학", "수의과대학", "생활과학대학",
        "간호대학", "약학대학", "행정학부", "법학전문대학원", "의과대학", "치과대학", "부속기관"];
    var cond = $("select[name=menu]").val();

    var flag = true;
    for (var i = 0; i < typename.length; i++) {
        if (i == typename.length - 1)
            flag = false;
        if (cond == "전체") {
            createMale([_data[typename[i]]], "#0000ff", flag, "#000000");
            createLabel(typename_kr[i], "#000000");
            createFemale([_data[typename[i]]], "#ffff00", flag, "#000000");            
        }
        else {
            if (typename_kr[i] == cond) {
                createMale([_data[typename[i]]], "#0000ff", flag, "#ff0000");
                createLabel(typename_kr[i], "#ff0000");
                createFemale([_data[typename[i]]], "#ffff00", flag, "#ff0000");
            }
            else {
                createMale([_data[typename[i]]], "#0000ff", flag, "#000000");
                createLabel(typename_kr[i], "#000000");
                createFemale([_data[typename[i]]], "#ffff00", flag, "#000000");
            }
        }
        createPie([{ "type": "male", "value": _data[typename[i]]["male"], "color": "#0000ff" }, { "type": "female", "value": _data[typename[i]]["female"], "color": "#ffff00" }]);
    }

}