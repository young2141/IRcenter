var mode
var mode2
var chart
var universities
var key_dict = {}

function parse(callback) {
    $.getJSON("../../../json/domestic.json", json => {
        callback(json);
    });
}
function draw_map(input_mode, mode2) {
    parse(json => {
        universities = json;

        mode = input_mode;
        // mode2 = $("#university_selectbar option:selected").val();

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
                var chart = am4core.create("chartdiv", am4maps.MapChart);

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
                chart.chartContainer.wheelable = false;

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
                marker.verticalCenter = "bottom";

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
                    imageSeriesTemplate.tooltipText = "{title}의 파견 인원은 {파견}명입니다.";
                else
                    imageSeriesTemplate.tooltipText = "{title}의 초청 인원은 {초청}명입니다.";
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
            })
        }); // end am4core.ready()
    });

}