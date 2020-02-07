var mode
var mode2
var chart
var universities
var key_dict = {}

var target_year = 2018 // json 파일이 업데이트 될 때, 함께 수정

function parse(callback) {
    $.getJSON("../../../json/domestic_" + target_year + ".json", json => {
        callback(json);
    });
}

function get_stats(_json, mode) {
    var result_area1 = document.getElementById("stats_result1")
    var result_area2 = document.getElementById("stats_result2")

    _json.sort((a, b) =>
        (a[mode] > b[mode] && a[mode].toString().trim() != "-") ? -1 : (a[mode].toString().trim() != "-" ? ((b[mode] > a[mode] && b[mode].toString().trim() != "-") ? 1 : (b[mode].toString().trim() == "-" ? -1 : 0)) : 1)
        );

    var total_univ = 0
    var total_stud = 0
    for (var i = 0; i < _json.length; i++) {
        if (_json[i][mode].toString().trim() == "-") continue
        total_univ++
        total_stud += Number(_json[i][mode])
    }

    result_area1.innerHTML = target_year + "학년도 경북대학교 학생들은 총 " + total_univ + "개 타 국내대학" + (mode == "초청" ? "에서 " : "으로 ") + mode + "되었고, " + mode + "된 경북대학교 학생은 총 " + total_stud + "명입니다."
    result_area2.innerHTML = target_year + "학년도 " + mode + "된 국내대학 중 " + _json[0].title + "(으)로 " + mode + "된 학생의 비중이 " + get_percent(0) + "%(" + _json[0][mode] + "명)로 가장 많았고, "
    result_area2.innerHTML += _json[1].title + " " + get_percent(1) + "%, " + _json[2].title + " " + get_percent(2) + "%, " + _json[3].title + " " + get_percent(3) + "%, " + _json[4].title + " " + get_percent(4) + "% 순으로 많습니다."
    // 2018학년도 경북대학교 학생들은 총 257개 타 국외대학으로 파견되었고,
    // 파견된 경북대학교 학생은 총 943명입니다.

    //2018학년도 파견된 국내대학 중 제주대학교로 파견된 학생의 비중이 30%(250명)으로 가장 많았고,
    //        서울대학교 13.1%, 부산대학교 9.02%, 전남대학교 8.79%, 한국종합예술학교 6.01% 순으로 많습니다.

    function get_percent(index) {
        return (_json[index][mode] * 100 / total_stud).toFixed(2)
    }
}

function draw_map(input_mode, mode2) {
    parse(json => {
        universities = json;

        mode = input_mode;
        // mode2 = $("#university_selectbar option:selected").val();

        get_stats(json, mode)

        am4core.ready(function () {
            am4core.disposeAllCharts();
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            jQuery.getJSON("https://services.amcharts.com/ip/?v=xz6Z", function (geo) {

                var countryMaps = {
                    "KR": ["southKoreaLow"]
                };

                // calculate which map to be used
                var currentMap = countryMaps;
                if (countryMaps[geo.country_code] !== undefined) {
                    currentMap = countryMaps[geo.country_code][0];
                }

                // Create map instance
                var chart = am4core.create("chartdiv1", am4maps.MapChart);

                // Set map definition
                chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

                // Set projection
                chart.projection = new am4maps.projections.Miller();

                var restoreContinents = function () {
                    // hideCountries();
                    chart.goHome();
                };

                // Zoom control
                chart.zoomControl = new am4maps.ZoomControl();
                chart.zoomControl.align = "left"
                chart.zoomControl.marginBottom = 30;

                // 그래프 내 드래그 시 확대,축소
                chart.chartContainer.wheelable = true;

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
                imageSeriesTemplate.align = "middle";
                imageSeriesTemplate.valign = "middle";
                imageSeriesTemplate.width = 0;
                imageSeriesTemplate.height = 0;
                imageSeriesTemplate.nonScaling = true;
                imageSeriesTemplate.alwaysShowTooltip = mode2 != "전체"
                if (mode == "파견")
                    imageSeriesTemplate.tooltipText = "{title}";
                else
                    imageSeriesTemplate.tooltipText = "{title}";
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
                        if (universities[i].파견.toString().trim() == "-" || universities[i].latitude == '')
                            continue

                        uni_select.innerHTML += "<option name='' value='" + universities[i].title + "'></option>"

                        if (mode2 != "전체" && universities[i].title.trim() != mode2)
                            continue

                        imageSeries.data.push(universities[i])
                        /*
                        if (mode2 == "전체") {
                            if (universities[i].파견.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }
                        else {
                            if (universities[i].title.trim() != mode2 || universities[i].파견.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }

                        imageSeries.data.push(universities[i])
                        */
                    }
                }
                else {
                    for (var i = 0; i < universities.length; i++) {
                        if (universities[i].초청.toString().trim() == "-" || universities[i].latitude == '')
                            continue

                        uni_select.innerHTML += "<option name='' value='" + universities[i].title + "'></option>"

                        if (mode2 != "전체" && universities[i].title.trim() != mode2)
                            continue

                        imageSeries.data.push(universities[i])
                        /*
                        if (mode2 == "전체") {
                            if (universities[i].초청.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }
                        else {
                            if (universities[i].title.trim() != mode2 || universities[i].초청.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }
                        imageSeries.data.push(universities[i])
                        */
                    }
                }

                draw_map2(mode, mode2, imageSeries.data)
            })
        }); // end am4core.ready
    });

}

function draw_map2(mode, mode2, data) {
    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        jQuery.getJSON("https://services.amcharts.com/ip/?v=xz6Z", function (geo) {

            var countryMaps = {
                "KR": ["southKoreaLow"]
            };

            // calculate which map to be used
            var currentMap = countryMaps;
            if (countryMaps[geo.country_code] !== undefined) {
                currentMap = countryMaps[geo.country_code][0];
            }

            // Create map instance
            var chart = am4core.create("chartdiv2", am4maps.MapChart);

            // Set map definition
            chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

            // Set projection
            chart.projection = new am4maps.projections.Miller();

            var restoreContinents = function () {
                // hideCountries();
                chart.goHome();
            };

            // Zoom control
            chart.zoomControl = new am4maps.ZoomControl();
            chart.zoomControl.align = "left"
            chart.zoomControl.marginBottom = 30;

            // 그래프 내 드래그 시 확대,축소
            chart.chartContainer.wheelable = true;

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
            imageSeries.dataFields.value = mode;

            // define template
            var imageSeriesTemplate = imageSeries.mapImages.template;
            var circle = imageSeriesTemplate.createChild(am4core.Circle);
            circle.fillOpacity = 0.7;
            circle.fill = "#798ae4"
            circle.strokeWidth = 1;
            circle.stroke = am4core.color("#3f51b5");
            circle.verticalCenter = "middle";
            circle.horizontalCenter = "middle";

            var heat = imageSeries.heatRules.push({
                target: circle,
                property: "radius",
                min: 8,
                max: 50
            });

            // set propertyfields

            imageSeriesTemplate.propertyFields.latitude = "latitude";
            imageSeriesTemplate.propertyFields.longitude = "longitude";
            imageSeriesTemplate.horizontalCenter = "middle";
            imageSeriesTemplate.verticalCenter = "middle";
            imageSeriesTemplate.align = "middle";
            imageSeriesTemplate.valign = "middle";
            imageSeriesTemplate.width = 0;
            imageSeriesTemplate.height = 0;
            imageSeriesTemplate.alwaysShowTooltip = mode2 != "전체"
            imageSeriesTemplate.nonScaling = true;
            if (mode == "파견")
                imageSeriesTemplate.tooltipText = "{title}의 파견된 학생은 {파견}명입니다.";
            else
                imageSeriesTemplate.tooltipText = "{title}의 초청된 학생은 {초청}명입니다.";
            imageSeriesTemplate.fill = am4core.color("#000");
            imageSeriesTemplate.setStateOnChildren = true;
            imageSeriesTemplate.states.create("hover");
            imageSeriesTemplate.events.on("hit", function (ev) {
                ev.target.series.chart.zoomToMapObject(ev.target)
            });

            imageSeries.data = data
        })
    }); // end am4core.ready()


}