function chart() {
    var year = document.getElementById("years").value;

    $.getJSON("../../../json/mj_college.json", jsonData => {       
        drawPyramid(jsonData[year]);
    });
}

/*
function calrate(_data, year) {
    var typename_kr = ["인문대학", "사회과학대학", "자연과학대학", "경상대학", "공과대학", "IT대학", "농업생명과학대학", "예술대학", "사범대학", "수의과대학", "생활과학대학",
        "간호대학", "약학대학", "행정학부", "법학전문대학원", "의과대학", "치과대학", "부속기관"];

    console.log("year : ", year);
    var result = {
        "humanities": makeInnerJson(0, typename_kr[0]),
        "society": makeInnerJson(1, typename_kr[1]),
        "science": makeInnerJson(2, typename_kr[2]),
        "economy": makeInnerJson(3, typename_kr[3]),
        "mechanic": makeInnerJson(4, typename_kr[4]),
        "IT": makeInnerJson(5, typename_kr[5]),
        "farm": makeInnerJson(6, typename_kr[6]),
        "art": makeInnerJson(7, typename_kr[7]),
        "teach": makeInnerJson(8, typename_kr[8]),
        "pet": makeInnerJson(9, typename_kr[9]),
        "life": makeInnerJson(10, typename_kr[10]),
        "nurse": makeInnerJson(11, typename_kr[11]),
        "medicine": makeInnerJson(12, typename_kr[12]),
        "admin": makeInnerJson(13, typename_kr[13]),
        "law": makeInnerJson(14, typename_kr[14]),
        "medical": makeInnerJson(15, typename_kr[15]),
        "dental": makeInnerJson(16, typename_kr[16]),
        "etc": makeInnerJson(17, typename_kr[17]),
    }

    function makeInnerJson(index, val_kr) {
        var temp = new Object();

        temp.type = val_kr;
        temp.male = _data[index]["male"];
        temp.female = _data[index]["female"];
        temp.malerate = _data[index]["male"] * 100 / (_data[index]["male"] + _data[index]["female"]);
        temp.femalerate = 100 - (_data[index]["male"] * 100 / (_data[index]["male"] + _data[index]["female"]));

        return temp;
    }
    console.log(JSON.stringify(result));
    return result;
}
*/

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
        maleSeries.dataFields.valueX = "malerate";
        maleSeries.fill = color;
        maleSeries.stroke = menucondition;
        maleSeries.strokeWidth = 3;
        maleSeries.dataFields.categoryY = "type";
        maleSeries.interpolationDuration = 1000;
        maleSeries.columns.template.tooltipText = "{type}의 남자는 {male}명({malerate}%)입니다.";
        maleSeries.sequencedInterpolation = true;

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
        femaleSeries.dataFields.valueX = "femalerate";
        femaleSeries.fill = color;
        femaleSeries.stroke = menucondition;
        femaleSeries.strokeWidth = 3;
        femaleSeries.sequencedInterpolation = true;
        femaleSeries.columns.template.tooltipText = "{type}의 여자는 {female}명({femalerate}%)입니다.";
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
            createMale([_data[typename[i]]], "#0000ff", flag, "#0000ff");
            createLabel(typename_kr[i], "#000000");
            createFemale([_data[typename[i]]], "#ffff00", flag, "#ffff00");            
        }
        else {
            if (typename_kr[i] == cond) {
                createMale([_data[typename[i]]], "#0000ff", flag, "#ff0000");
                createLabel(typename_kr[i], "#ff0000");
                createFemale([_data[typename[i]]], "#ffff00", flag, "#ff0000");
            }
            else {
                createMale([_data[typename[i]]], "#0000ff", flag, "#0000ff");
                createLabel(typename_kr[i], "#000000");
                createFemale([_data[typename[i]]], "#ffff00", flag, "#ffff00");
            }
        }
        createPie([{ "type": "male", "value": _data[typename[i]]["malerate"], "color": "#0000ff" }, { "type": "female", "value": _data[typename[i]]["femalerate"], "color": "#ffff00" }]);
    }

}