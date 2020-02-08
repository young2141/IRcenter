var mode
// var mode2
var chart
var universities
var key_dict = {}

var target_year = 2018 // json 파일이 업데이트 될 때, 함께 수정

function parse(callback) {
    $.getJSON("../../../json/foreign_" + target_year + ".json", json => {
        callback(json);
    });
}

function get_stats(_json, mode) {
    var result_area1 = document.getElementById("stats_result1")
    var result_area2 = document.getElementById("stats_result2")
    var mode_eng = (mode == "초청" ? "invitation" : "disfatch")

    _json.sort((a, b) =>
        (a[mode_eng] > b[mode_eng] && a[mode_eng].toString().trim() != "-") ? -1 : (a[mode_eng].toString().trim() != "-" ? ((b[mode_eng] > a[mode_eng] && b[mode_eng].toString().trim() != "-") ? 1 : (b[mode_eng].toString().trim() == "-" ? -1 : 0)) : 1)
        );

    var total_univ = 0
    var total_stud = 0
    for (var i = 0; i < _json.length; i++) {
        if (_json[i][mode_eng].toString().trim() == "-") continue
        total_univ++
        total_stud += Number(_json[i][mode_eng])
    }

    result_area1.innerHTML = target_year + "학년도 경북대학교 학생들은 총 " + total_univ + "개 타 국외대학" + (mode == "초청" ? "에서 " : "으로 ") + mode + "되었고, " + mode + "된 경북대학교 학생은 총 " + total_stud + "명입니다."
    result_area2.innerHTML = target_year + "학년도 " + mode + "된 국외대학 중 " + _json[0].university + "(으)로 " + mode + "된 학생의 비중이 " + get_percent(0) + "%(" + _json[0][mode_eng] + "명)로 가장 많았고, "
    result_area2.innerHTML += _json[1].university + " " + get_percent(1) + "%, " + _json[2].university + " " + get_percent(2) + "%, " + _json[3].university + " " + get_percent(3) + "%, " + _json[4].university + " " + get_percent(4) + "% 순으로 많습니다."
    // 2018학년도 경북대학교 학생들은 총 257개 타 국외대학으로 파견되었고,
    // 파견된 경북대학교 학생은 총 943명입니다.

    //2018학년도 파견된 국내대학 중 제주대학교로 파견된 학생의 비중이 30%(250명)으로 가장 많았고,
    //        서울대학교 13.1%, 부산대학교 9.02%, 전남대학교 8.79%, 한국종합예술학교 6.01% 순으로 많습니다.

    function get_percent(index) {
        return (_json[index][mode_eng]* 100 / total_stud).toFixed(2)
    }
}

function draw_map(input_mode, mode2) {
    parse(json => {
        universities = json

        mode = input_mode

        // html 통계 분석
        get_stats(json, mode)

        am4core.ready(function () {
            am4core.disposeAllCharts();
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            /**
             * Define SVG path for target icon
             */
            var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

            // Create map instance
            var chart = am4core.create("chartdiv1", am4maps.MapChart);

            // Set map definition
            chart.geodata = am4geodata_worldLow;

            // Set projection
            chart.projection = new am4maps.projections.Miller();

            var restoreContinents = function () {
                // hideCountries();
                chart.goHome();
            };

            // Zoom control
            chart.zoomControl = new am4maps.ZoomControl();
            chart.zoomControl.align="left"
            chart.zoomControl.marginBottom = 30;

            var homeButton = new am4core.Button();
            homeButton.events.on("hit", restoreContinents);

            homeButton.icon = new am4core.Sprite();
            homeButton.padding(7, 5, 7, 5);
            homeButton.width = 30;
            homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
            homeButton.marginBottom = 10;
            homeButton.parent = chart.zoomControl;
            homeButton.insertBefore(chart.zoomControl.plusButton);

            // Create map polygon series
            var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

            // Exclude Antartica
            polygonSeries.exclude = ["AQ"];

            // Make map load polygon (like country names) data from GeoJSON
            polygonSeries.useGeodata = true;

            // Configure series
            var polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.strokeOpacity = 0.8;
            polygonTemplate.nonScalingStroke = true;

            // create capital markers
            var imageSeries = chart.series.push(new am4maps.MapImageSeries());

            // define template
            var imageSeriesTemplate = imageSeries.mapImages.template;
            var marker = imageSeriesTemplate.createChild(am4core.Image);
            marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
            marker.width = 15;
            marker.height = 15;
            // marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
            marker.horizontalCenter = "middle";
            marker.verticalCenter = "middle";

            // set propertyfields
            imageSeriesTemplate.propertyFields.latitude = "latitude";
            imageSeriesTemplate.propertyFields.longitude = "longitude";
            imageSeriesTemplate.horizontalCenter = "middle";
            imageSeriesTemplate.verticalCenter = "middle";
            imageSeriesTemplate.align = "center";
            imageSeriesTemplate.valign = "middle";
            imageSeriesTemplate.width = 0;
            imageSeriesTemplate.height = 0;
            imageSeriesTemplate.nonScaling = true;
            imageSeriesTemplate.alwaysShowTooltip = mode2 != "전체"
            if (mode == "파견")
                imageSeriesTemplate.tooltipText = "{university}";
            else
                imageSeriesTemplate.tooltipText = "{university}";
            imageSeriesTemplate.fill = am4core.color("#000");
            imageSeriesTemplate.setStateOnChildren = true;
            imageSeriesTemplate.states.create("hover");
            imageSeriesTemplate.events.on("hit", function (ev) {
                ev.target.series.chart.zoomToMapObject(ev.target)
            });
            imageSeries.data = []

            var uni_select = document.getElementById("university_selectbar")
            uni_select.innerHTML = "<option name='' value='전체'></option>"

            if (mode == "파견") {
                for (var i = 0; i < universities.length; i++) {
                    if (universities[i].disfatch.toString().trim() == "-" || universities[i].latitude == '')
                        continue

                    uni_select.innerHTML += "<option name='' value='" + universities[i].university + "'></option>"

                    if (mode2 != "전체" && universities[i].university.trim() != mode2)
                        continue
                
                    imageSeries.data.push(universities[i])
                
                }
            }
            else {
                for (var i = 0; i < universities.length; i++) {
                    if (universities[i].invitation.toString().trim() == "-" || universities[i].latitude == '')
                        continue

                    uni_select.innerHTML += "<option name='' value='" + universities[i].university + "'></option>"

                    if (mode2 != "전체" && universities[i].university.trim() != mode2)
                        continue

                    imageSeries.data.push(universities[i])
                
                }
            }
            draw_map2(mode, mode2, imageSeries.data)
        }); // end am4core.ready()
    });    
}


function draw_map2(mode, mode2, data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * Define SVG path for target icon
         */
        var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

        // Create map instance
        var chart = am4core.create("chartdiv2", am4maps.MapChart);

        // Set map definition
        chart.geodata = am4geodata_worldLow;

        // Set projection
        chart.projection = new am4maps.projections.Miller();

        var restoreContinents = function () {
            // hideCountries();
            chart.goHome();
        };

        // Zoom control
        chart.zoomControl = new am4maps.ZoomControl();
        chart.zoomControl.align="left"
        chart.zoomControl.marginBottom = 30;

        var homeButton = new am4core.Button();
        homeButton.events.on("hit", restoreContinents);

        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.marginBottom = 10;
        homeButton.parent = chart.zoomControl;
        homeButton.insertBefore(chart.zoomControl.plusButton);

        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Exclude Antartica
        polygonSeries.exclude = ["AQ"];

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.strokeOpacity = 0.8;
        polygonTemplate.nonScalingStroke = true;

        // create capital markers
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());
        if (mode == "파견")
            imageSeries.dataFields.value = "disfatch"
        else
            imageSeries.dataFields.value = "invitation"

        // define template
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var circle = imageSeriesTemplate.createChild(am4core.Circle);
        circle.radius = 6
        circle.fillOpacity = 0.5;
        circle.fill = "#798ae4"
        circle.strokeWidth = 0.5;
        circle.stroke = am4core.color("#3f51b5");
        circle.verticalCenter = "middle";
        circle.horizontalCenter = "middle";

        var heat = imageSeries.heatRules.push({
            target: circle,
            property: "radius",
            min: 8,
            max: 50
        });

        /*
        var label = imageSeriesTemplate.createChild(am4core.Label);
        if (mode == "파견")
            label.text = "{disfatch}";
        else
            label.text = "{invitation}";
        label.fill = am4core.color("#000");
        label.verticalCenter = "middle";
        label.horizontalCenter = "middle";
        */

        // set propertyfields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";
        imageSeriesTemplate.horizontalCenter = "middle";
        imageSeriesTemplate.verticalCenter = "middle";
        imageSeriesTemplate.align = "center";
        imageSeriesTemplate.valign = "middle";
        imageSeriesTemplate.width = 0;
        imageSeriesTemplate.height = 0;
        imageSeriesTemplate.nonScaling = true;
        imageSeriesTemplate.alwaysShowTooltip = mode2 != "전체"
        if (mode == "파견")
            imageSeriesTemplate.tooltipText = "{university}의 파견된 학생은 {disfatch}명입니다.";
        else
            imageSeriesTemplate.tooltipText = "{university}의 초청된 학생은 {invitation}명입니다.";
        imageSeriesTemplate.fill = am4core.color("#000");
        imageSeriesTemplate.setStateOnChildren = true;
        imageSeriesTemplate.states.create("hover");
        imageSeriesTemplate.events.on("hit", function (ev) {
            ev.target.series.chart.zoomToMapObject(ev.target)
        });
        imageSeries.data = data
    }); // end am4core.ready()

}
