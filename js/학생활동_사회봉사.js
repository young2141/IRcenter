﻿var jdata

function parse(callback) {
    $.getJSON("community_service.json", json => {
        callback(json);
    });
}

function draw_graph(_year, _type) {
    parse(json => {
        /*
        var jdata = []
        var keys = Object.keys(json[0])
        
        for (var i = 0; i < json.length; i++) {
            var data_temp = {}
            for (var j = 0; j < keys.length; j++) {
                data_temp[keys[j]] = json[i][keys[j]]
            }

            jdata.push(data_temp)
        }
        */

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // draw_trend
        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv1", am4charts.XYChart);
            chart.data = json
            // chart.data = [{ "year": 2010.0, "농촌봉사": 656.0, "교육": 564.0, "노인": 39.0, "보건의료": 123.0, "문화": 115.0, "사무행정": 44.0, "국제협력": 55.0, "아동청소년": 136.0, "장애인": 225.0, "캠퍼스": 204.0, "환경": 264.0, "전체": 2425.0 }, { "year": 2011.0, "농촌봉사": 840.0, "교육": 489.0, "노인": 34.0, "보건의료": 119.0, "문화": 37.0, "사무행정": 157.0, "국제협력": 98.0, "아동청소년": 52.0, "장애인": 68.0, "캠퍼스": 167.0, "환경": 450.0, "전체": 2511.0 }, { "year": 2012.0, "농촌봉사": 184.0, "교육": 664.0, "노인": 36.0, "보건의료": 228.0, "문화": 129.0, "사무행정": 73.0, "국제협력": 159.0, "아동청소년": 120.0, "장애인": 76.0, "캠퍼스": 1366.0, "환경": 81.0, "전체": 3116.0 }, { "year": 2013.0, "농촌봉사": 929.0, "교육": 585.0, "노인": 68.0, "보건의료": 289.0, "문화": 131.0, "사무행정": 74.0, "국제협력": 221.0, "아동청소년": 174.0, "장애인": 66.0, "캠퍼스": 729.0, "환경": 31.0, "전체": 3297.0 }, { "year": 2014.0, "농촌봉사": 56.0, "교육": 455.0, "노인": 32.0, "보건의료": 173.0, "문화": 114.0, "사무행정": 48.0, "국제협력": 355.0, "아동청소년": 114.0, "장애인": 25.0, "캠퍼스": 361.0, "환경": 37.0, "전체": 1770.0 }, { "year": 2015.0, "농촌봉사": 382.0, "교육": 500.0, "노인": 49.0, "보건의료": 205.0, "문화": 63.0, "사무행정": 67.0, "국제협력": 259.0, "아동청소년": 48.0, "장애인": 35.0, "캠퍼스": 1436.0, "환경": 262.0, "전체": 3306.0 }, { "year": 2016.0, "농촌봉사": 170.0, "교육": 367.0, "노인": 146.0, "보건의료": 252.0, "문화": 129.0, "사무행정": 41.0, "국제협력": 121.0, "아동청소년": 248.0, "장애인": 192.0, "캠퍼스": 432.0, "환경": 129.0, "전체": 2227.0 }, { "year": 2017.0, "농촌봉사": 510.0, "교육": 563.0, "노인": 171.0, "보건의료": 224.0, "문화": 96.0, "사무행정": 30.0, "국제협력": 133.0, "아동청소년": 249.0, "장애인": 92.0, "캠퍼스": 897.0, "환경": 203.0, "전체": 3168.0 }, { "year": 2018.0, "농촌봉사": 206.0, "교육": 478.0, "노인": 97.0, "보건의료": 180.0, "문화": 127.0, "사무행정": 64.0, "국제협력": 183.0, "아동청소년": 342.0, "장애인": 101.0, "캠퍼스": 252.0, "환경": 114.0, "전체": 2144.0 }, { "year": 2019.0, "농촌봉사": 206.0, "교육": 478.0, "노인": 97.0, "보건의료": 180.0, "문화": 127.0, "사무행정": 64.0, "국제협력": 183.0, "아동청소년": 342.0, "장애인": 101.0, "캠퍼스": 252.0, "환경": 114.0, "전체": 2144.0 }]

            var max_value = 0, min_value = 10000
            for (var i = 0; i < json.length; i++) {
                if (json[i][_type] > max_value)
                    max_value = json[i][_type]

                if (json[i][_type] < min_value)
                    min_value = json[i][_type]
            }

            // Create axes
            //x-axis for chart
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.minGridDistance = 20;
            // categoryAxis.title.text = "연도"
            categoryAxis.renderer.grid.template.disabled = true;
            // categoryAxis.dy = -20;
            // categoryAxis.width = am4core.percent(90);

            //y-axis for chart
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = min_value - (max_value - min_value) * 0.1
            valueAxis.renderer.inside = true;
            // valueAxis.renderer.inversed = true;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis.renderer.minGridDistance = 15;

            // Create series
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.categoryX = "year"
            series.dataFields.valueY = _type
            series.strokeWidth = 4;

            var bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 8;
            /*
            series.heatRules.push({
                target: bullet.circle,
                min: 5,
                max: 20,
                property: "radius"
            });
            */

            bullet.tooltipText = "{categoryX}학년도 " + _type + " 봉사활동 인원은 [bold]{valueY}명[/]입니다.";

            //scrollbars
            /*
            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarY = new am4core.Scrollbar();
            */
        }); // end am4core.ready()


        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // draw_circle
        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        var keys = Object.keys(json[0])

        var dataset = new Object();
        var children_array = new Array();
        var temp = new Object();

        for (var i = 0; i < json.length; i++) {
            if (json[i].year != _year)
                continue

            for (var j = 0; j < keys.length; j++) {
                if (keys[j] == "year" || keys[j] == "전체") continue

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
        d3.select(self.frameElement).remove();
        var diameter = 900;
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var bubble = d3
          .pack(dataset)
          .size([diameter, diameter])
          .padding(1.5);

        var svg = d3
          .select("#chartdiv2")
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
                    " 봉사활동 인원은 " +
                    d3.format(",")(d.data.Count) +
                    "명입니다."
                )
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY - 10 + "px");
          })
          .on("mouseout", function (d, i) {
              d3.select(this)
                .transition()
                .duration("50")
                .attr("opacity", d.data.Name != _type ? ".4" : "1");
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
              return color(i);
          });

        node
          .append("text")
          .attr("dy", ".2em")
          .style("text-anchor", "middle")
          .text(function (d) {
              return d.data.Name;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", function (d) {
              return d.r / 5;
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