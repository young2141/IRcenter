function chart2() {
    $("chartdiv2").empty();
    var year = document.getElementById("years").value;

    $.getJSON("../../../json/professor_and_assistant_college.json", jsonData => {       
        drawPyramid2(jsonData[year]);
    });
}

function drawPyramid2(_data) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var container = am4core.create("chartdiv2", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    // Functions that create various sparklines
    function createMale2(data, color, flag, menucondition) {
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
        maleValueAxis.max = 150;
        maleValueAxis.strictMinMax = true;

        maleCategoryAxis.renderer.grid.template.disabled = true;
        maleCategoryAxis.renderer.axisFills.template.disabled = true;
        maleCategoryAxis.renderer.ticks.template.disabled = true;

        maleValueAxis.renderer.axisFills.template.disabled = true;
        maleValueAxis.renderer.grid.template.disabled = true;
        maleValueAxis.renderer.ticks.template.disabled = true;
        maleValueAxis.renderer.labels.template.disabled = flag;

        var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
        maleSeries.dataFields.valueX = "male";
        maleSeries.fill = "#0000ff";
        maleSeries.stroke = "#0000ff";
        maleSeries.strokeWidth = 3;
        maleSeries.dataFields.categoryY = "type";
        maleSeries.interpolationDuration = 1000;
        maleSeries.columns.template.tooltipText = "{type}의 남자는 {male}명입니다.";
        maleSeries.sequencedInterpolation = true;

        var maleSerieslabel = maleSeries.bullets.push(new am4charts.LabelBullet());
        maleSerieslabel.label.text = "{valueX}명";
        maleSerieslabel.label.truncate = false;
        maleSerieslabel.label.fill = menucondition;
        if (menucondition == "#ff0000") {
            maleSerieslabel.label.fontSize = 20;
            maleSerieslabel.label.fontWeight = "bold";
        }
        maleSerieslabel.label.dx = -25;
        return chart2;
    }

    function createLabel2(id, text, menucondtion) {
        $('<div id=' + id + ">");
        var label = container.createChild(am4core.Label);
        label.width = am4core.percent(15);
        label.height = 70;
        label.padding(35, 5, 2, 5);

        label.text = text;
        label.fontSize = 15;
        label.fill = menucondtion;
        if (menucondtion == "#ff0000") {
            label.fontWeight = "bold";
            label.fontSize = 20;
        }
        label.textAlign = "middle";
        $('</div>');
        return chart2;
    }
    function createFemale2(data, color, flag, menucondition) {
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
        femaleValueAxis.max = 150;
        femaleValueAxis.strictMinMax = true;

        femaleCategoryAxis.renderer.grid.template.disabled = true;
        femaleCategoryAxis.renderer.axisFills.template.disabled = true;
        femaleCategoryAxis.renderer.ticks.template.disabled = true;

        femaleValueAxis.renderer.axisFills.template.disabled = true;
        femaleValueAxis.renderer.grid.template.disabled = true;
        femaleValueAxis.renderer.ticks.template.disabled = true;
        femaleValueAxis.renderer.labels.template.disabled = flag;

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
        femaleSerieslabel.label.text = "{valueX}명";
        femaleSerieslabel.label.truncate = false;
        femaleSerieslabel.label.fill = menucondition;
        if (menucondition == "#ff0000") {
            femaleSerieslabel.label.fontSize = 20;
            femaleSerieslabel.label.fontWeight = "bold";
        }
        femaleSerieslabel.label.dx = 25;
        return chart2;
    }

    function createPie2(data) {
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

        return chart2;
    }

    function createBottom2() {
        var label1 = container.createChild(am4core.Label);
        label1.width = am4core.percent(30);
        label1.height = 30;
        label1.padding(30, 5, 2, 5);

        label1.text = "남자";
        label1.fontSize = 30;
        label1.fontWeight = "bold";
        label1.textAlign = "middle";

        var label2 = container.createChild(am4core.Label);
        label2.width = am4core.percent(15);
        label2.height = 30;
        label2.padding(30, 5, 2, 5);

        var label3 = container.createChild(am4core.Label);
        label3.width = am4core.percent(30);
        label3.height = 30;
        label3.padding(30, 5, 2, 5);

        label3.text = "여자";
        label3.fontSize = 30;
        label3.fontWeight = "bold";
        label3.textAlign = "middle";

        return chart2;
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
            createMale2([_data[typename[i]]], "#0000ff", flag, "#000000");
            createLabel2(typename[i], typename_kr[i], "#000000");
            createFemale2([_data[typename[i]]], "#ffff00", flag, "#000000");            
        }
        else {
            if (typename_kr[i] == cond) {
                createMale2([_data[typename[i]]], "#0000ff", flag, "#ff0000");
                createLabel2(typename[i],typename_kr[i], "#ff0000");
                createFemale2([_data[typename[i]]], "#ffff00", flag, "#ff0000");
            }
            else {
                createMale2([_data[typename[i]]], "#0000ff", flag, "#000000");
                createLabel2(typename[i],typename_kr[i], "#000000");
                createFemale2([_data[typename[i]]], "#ffff00", flag, "#000000");
            }
        }
        createPie2([{ "type": "male", "value": _data[typename[i]]["male"], "color": "#0000ff" }, { "type": "female", "value": _data[typename[i]]["female"], "color": "#ffff00" }]);
    }
    createBottom2();
}