var mode
var mode2
var chart
var universities
var key_dict = {}

function parse(callback) {
    $.getJSON("../../../working on/json/latitude.json", json => {
        callback(json);
    });
}

function draw_map(input_mode) {
    parse(json => {
        universities = json

    mode = input_mode
    mode2 = $("#university_selectbar option:selected").val();

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
        chart.zoomControl.marginBottom = 20;

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
            imageSeriesTemplate.tooltipText = "{university}의 파견 인원은 {disfatch}명입니다.";
        else
            imageSeriesTemplate.tooltipText = "{university}의 초청 인원은 {invitation}명입니다.";
        imageSeriesTemplate.fill = am4core.color("#000");
        imageSeriesTemplate.setStateOnChildren = true;
        imageSeriesTemplate.states.create("hover");
        imageSeriesTemplate.events.on("hit", function (ev) {
            ev.target.series.chart.zoomToMapObject(ev.target)
        });
        imageSeries.data = []

        if (mode == "파견") {
            for (var i = 0; i < universities.length; i++) {
                if(mode2=="전체"){
                    if (universities[i].disfatch.toString().trim() == "-" || universities[i].latitude == '')
                    continue
                }
                else{
                    if (universities[i].university.trim()!=mode2|| universities[i].disfatch.toString().trim() == "-" || universities[i].latitude == '')
                    continue
                }
                
                imageSeries.data.push(universities[i])
            }
        }
        else {
            for (var i = 0; i < universities.length; i++) {
                if(mode2=="전체"){
                    if (universities[i].invitation.toString().trim() == "-" || universities[i].latitude == '')
                    continue
                }
                else{
                    if (universities[i].university.trim()!=mode2|| universities[i].invitation.toString().trim() == "-" || universities[i].latitude == '')
                    continue
                }
                imageSeries.data.push(universities[i])
            }
        }

    }); // end am4core.ready()


    });
    
}

