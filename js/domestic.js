var sort = $(":input:radio[name=type]:checked").val();

function parse(callback) {
    $.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/patch.json", json => {
        callback(json);
    });
}
function parse1(callback) {
    $.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/invite.json", json => {
        callback(json);
    });
}
// 첫화면
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
        chart.projection = new am4maps.projections.Mercator();

        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon data (state shapes and names) from GeoJSON
        polygonSeries.useGeodata = true;

        // Create image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());

        // Create image
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var marker = imageSeriesTemplate.createChild(am4core.Image);
        marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
        marker.width = 15;
        marker.height = 15;
        // marker.stroke = "red";
        // marker.strokeWidth = 3;
        marker.nonScaling = true;
        marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
        marker.horizontalCenter = "middle";
        marker.verticalCenter = "bottom";
        // marker.propertyFields.fill = "#f55";

        // Set property fields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";

        var sort = $(":input:radio[name=sort]:checked").val();

        jQuery.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/patch.json", json => {
            data = [];
            for (var i = 0; i < json.length; i++) {
                new_data = {};
                for (var key in json[i]) {
                    if (key == "title") new_data["title"] = json[i]["title"];
                    else if (key == "파견") new_data[sort] = json[i][key];
                    else if (key == "latitude") new_data[key] = json[i][key];
                    else if (key == "longitude") new_data[key] = json[i][key];
                }
                data.push(new_data);
            }
            image(data);
            console.log(data);
        });

        // Add data
        function image(data) {
            imageSeries.data = data;
        }
    });

}); // end am4core.ready()

// 파견버튼눌렀을때
function patch() {
    var coll = document.getElementById('coll');
    var sort1 = document.getElementsByName('sort');
    for (var i = 0; i < sort1.length; i++) {
        if (sort1[i].checked == true)
            coll.reset();
    }

    var sort = $(":input:radio[name=sort]:checked").val();

    parse(json => {
        data = [];
        for (var i = 0; i < json.length; i++) {
            new_data = {};
            for (var key in json[i]) {
                if (key == "title") new_data["title"] = json[i]["title"];
                else if (key == "파견") new_data[sort] = json[i][key];
                else if (key == "latitude") new_data[key] = json[i][key];
                else if (key == "longitude") new_data[key] = json[i][key];
            }
            data.push(new_data);
        }
        console.log(data);
    });

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
            chart.projection = new am4maps.projections.Mercator();

            // Create map polygon series
            var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

            // Make map load polygon data (state shapes and names) from GeoJSON
            polygonSeries.useGeodata = true;

            // Create image series
            var imageSeries = chart.series.push(new am4maps.MapImageSeries());

            // Create image
            var imageSeriesTemplate = imageSeries.mapImages.template;
            var marker = imageSeriesTemplate.createChild(am4core.Image);
            marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
            marker.width = 15;
            marker.height = 15;
            marker.nonScaling = true;
            marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
            // marker.tooltip.getFillFromObject = false;
            // chart.tooltip.background.fill = am4core.color("#CEB1BE");
            marker.horizontalCenter = "middle";
            marker.verticalCenter = "bottom";

            // Set property fields
            imageSeriesTemplate.propertyFields.latitude = "latitude";
            imageSeriesTemplate.propertyFields.longitude = "longitude";

            var sort = $(":input:radio[name=sort]:checked").val();

            jQuery.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/patch.json", json => {
                data = [];
                for (var i = 0; i < json.length; i++) {
                    new_data = {};
                    for (var key in json[i]) {
                        if (key == "title") new_data["title"] = json[i]["title"];
                        else if (key == "파견") new_data[sort] = json[i][key];
                        else if (key == "초청") new_data[sort] = json[i][key];
                        else if (key == "latitude") new_data[key] = json[i][key];
                        else if (key == "longitude") new_data[key] = json[i][key];
                    }
                    data.push(new_data);
                }
                image(data);
            });

            // Add data
            function image(data) {
                imageSeries.data = data;
            }
        });
    }); // end am4core.ready()
}

// 초청버튼눌렀을때
function invite() {

    var coll = document.getElementById('coll');
    var sort1 = document.getElementsByName('sort');
    for (var i = 0; i < sort1.length; i++) {
        if (sort1[i].checked == true)
            coll.reset();
    }

    var sort = $(":input:radio[name=sort]:checked").val();

    parse1(json => {
        data = [];
        for (var i = 0; i < json.length; i++) {
            new_data = {};
            for (var key in json[i]) {
                if (key == "title") new_data["title"] = json[i]["title"];
                else if (key == "초청") new_data[sort] = json[i][key];
                else if (key == "latitude") new_data[key] = json[i][key];
                else if (key == "longitude") new_data[key] = json[i][key];
            }
            data.push(new_data);
        }
        // console.log(data);
    });

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
            chart.projection = new am4maps.projections.Mercator();

            // Create map polygon series
            var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

            // Make map load polygon data (state shapes and names) from GeoJSON
            polygonSeries.useGeodata = true;

            // Create image series
            var imageSeries = chart.series.push(new am4maps.MapImageSeries());

            // Create image
            var imageSeriesTemplate = imageSeries.mapImages.template;
            var marker = imageSeriesTemplate.createChild(am4core.Image);
            // marker.href = "../js/pin.svg";
            marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
            marker.width = 15;
            marker.height = 15;
            marker.nonScaling = true;
            marker.stroke = "red";
            marker.strokeWidth = 3;
            marker.tooltipText = "[bold]{title}[/]\n초청: {invite}명";
            marker.horizontalCenter = "middle";
            marker.verticalCenter = "bottom";

            // Set property fields
            imageSeriesTemplate.propertyFields.latitude = "latitude";
            imageSeriesTemplate.propertyFields.longitude = "longitude";

            var sort = $(":input:radio[name=type]:checked").val();

            jQuery.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/invite.json", json => {
                data = [];
                for (var i = 0; i < json.length; i++) {
                    new_data = {};
                    for (var key in json[i]) {
                        if (key == "title") new_data["title"] = json[i]["title"];
                        else if (key == "초청") new_data[sort] = json[i][key];
                        else if (key == "latitude") new_data[key] = json[i][key];
                        else if (key == "longitude") new_data[key] = json[i][key];
                    }
                    data.push(new_data);
                }
                image(data);
            });

            // Add data
            function image(data) {
                imageSeries.data = data;
            }
        });
    }); // end am4core.ready()
}
function change() {
    var selectValue = document.getElementById('selectmenu').value;


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
        chart.projection = new am4maps.projections.Mercator();

        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon data (state shapes and names) from GeoJSON
        polygonSeries.useGeodata = true;

        // Create image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());

        // Create image
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var marker = imageSeriesTemplate.createChild(am4core.Image);
        marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
        marker.width = 15;
        marker.height = 15;
        // marker.stroke = "red";
        // marker.strokeWidth = 3;
        marker.nonScaling = true;

        marker.horizontalCenter = "middle";
        marker.verticalCenter = "bottom";
        // marker.propertyFields.fill = "#f55";

        // Set property fields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";

        // var set1 = null;
        // var sort1 = document.getElementsByName('sort');
        // for (var i = 0; i < sort1.length; i++) {
        //     if (sort1[i].checked == true)
        //         set1 = sort1[i];
        //         console.log(set1);
        // }

        jQuery.getJSON("C:/Users/tkekd/OneDrive/바탕 화면/IR센터/json/domestic.json", json => {

            var sort = $(":input:radio[name=type]:checked").val();

            data1 = [];
            new_data = {};
            new_data["title"] = selectValue;
            for (var i = 0; i < json.length; i++) {
                if (selectValue == json[i]["title"]) {
                    if (sort == "patch") {
                        if(json[i]["파견"]>0){
                            new_data[sort] = json[i]["파견"];
                            new_data["latitude"] = json[i]["latitude"];
                            new_data["longitude"] = json[i]["longitude"];
                        }
                    }
                    else if (sort == "invite") {
                        if(json[i]["초청"]>0){
                            new_data[sort] = json[i]["초청"];
                            new_data["latitude"] = json[i]["latitude"];
                            new_data["longitude"] = json[i]["longitude"];
                        }
                    }
                }
            }

            data1.push(new_data);
            console.log(data1);
            // console.log(data1);
            image(data1);

            if (sort == "patch")
                marker.tooltipText = "[bold]{title}[/]\n파견: {patch}명";
            else
                marker.tooltipText = "[bold]{title}[/]\n초청: {invite}명";
        });

        function image(data1) {
            imageSeries.data = data1;
        }

    })

}