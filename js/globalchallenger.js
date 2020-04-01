color_dict = {
    "유럽": "#FE4459",
    "아시아": "#E8A343",
    "미주": "#FCFF57",
    "오세아니아": "#43E884"
}

area_dict = {
    "독일": "유럽",
    "영국": "유럽",
    "스웨덴": "유럽",
    "덴마크": "유럽",
    "일본": "아시아"
}

colorset = new Object()

function lineGraph(json) {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/globalchallenger.json", json => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart);

            // Data for both series
            var data = json;
            console.log(json);

            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            /* Create value axis */
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.extraMax = 0.15;

            /* Create series */
            var lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.name = "student";
            lineSeries.dataFields.valueY = "student";
            lineSeries.dataFields.categoryX = "year";

            lineSeries.stroke = am4core.color("#fdd400");
            lineSeries.strokeWidth = 3;
            lineSeries.strokeDasharray = ["2,2"];
            lineSeries.tooltip.label.textAlign = "middle";

            var bullet = lineSeries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
            bullet.tooltipText = "[#fff font-size: 15px]{categoryX}년:[#fff bold] {valueY}명[/][/]"
            var circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.strokeWidth = 3;

            chart.data = data;
        });
    }); // end am4core.ready()
}

function stackGraph(json) {
    am4core.ready(function () {
        jQuery.getJSON("../../../json/globalchallenger.json", json => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv2", am4charts.XYChart);

            // Data for both series
            var data = json;
            console.log(json);

            /* Create axes */
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            /* Create value axis */
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.extraMax = 0.15;
            valueAxis.calculateTotals = true;

            /* Create series */
            var columnSeries = chart.series.push(new am4charts.ColumnSeries());
            columnSeries.name = "team";
            columnSeries.dataFields.valueY = "team";
            columnSeries.dataFields.categoryX = "year";

            columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{categoryX}년:[#fff bold] {valueY}팀[/][/]"
            columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
            columnSeries.columns.template.propertyFields.stroke = "stroke";
            columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
            columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
            columnSeries.tooltip.label.textAlign = "middle";

            chart.data = data;

            // Create series for total
            var totalSeries = chart.series.push(new am4charts.ColumnSeries());
            totalSeries.dataFields.valueY = "none";
            totalSeries.dataFields.categoryX = "year";
            totalSeries.stacked = true;
            totalSeries.hiddenInLegend = true;
            totalSeries.columns.template.strokeOpacity = 0;

            var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
            totalBullet.dy = -20;
            totalBullet.label.text = "{valueY.total}";
            totalBullet.label.hideOversized = false;
            totalBullet.label.fontSize = 16;
            // totalBullet.label.background.fill = totalSeries.stroke;
            totalBullet.label.background.fillOpacity = 0.2;
            totalBullet.label.padding(5, 10, 5, 10);
        });
    }); // end am4core.ready()
}

function parse(callback) {
    $.getJSON("../../../json/gcp_country.json", json => {
        callback(json);
    });
}

function bubbleGraph(_type) {
    var _year = 2019

    parse(json => {
        var keys = Object.keys(json[0])

        var dataset = new Object();
        var children_array = new Array();
        var temp = new Object();

        for (var i = 0; i < json.length; i++) {
            if (json[i].year != _year)
                continue

            for (var j = 0; j < keys.length; j++) {
                if (keys[j] == "year" || keys[j] == "전체" || json[i][keys[j]] == 0) continue

                temp = new Object()
                temp["Name"] = keys[j]
                temp["Count"] = json[i][keys[j]]
                if (temp["Count"]) children_array.push(temp)
            }
        }

        children_array.sort((a, b) =>
            a.Count > b.Count ? -1 : b.Count > a.Count ? 1 : 0
        );

        /*
        etc = {
            Name: "그 외",
            Count: 0
        };
        for (var i = 30; i < children_array.length; ++i) {
            etc["Count"] += children_array[i]["Count"];
        }
        children_array = children_array.slice(0, 30);
        children_array.push(etc);
        */

        dataset["children"] = children_array;
        // console.log(dataset)
        d3.select("#chartdiv3").select("svg").remove();

        var diameter = 650;

        var bubble = d3
          .pack(dataset)
          .size([diameter, diameter])
          .padding(1.5);

        var svg = d3
          .select("#chartdiv3")
          .append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset).sum(function (d) {
            return d.Count;
        });

        var div = d3
          .select("body")
          .append("divv")
          .attr("class", "tooltip-bubble")
          .style("opacity", 0);

        var node = svg
          .selectAll(".node")
          .data(bubble(nodes).descendants())
          .enter()
          .filter(function (d) {
              return !d.children;
          })
          .append("g")
          .attr("class", "node")
          .attr("opacity", ".7")
          .attr("id", function (d) {
              var s = d.data.Name;
              var ne = "";
              for (var i = 0; i < s.length; ++i) {
                  if (s[i] != " ") ne += s[i];
              }
              // return d.data.Name
              return ne;
          })
          .attr("transform", function (d) {
              return "translate(" + d.x + "," + d.y + ")";
          })
          .on("mouseover", function (d, i) {
              d3.select(this)
                .transition()
                .duration("50")
                .attr("opacity", "1");
              div
                .transition()
                .duration("50")
                .style("opacity", 1);
              div
                .html(
                  _year +
                    "학년도 " +
                    d.data.Name +
                    "에서 " +
                    d3.format(",")(d.data.Count) +
                    "지역(팀)이 참여했습니다."
                )
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY - 10 + "px");
          })
          .on("mouseout", function (d, i) {
              d3.select(this)
                .transition()
                .duration("50")
                .attr("opacity", d.data.Name != _type ? ".7" : "1");
              div
                .transition()
                .duration("50")
                .style("opacity", 0);
          });

        // node.append("title")
        //     .text(function (d) {return d.Name + ": " + d.Count});
        // console.log(picked);

        node
          .append("circle")
          .attr("r", function (d) {
              return d.r;
          })
          .style("fill", function (d, i) {
              return color_dict[area_dict[d.data.Name]];
          })

        node
          .append("text")
          .attr("dy", ".2em")
          .style("text-anchor", "middle")
          .text(function (d) {
              return d.data.Name;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", function (d) {
              return d.r/5;
          })
          .attr("fill", "black");

        // node.append("text")
        //     .attr("dy", "1.3em")
        //     .style("text-anchor", "middle")
        //     .text(function (d) {
        //         return d.data.Count;
        //     })
        //     .attr("font-family", "Gill Sans", "Gill Sans MT")
        //     .attr("font-size", function (d) {
        //         return d.r / 5;
        //     })
        //     .attr("fill", "white");

        d3.select(self.frameElement).style("height", diameter + "px");

        if (_type != "전체") {
            // var found = false;

            d3.select("#" + _type)
            .attr("opacity", "1")
            .select("circle")
            .style("stroke", "red")
            .style("stroke-width", "3");

            /*
            if (
              !d3
                .select("#" + _type)
                .attr("opacity", "1")
                .select("circle")
                .style("stroke", "red")
                .style("stroke-width", "3")
                .empty()
            )
                found = true;

            console.log(found);
            if (!found) {
                d3.select("#그외")
                  .attr("opacity", "1")
                  .select("circle")
                  .style("stroke", "red")
                  .style("stroke-width", "3");
            }
            */
        }
    })
    // draw_trend(_type)
    // draw_circle(_year, _type)
}