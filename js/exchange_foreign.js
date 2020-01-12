function draw_map(input_mode) {
    if (input_mode == mode) return

    if (mode)
        am4core.disposeAllCharts();

    mode = input_mode

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * Define SVG path for target icon
         */
        var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

        // Create map instance
        var chart = am4core.create("chartdiv", am4maps.MapChart);

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
        polygonTemplate.fill = chart.colors.getIndex(1);

        // create capital markers
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());

        // define template
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var circle = imageSeriesTemplate.createChild(am4core.Circle);
        circle.radius = 6;
        circle.fill = chart.colors.getIndex(mode == "파견" ? 8 : 11).brighten(-0.2);
        circle.strokeWidth = 2;
        circle.stroke = am4core.color("#fff")
        // what about scale...

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
            imageSeriesTemplate.tooltipText = "{university}의 파견 인원은 {disfatch}명입니다.";
        else
            imageSeriesTemplate.tooltipText = "{university}의 초청 인원은 {invitation}명입니다.";
        imageSeriesTemplate.fill = am4core.color("#000");
        imageSeriesTemplate.setStateOnChildren = true;
        imageSeriesTemplate.states.create("hover");
        imageSeriesTemplate.events.on("hit", function (ev) {
            ev.target.series.chart.zoomToMapObject(ev.target)
        });
        // imageSeries.data = []
        imageSeries.data = []
        /*
    for (var i = 0; i < datas.length; i++){
        if (datas[i].latitude < 0)
            imageSeries.data.push(datas[i])
    }
    */
        
        var uni_select = document.getElementById("university_selectbar")
        uni_select.innerHTML = ""

        if (mode == "파견") {
            for (var i = 0; i < universities.length; i++) {
                if (universities[i].latitude == '' || universities[i].disfatch == 0)
                    continue
                imageSeries.data.push(universities[i])
                uni_select.innerHTML += "<option name='' value=''>" + universities[i].university + "</option>"
            }
        }
        else {
            for (var i = 0; i < universities.length; i++) {
                if (universities[i].latitude == '' || universities[i].invitation == 0)
                    continue
                imageSeries.data.push(universities[i])
                uni_select.innerHTML += "<option name='' value=''>" + universities[i].university + "</option>"
            }
        }

    }); // end am4core.ready()
}

var mode
var chart
var universities = [{ "university": "마샬대학", "latitude": 38.4235, "longitude": -82.4286, "disfatch": 0.0, "invitation": 0.0 }, { "university": "랜더대학", "latitude": 34.2003, "longitude": -82.1739, "disfatch": 6.0, "invitation": 1.0 }, { "university": "럿거스캄덴대학", "latitude": 39.9476, "longitude": -75.1318, "disfatch": 0.0, "invitation": 1.0 }, { "university": "모어헤드주립대학", "latitude": 38.1886, "longitude": -83.4402, "disfatch": 1.0, "invitation": 3.0 }, { "university": "오클라호마대학", "latitude": 35.2047, "longitude": -97.4562, "disfatch": 20.0, "invitation": 4.0 }, { "university": "오클라호마주립대", "latitude": 36.127, "longitude": -97.0824, "disfatch": 0.0, "invitation": 0.0 }, { "university": "캘리포니아롱비치주립대학", "latitude": 33.7838, "longitude": -118.1228, "disfatch": 2.0, "invitation": 5.0 }, { "university": "캘리포니아리버사이드주립대학", "latitude": 33.9737, "longitude": -117.3368, "disfatch": 4.0, "invitation": 0.0 }, { "university": "캘리포니아대학데이비스캠퍼스", "latitude": 38.5382, "longitude": -121.7704, "disfatch": 0.0, "invitation": 1.0 }, { "university": "텍사스달라스대학", "latitude": 29.6687, "longitude": -101.948, "disfatch": 1.0, "invitation": 0.0 }, { "university": "오스틴피주립대학", "latitude": 36.5349, "longitude": -87.3636, "disfatch": 7.0, "invitation": 2.0 }, { "university": "뉴욕오스웨고주립대학", "latitude": 43.4513, "longitude": -76.5512, "disfatch": 8.0, "invitation": 1.0 }, { "university": "웨스턴워싱턴대학", "latitude": 48.7342, "longitude": -122.4953, "disfatch": 0.0, "invitation": 0.0 }, { "university": "인디아나펜실베니아대학", "latitude": 40.614, "longitude": -79.1702, "disfatch": 0.0, "invitation": 0.0 }, { "university": "메다이대학", "latitude": 42.9286, "longitude": -78.8647, "disfatch": 0.0, "invitation": 0.0 }, { "university": "텍사스오스틴주립대학 ", "latitude": 30.2849, "longitude": -97.7428, "disfatch": 2.0, "invitation": 0.0 }, { "university": "브릿지워터주립대학", "latitude": 41.9876, "longitude": -70.9753, "disfatch": 4.0, "invitation": 0.0 }, { "university": "콜럼비아미주리대학", "latitude": 38.9403, "longitude": -92.3364, "disfatch": 0.0, "invitation": 0.0 }, { "university": "사우스다코타대학", "latitude": 44.9964, "longitude": -101.2446, "disfatch": 1.0, "invitation": 0.0 }, { "university": "산호세주립대학", "latitude": 37.3351, "longitude": -121.8898, "disfatch": 29.0, "invitation": 0.0 }, { "university": "위버주립대학", "latitude": 41.1915, "longitude": -111.9518, "disfatch": 0.0, "invitation": 0.0 }, { "university": "퍼듀대학교", "latitude": 40.4237, "longitude": -86.9299, "disfatch": 0.0, "invitation": 0.0 }, { "university": "콜럼버스주립대학", "latitude": 32.5019, "longitude": -84.9502, "disfatch": 0.0, "invitation": 0.0 }, { "university": "노던아이오와대학", "latitude": 42.2671, "longitude": -93.1798, "disfatch": 0.0, "invitation": 1.0 }, { "university": "위스콘신대학화이트워터", "latitude": 42.7446, "longitude": -89.1797, "disfatch": 0.0, "invitation": 2.0 }, { "university": "메사추세츠대학Amherst", "latitude": 42.3867, "longitude": -72.5388, "disfatch": 0.0, "invitation": 0.0 }, { "university": "미주리대학", "latitude": 38.9403, "longitude": -92.3364, "disfatch": 0.0, "invitation": 0.0 }, { "university": "캘리포니아몬테레이베이주립대학", "latitude": 36.6516, "longitude": -121.8065, "disfatch": 7.0, "invitation": 0.0 }, { "university": "더피플대학", "latitude": 34.1462, "longitude": -118.1467, "disfatch": 0.0, "invitation": 1.0 }, { "university": "교토대학", "latitude": 35.0262, "longitude": 135.772, "disfatch": 6.0, "invitation": 1.0 }, { "university": "히로시마대학", "latitude": 34.402, "longitude": 132.7116, "disfatch": 2.0, "invitation": 3.0 }, { "university": "히로시마시티대학", "latitude": "", "longitude": "", "disfatch": 0.0, "invitation": 1.0 }, { "university": "히로시마시립대학", "latitude": 34.4388, "longitude": 132.4144, "disfatch": 20.0, "invitation": 0.0 }, { "university": "도호쿠대학", "latitude": 38.2538, "longitude": 140.8718, "disfatch": 2.0, "invitation": 0.0 }, { "university": "도쿠시마대학", "latitude": 34.0698, "longitude": 134.5575, "disfatch": 4.0, "invitation": 5.0 }, { "university": "히로사키대학", "latitude": 40.5883, "longitude": 140.4702, "disfatch": 10.0, "invitation": 3.0 }, { "university": "나가사키대학", "latitude": 32.7852, "longitude": 129.8609, "disfatch": 2.0, "invitation": 0.0 }, { "university": "시마네대학", "latitude": 35.4864, "longitude": 133.0659, "disfatch": 1.0, "invitation": 0.0 }, { "university": "규슈대학", "latitude": 33.6266, "longitude": 130.4228, "disfatch": 4.0, "invitation": 0.0 }, { "university": "학습원대학", "latitude": 35.7186, "longitude": 139.7071, "disfatch": 2.0, "invitation": 1.0 }, { "university": "우쯔노미야대학", "latitude": 36.5482, "longitude": 139.9107, "disfatch": 1.0, "invitation": 1.0 }, { "university": "시즈오카대학", "latitude": 34.9635, "longitude": 138.4308, "disfatch": 4.0, "invitation": 0.0 }, { "university": "도야마대학", "latitude": 36.6943, "longitude": 137.1847, "disfatch": 7.0, "invitation": 2.0 }, { "university": "오차노미즈대학", "latitude": 35.7187, "longitude": 139.7299, "disfatch": 1.0, "invitation": 0.0 }, { "university": "와카야마대학", "latitude": 34.2659, "longitude": 135.1494, "disfatch": 4.0, "invitation": 9.0 }, { "university": "간사이대학", "latitude": 34.7723, "longitude": 135.5072, "disfatch": 3.0, "invitation": 9.0 }, { "university": "도쿄외국어대학", "latitude": 35.6744, "longitude": 139.5182, "disfatch": 0.0, "invitation": 1.0 }, { "university": "동경농업대학", "latitude": 35.6412, "longitude": 139.6297, "disfatch": 0.0, "invitation": 1.0 }, { "university": "동경가정대학", "latitude": 35.7061, "longitude": 139.4901, "disfatch": 0.0, "invitation": 1.0 }, { "university": "신슈대학", "latitude": 36.25, "longitude": 137.9766, "disfatch": 0.0, "invitation": 0.0 }, { "university": "후쿠이대학", "latitude": 36.089, "longitude": 136.1665, "disfatch": 1.0, "invitation": 0.0 }]
var key_dict = {}