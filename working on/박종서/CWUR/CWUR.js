function get_data(_json) {
    var result = []
    var obj_temp = {}
   
    for (var i = 0; i < _json.length; i++) {
        obj_temp = {}
        obj_temp["year"] = _json[i]["year"]
        obj_temp["maxrank"] = _json[i]["maxrank"]
        obj_temp["world"] = _json[i]["world"]["rank"]
        obj_temp["national"] = _json[i]["national"]["rank"]

        result.push(obj_temp)
    }

    return result
}

function draw_overall() {
    jQuery.getJSON("CWUR_data.json", json => {
        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            var data = get_data(json);

            function draw(_idx, _sort) {
                var chart = am4core.create("chartdiv1-" + _idx, am4charts.XYChart);
                //chart.paddingTop = 30

                chart.data = data;
                chart.zoomOutButton.disabled = true

                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "year";
                categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.renderer.grid.template.disabled = true;

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.inversed = true
                valueAxis.renderer.grid.template.disabled = true;
                valueAxis.renderer.labels.template.disabled = true;
                valueAxis.extraMax = 0.15
                valueAxis.extraMin = 0.15

                var lineSeries = chart.series.push(new am4charts.LineSeries());
                lineSeries.dataFields.categoryX = "year";
                lineSeries.dataFields.valueY = _sort;
                lineSeries.strokeWidth = 5;
                lineSeries.stroke = am4core.color("#FF8700");

                /*
                var bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
                bullet.circle.fill = am4core.color("#FF8700");
                bullet.circle.fillOpacity = 0;
                bullet.circle.strokeOpacity = 0;
                */

                var labelBullet = lineSeries.bullets.push(new am4charts.LabelBullet());
                labelBullet.label.text = "rank: {" + _sort + "}";
                labelBullet.label.dy = -25;

                $("#word" + _idx).html(data[data.length - 1][_sort])

                var picture = document.getElementById("picture" + _idx)

                if (data[data.length -1][_sort] > data[data.length - 2][_sort]) {
                    picture.src = "arrow-141-64-2.png"
                } 
                else if (data[data.length - 1][_sort] < data[data.length - 2][_sort]) {
                    picture.src = "arrow-141-64.png"
                }
                else {
                    picture.src = "equal-sign-3-64.svg"
                }
            }

            draw(1, "world")
            draw(2, "national")
            

        }); // end am4core.ready()        
    });
}






