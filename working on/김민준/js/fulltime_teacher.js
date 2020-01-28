function chart1() {
    $("chartdiv1").empty();
    $.getJSON("../json/fulltime_teacher_one_person.json", jsonData => {
        drawHeight(jsonData);
    });
}

function chart2() {
    $("chartdiv2").empty();
    $.getJSON("../json/fulltime_teacher_secure_rate.json", jsonData => {
        drawCurved(jsonData);
    });
}

function drawHeight(data) {
    var cond1 = $("input:radio[name=chk_info]:checked").val();
    var cond2 = $("select[name=menu]").val();
    var condname_kr = {
        "all": "전체", "society": "인문사회계열", "science": "자연과학계열", "tech": "공학계열", "medical": "의학계열", "artphysical": "예체능계열",
        "limit": "학생정원기준", "student": "재학생기준"
    };

    am4core.ready(function () {

        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv1", am4charts.XYChart);
        chart.data = data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMin = 0.15;
        valueAxis.extraMax = 0.15;
        valueAxis.strictMatrix = false;

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = cond2 + "_" + cond1; // 총 지원자 수
        series.dataFields.categoryX = "year";

        series.columns.template.strokeWidth = 0;
        //series.columns.template.stroke = am4core.color(_valueY_RGB); //색상
        //series.columns.template.fill = am4core.color(_valueY_RGB); // 색상

        var bullet = series.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fff"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#000 bold]" + condname_kr[cond1] + "[]\n" + "[#000]{year}학년도 " + condname_kr[cond2] + "의 전임교원 1인당 학생수는[#000 bold]{valueY}명[#000] 입니다.";
    }); // end iter callback function
}

function drawCurved(data) {
    var cond1 = $("input:radio[name=chk_info]:checked").val();
    var cond2 = $("select[name=menu]").val();
    var condname_kr = {
        "all": "전체", "society": "인문사회계열", "science": "자연과학계열", "tech": "공학계열", "medical": "의학계열", "artphysical": "예체능계열",
        "limit": "학생정원기준", "student": "재학생기준"
    };

    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("chartdiv2", am4charts.XYChart);
        chart.data = data;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMin = 0.15;
        valueAxis.extraMax = 0.15;
        valueAxis.strictMinMax = false;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = cond2 + "_" + cond1;
        series.dataFields.categoryX = "year";
        series.strokeOpacity = 1;
        series.strokeWidth = 2;
        //series.stroke = am4core.color(clr);

        var bullet = series.bullets.push(new am4charts.Bullet());
        //bullet.fill = am4core.color("#cde34f"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#000 bold]" + condname_kr[cond1] + "[]\n" + "[#000]{year}학년도 " + condname_kr[cond2] + "의 전임교원확보율은[#000 bold]{valueY}%[#000] 입니다.";

        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        //circle.fill = am4core.color("#cde34f");
        circle.strokeWidth = 3;
    });
}