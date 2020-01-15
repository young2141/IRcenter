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
function draw_map(input_mode) {
    parse(json => {
        universities = json;

        mode = input_mode;
        mode2 = $("#university_selectbar option:selected").val();

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
                marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
                marker.horizontalCenter = "middle";
                marker.verticalCenter = "bottom";

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


                if (mode == "파견") {
                    for (var i = 0; i < universities.length; i++) {
                        if (mode2 == "전체") {
                            if (universities[i].파견.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }
                        else {
                            if (universities[i].title.trim() != mode2 || universities[i].파견.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }

                        imageSeries.data.push(universities[i])
                    }
                }
                else {
                    for (var i = 0; i < universities.length; i++) {
                        if (mode2 == "전체") {
                            if (universities[i].초청.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }
                        else {
                            if (universities[i].title.trim() != mode2 || universities[i].초청.toString().trim() == "-" || universities[i].latitude == '')
                                continue
                        }
                        imageSeries.data.push(universities[i])
                    }
                }
            })
        }); // end am4core.ready()
    });

}










    // var sort = $(":input:radio[name=type]:checked").val();

    //     function parse(callback) {
    //         $.getJSON("../../../json/patch.json", json => {
    //             callback(json);
    //         });
    //     }
    //     function parse1(callback) {
    //         $.getJSON("../../../json/invite.json", json => {
    //             callback(json);
    //         });
    //     }
    //     // 첫화면
    //     am4core.ready(function () {
    //         // Themes begin
    //         am4core.useTheme(am4themes_animated);
    //         // Themes end

    //         jQuery.getJSON("https://services.amcharts.com/ip/?v=xz6Z", function (geo) {

    //             var countryMaps = {
    //                 "KR": ["southKoreaLow"]
    //             };

    //             // calculate which map to be used
    //             var currentMap = countryMaps;
    //             if (countryMaps[geo.country_code] !== undefined) {
    //                 currentMap = countryMaps[geo.country_code][0];
    //             }

    //             // Create map instance
    //             var chart = am4core.create("chartdiv", am4maps.MapChart);

    //             // Set map definition
    //             chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

    //             // Set projection
    //             chart.projection = new am4maps.projections.Mercator();

    //             var restoreContinents = function () {
    //                 // hideCountries();
    //                 chart.goHome();
    //             };


    //             // Zoom control
    //             chart.zoomControl = new am4maps.ZoomControl();
    //             chart.zoomControl.align = "left"
    //             chart.zoomControl.marginBottom = 30;

    //             var homeButton = new am4core.Button();
    //             homeButton.events.on("hit", restoreContinents);

    //             homeButton.icon = new am4core.Sprite();
    //             homeButton.padding(7, 5, 7, 5);
    //             homeButton.width = 30;
    //             homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    //             homeButton.marginBottom = 10;
    //             homeButton.parent = chart.zoomControl;
    //             homeButton.insertBefore(chart.zoomControl.plusButton);


    //             // Create map polygon series
    //             var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //             // Make map load polygon data (state shapes and names) from GeoJSON
    //             polygonSeries.useGeodata = true;

    //             // Create image series
    //             var imageSeries = chart.series.push(new am4maps.MapImageSeries());

    //             // Create image
    //             var imageSeriesTemplate = imageSeries.mapImages.template;
    //             var marker = imageSeriesTemplate.createChild(am4core.Image);
    //             marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
    //             marker.width = 15;
    //             marker.height = 15;
    //             marker.nonScaling = true;
    //             marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
    //             marker.horizontalCenter = "middle";
    //             marker.verticalCenter = "bottom";

    //             // Set property fields
    //             imageSeriesTemplate.propertyFields.latitude = "latitude";
    //             imageSeriesTemplate.propertyFields.longitude = "longitude";

    //             var sort = $(":input:radio[name=type]:checked").val();

    //             jQuery.getJSON("../../../json/patch.json", json => {
    //                 data = [];
    //                 for (var i = 0; i < json.length; i++) {
    //                     new_data = {};
    //                     for (var key in json[i]) {
    //                         if (key == "title") new_data["title"] = json[i]["title"];
    //                         else if (key == "파견") new_data[sort] = json[i][key];
    //                         else if (key == "latitude") new_data[key] = json[i][key];
    //                         else if (key == "longitude") new_data[key] = json[i][key];
    //                     }
    //                     data.push(new_data);
    //                 }
    //                 image(data);
    //                 console.log(data);
    //             });

    //             // Add data
    //             function image(data) {
    //                 imageSeries.data = data;
    //             }
    //         });

    //     }); // end am4core.ready()

    //     // 파견버튼눌렀을때
    //     function patch() {
    //         var coll = document.getElementById('coll');
    //         var sort1 = document.getElementsByName('type');
    //         for (var i = 0; i < sort1.length; i++) {
    //             if (sort1[i].checked == true)
    //                 coll.reset();
    //         }

    //         var sort = $(":input:radio[name=type]:checked").val();

    //         parse(json => {
    //             data = [];
    //             for (var i = 0; i < json.length; i++) {
    //                 new_data = {};
    //                 for (var key in json[i]) {
    //                     if (key == "title") new_data["title"] = json[i]["title"];
    //                     else if (key == "파견") new_data[sort] = json[i][key];
    //                     else if (key == "latitude") new_data[key] = json[i][key];
    //                     else if (key == "longitude") new_data[key] = json[i][key];
    //                 }
    //                 data.push(new_data);
    //             }
    //             console.log(data);
    //         });

    //         am4core.ready(function () {
    //             // Themes begin
    //             am4core.useTheme(am4themes_animated);
    //             // Themes end

    //             jQuery.getJSON("https://services.amcharts.com/ip/?v=xz6Z", function (geo) {

    //                 var countryMaps = {
    //                     "KR": ["southKoreaLow"]
    //                 };

    //                 // calculate which map to be used
    //                 var currentMap = countryMaps;
    //                 if (countryMaps[geo.country_code] !== undefined) {
    //                     currentMap = countryMaps[geo.country_code][0];
    //                 }

    //                 // Create map instance
    //                 var chart = am4core.create("chartdiv", am4maps.MapChart);

    //                 // Set map definition
    //                 chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

    //                 // Set projection
    //                 chart.projection = new am4maps.projections.Mercator();

    //                 // Create map polygon series
    //                 var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //                 // Make map load polygon data (state shapes and names) from GeoJSON
    //                 polygonSeries.useGeodata = true;

    //                 // Create image series
    //                 var imageSeries = chart.series.push(new am4maps.MapImageSeries());

    //                 // Create image
    //                 var imageSeriesTemplate = imageSeries.mapImages.template;
    //                 var marker = imageSeriesTemplate.createChild(am4core.Image);
    //                 marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
    //                 marker.width = 15;
    //                 marker.height = 15;
    //                 marker.nonScaling = true;
    //                 marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
    //                 // marker.tooltip.getFillFromObject = false;
    //                 // chart.tooltip.background.fill = am4core.color("#CEB1BE");
    //                 marker.horizontalCenter = "middle";
    //                 marker.verticalCenter = "bottom";

    //                 // Set property fields
    //                 imageSeriesTemplate.propertyFields.latitude = "latitude";
    //                 imageSeriesTemplate.propertyFields.longitude = "longitude";

    //                 var sort = $(":input:radio[name=type]:checked").val();

    //                 jQuery.getJSON("../../../json/patch.json", json => {
    //                     data = [];
    //                     for (var i = 0; i < json.length; i++) {
    //                         new_data = {};
    //                         for (var key in json[i]) {
    //                             if (key == "title") new_data["title"] = json[i]["title"];
    //                             else if (key == "파견") new_data[sort] = json[i][key];
    //                             else if (key == "초청") new_data[sort] = json[i][key];
    //                             else if (key == "latitude") new_data[key] = json[i][key];
    //                             else if (key == "longitude") new_data[key] = json[i][key];
    //                         }
    //                         data.push(new_data);
    //                     }
    //                     image(data);
    //                 });

    //                 // Add data
    //                 function image(data) {
    //                     imageSeries.data = data;
    //                 }
    //             });
    //         }); // end am4core.ready()
    //     }

    //     // 초청버튼눌렀을때
    //     function invite() {

    //         var coll = document.getElementById('coll');
    //         var sort1 = document.getElementsByName('type');
    //         for (var i = 0; i < sort1.length; i++) {
    //             if (sort1[i].checked == true)
    //                 coll.reset();
    //         }

    //         var sort = $(":input:radio[name=type]:checked").val();

    //         parse1(json => {
    //             data = [];
    //             for (var i = 0; i < json.length; i++) {
    //                 new_data = {};
    //                 for (var key in json[i]) {
    //                     if (key == "title") new_data["title"] = json[i]["title"];
    //                     else if (key == "초청") new_data[sort] = json[i][key];
    //                     else if (key == "latitude") new_data[key] = json[i][key];
    //                     else if (key == "longitude") new_data[key] = json[i][key];
    //                 }
    //                 data.push(new_data);
    //             }
    //             // console.log(data);
    //         });

    //         am4core.ready(function () {
    //             // Themes begin
    //             am4core.useTheme(am4themes_animated);
    //             // Themes end

    //             jQuery.getJSON("https://services.amcharts.com/ip/?v=xz6Z", function (geo) {

    //                 var countryMaps = {
    //                     "KR": ["southKoreaLow"]
    //                 };

    //                 // calculate which map to be used
    //                 var currentMap = countryMaps;
    //                 if (countryMaps[geo.country_code] !== undefined) {
    //                     currentMap = countryMaps[geo.country_code][0];
    //                 }

    //                 // Create map instance
    //                 var chart = am4core.create("chartdiv", am4maps.MapChart);

    //                 // Set map definition
    //                 chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

    //                 // Set projection
    //                 chart.projection = new am4maps.projections.Mercator();

    //                 // Create map polygon series
    //                 var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //                 // Make map load polygon data (state shapes and names) from GeoJSON
    //                 polygonSeries.useGeodata = true;

    //                 // Create image series
    //                 var imageSeries = chart.series.push(new am4maps.MapImageSeries());

    //                 // Create image
    //                 var imageSeriesTemplate = imageSeries.mapImages.template;
    //                 var marker = imageSeriesTemplate.createChild(am4core.Image);
    //                 // marker.href = "../js/pin.svg";
    //                 marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
    //                 marker.width = 15;
    //                 marker.height = 15;
    //                 marker.nonScaling = true;
    //                 marker.stroke = "red";
    //                 marker.strokeWidth = 3;
    //                 marker.tooltipText = "[bold]{title}[/]\n초청: {invite}명";
    //                 marker.horizontalCenter = "middle";
    //                 marker.verticalCenter = "bottom";

    //                 // Set property fields
    //                 imageSeriesTemplate.propertyFields.latitude = "latitude";
    //                 imageSeriesTemplate.propertyFields.longitude = "longitude";

    //                 var sort = $(":input:radio[name=type]:checked").val();

    //                 jQuery.getJSON("../../../json/invite.json", json => {
    //                     data = [];
    //                     for (var i = 0; i < json.length; i++) {
    //                         new_data = {};
    //                         for (var key in json[i]) {
    //                             if (key == "title") new_data["title"] = json[i]["title"];
    //                             else if (key == "초청") new_data[sort] = json[i][key];
    //                             else if (key == "latitude") new_data[key] = json[i][key];
    //                             else if (key == "longitude") new_data[key] = json[i][key];
    //                         }
    //                         data.push(new_data);
    //                     }
    //                     image(data);
    //                 });

    //                 // Add data
    //                 function image(data) {
    //                     imageSeries.data = data;
    //                 }
    //             });
    //         }); // end am4core.ready()
    //     }
    //     function change() {
    //         var selectValue = document.getElementById("sex_selectbar").value;


    //         // Themes begin
    //         am4core.useTheme(am4themes_animated);
    //         // Themes end

    //         jQuery.getJSON("https://services.amcharts.com/ip/?v=xz6Z", function (geo) {

    //             var countryMaps = {
    //                 "KR": ["southKoreaLow"]
    //             };

    //             // calculate which map to be used
    //             var currentMap = countryMaps;
    //             if (countryMaps[geo.country_code] !== undefined) {
    //                 currentMap = countryMaps[geo.country_code][0];
    //             }

    //             // Create map instance
    //             var chart = am4core.create("chartdiv", am4maps.MapChart);

    //             // Set map definition
    //             chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";

    //             // Set projection
    //             chart.projection = new am4maps.projections.Mercator();

    //             // Create map polygon series
    //             var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //             // Make map load polygon data (state shapes and names) from GeoJSON
    //             polygonSeries.useGeodata = true;

    //             // Create image series
    //             var imageSeries = chart.series.push(new am4maps.MapImageSeries());

    //             // Create image
    //             var imageSeriesTemplate = imageSeries.mapImages.template;
    //             var marker = imageSeriesTemplate.createChild(am4core.Image);
    //             marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
    //             marker.width = 15;
    //             marker.height = 15;
    //             // marker.stroke = "red";
    //             // marker.strokeWidth = 3;
    //             marker.nonScaling = true;

    //             marker.horizontalCenter = "middle";
    //             marker.verticalCenter = "bottom";
    //             // marker.propertyFields.fill = "#f55";

    //             // Set property fields
    //             imageSeriesTemplate.propertyFields.latitude = "latitude";
    //             imageSeriesTemplate.propertyFields.longitude = "longitude";

    //             // var set1 = null;
    //             // var sort1 = document.getElementsByName('sort');
    //             // for (var i = 0; i < sort1.length; i++) {
    //             //     if (sort1[i].checked == true)
    //             //         set1 = sort1[i];
    //             //         console.log(set1);
    //             // }

    //             jQuery.getJSON("../../../json/domestic.json", json => {

    //                 var sort = $(":input:radio[name=type]:checked").val();

    //                 data1 = [];
    //                 new_data = {};
    //                 new_data["title"] = selectValue;
    //                 for (var i = 0; i < json.length; i++) {
    //                     if (selectValue == json[i]["title"]) {
    //                         if (sort == "patch") {
    //                             if (json[i]["파견"] > 0) {
    //                                 new_data[sort] = json[i]["파견"];
    //                                 new_data["latitude"] = json[i]["latitude"];
    //                                 new_data["longitude"] = json[i]["longitude"];
    //                             }
    //                         }
    //                         else if (sort == "invite") {
    //                             if (json[i]["초청"] > 0) {
    //                                 new_data[sort] = json[i]["초청"];
    //                                 new_data["latitude"] = json[i]["latitude"];
    //                                 new_data["longitude"] = json[i]["longitude"];
    //                             }
    //                         }
    //                     }
    //                 }

    //                 data1.push(new_data);
    //                 console.log(data1);
    //                 // console.log(data1);
    //                 image(data1);

    //                 if (sort == "patch")
    //                     marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
    //                 else
    //                     marker.tooltipText = "[bold]{title}[/]\n초청: {invite}명";
    //             });

    //             function image(data1) {
    //                 imageSeries.data = data1;
    //             }

    //         })

    //     }
