function chart() {
    $.getJSON('../json/professor_by_age_current.json', (data1) => {
        bubble_map1(data1);
    });

    $.getJSON('../json/professor_by_lecture_time.json', (data2) => {
        bubble_map2(data2);
    });

}

function bubble_map1(data) {
    $("#legend1").empty();
    var numdata = [];
    var rad = [5, 13, 21, 29, 37, 45];
    var rank = [0];
    var sz = 0;
    for (i = 0; i < data.length; i++) {
        if (data[i]["value"] != 0) {
            numdata.push(data[i]["value"]);
            ++sz;
        }
    }
    numdata = numdata.sort(function (a, b) { return a - b }); //정렬
    for (i = 0.2; i < 1; i += 0.2) { //숫자 매끄럽게 10단위로 끊음.
        if (numdata[Math.round((sz - 1) * i)] < 10)
            rank.push(numdata[Math.round((sz - 1) * i)]);
        else
            rank.push(parseInt(numdata[Math.round((sz - 1) * i)] / 10) * 10);
    }
    rank.push(numdata[sz - 1]);
    //legend생성
    var doc = document.getElementById("legend1");
    doc.innerHTML = "[연령별현황]<br>"
    for (i = 1; i <= 5; i++) {
        doc.innerHTML += "(반지름이 " + rad[i] + "인 원 그림) " + rank[i] + "명<br>";
    }
    am4core.useTheme(am4themes_animated);

    var container = am4core.create("chartdiv1", am4core.Container);
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    function createBubble1() {
        var chart = container.createChild(am4charts.XYChart);
        chart.width = am4core.percent(100);

        chart.maskBullets = false;
        chart.data = data;
        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        yAxis.dataFields.category = "prof";
        xAxis.renderer.minGridDistance = 1;
        xAxis.dataFields.category = "age";

        xAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.ticks.template.disabled = true;
        xAxis.renderer.ticks.template.disabled = true;

        yAxis.renderer.inversed = true;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "prof";
        series.dataFields.categoryX = "age";
        series.dataFields.value = "value";
        series.columns.template.disabled = true;
        series.sequencedInterpolation = true;
        //series.defaultState.transitionDuration = 3000;

        var bullet = series.bullets.push(new am4core.Circle());
        bullet.tooltipText = "{prof}, {age}세: {value.workingValue.formatNumber('#.')}명";
        bullet.strokeWidth = 3;
        bullet.adapter.add('radius', function (radius, target) {
            var values = target.dataItem.value;
            if (values == 0)
                return 0;
            else if (rank[0] < values && values < rank[1])
                return rad[0] + (rad[1] - rad[0]) * ((values - rank[0]) / (rank[1] - rank[0]));
            else if (rank[1] <= values && values < rank[2])
                return rad[1] + (rad[2] - rad[1]) * ((values - rank[1]) / (rank[2] - rank[1]));
            else if (rank[2] <= values && values < rank[3])
                return rad[2] + (rad[3] - rad[2]) * ((values - rank[2]) / (rank[3] - rank[2]));
            else if (rank[3] <= values && values < rank[4])
                return rad[3] + (rad[4] - rad[3]) * ((values - rank[3]) / (rank[4] - rank[3]));
            else if (rank[4] <= values && values < rank[5])
                return rad[4] + (rad[5] - rad[4]) * ((values - rank[4]) / (rank[5] - rank[4]));
            else if (rank[5] <= values)
                return rad[5];
        });
        bullet.adapter.add('fill', function (fill, target) {
            var X = target.dataItem.categoryX;
            if (X == "25세이하" || X == "26~30")
                return chart.colors.getIndex(0);
            else if (X == "31~35" || X == "36~40")
                return chart.colors.getIndex(1);
            else if (X == "41~45" || X == "46~50")
                return chart.colors.getIndex(2);
            else if (X == "51~55" || X == "56~60")
                return chart.colors.getIndex(3);
            else
                return chart.colors.getIndex(4);
        });
        bullet.stroke = "#ffffff";
    }

    function chrateLabel() {
        var label = container.createChild(am4core.Label);
        label.width = am4core.percent(15);

        label.text = "27\n11\n113\n"
    }
    createBubble1();
    //chrateLabel();
}

function bubble_map2(data) {
    am4core.ready(function () {
        $("#legend2").empty();
        var numdata = [];
        var cond = $(":input:radio[name=semester]:checked").val();
        var rad = [5, 13, 21, 29, 37, 45];
        var rank = [0];
        var sz = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i][cond] != 0) {
                numdata.push(data[i][cond]);
                ++sz;
            }
        }
        numdata = numdata.sort(function (a, b) { return a - b }); //정렬
        for (i = 0.2; i < 1; i += 0.2) { //숫자 매끄럽게 10단위로 끊음.
            if (numdata[Math.round((sz - 1) * i)] < 10)
                rank.push(numdata[Math.round((sz - 1) * i)]);
            else
                rank.push(parseInt(numdata[Math.round((sz - 1) * i)] / 10) * 10);
        }
        rank.push(numdata[sz - 1]);
        //legend생성
        var doc = document.getElementById("legend2");
        doc.innerHTML = "[연령별현황]<br>"
        for (i = 1; i <= 5; i++) {
            doc.innerHTML += "(반지름이 " + rad[i] + "인 원) " + rank[i] + "명<br>";
        }
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv2", am4charts.XYChart);
        chart.maskBullets = false;
        chart.data = data;
        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

        yAxis.dataFields.category = "prof";
        xAxis.renderer.minGridDistance = 1;
        xAxis.dataFields.category = "time";

        xAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.axisFills.template.disabled = true;
        yAxis.renderer.ticks.template.disabled = true;
        xAxis.renderer.ticks.template.disabled = true;

        yAxis.renderer.inversed = true;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "prof";
        series.dataFields.categoryX = "time";
        series.dataFields.value = cond;
        console.log(series.dataItem.getWorkingValue("value"));
        series.columns.template.disabled = true;
        series.sequencedInterpolation = true;
        //series.defaultState.transitionDuration = 3000;

        var bullet = series.bullets.push(new am4core.Circle());
        bullet.tooltipText = "{prof}, {time}: {value.workingValue.formatNumber('#.')}명";
        bullet.strokeWidth = 3;
        bullet.adapter.add('radius', function (radius, target) {
            var values = target.dataItem.value, r;
            if (values == 0)
                return 0;
            else if (rank[0] < values && values < rank[1])
                return rad[0] + (rad[1] - rad[0]) * ((values - rank[0]) / (rank[1] - rank[0]));
            else if (rank[1] <= values && values < rank[2])
                return rad[1] + (rad[2] - rad[1]) * ((values - rank[1]) / (rank[2] - rank[1]));
            else if (rank[2] <= values && values < rank[3])
                return rad[2] + (rad[3] - rad[2]) * ((values - rank[2]) / (rank[3] - rank[2]));
            else if (rank[3] <= values && values < rank[4])
                return rad[3] + (rad[4] - rad[3]) * ((values - rank[3]) / (rank[4] - rank[3]));
            else if (rank[4] <= values && values < rank[5])
                return rad[4] + (rad[5] - rad[4]) * ((values - rank[4]) / (rank[5] - rank[4]));
            else if (rank[5] <= values)
                return rad[5];
        });
        bullet.adapter.add('fill', function (fill, target) {
            var X = target.dataItem.categoryX;
            if (X == "1미만" || X == "1~3")
                return chart.colors.getIndex(0);
            else if (X == "4~6" || X == "7~9")
                return chart.colors.getIndex(1);
            else if (X == "10~12" || X == "13~15")
                return chart.colors.getIndex(2);
            else if (X == "16~18" || X == "19~21")
                return chart.colors.getIndex(3);
            else
                return chart.colors.getIndex(4);
        });
        bullet.stroke = "#ffffff";
    });
}