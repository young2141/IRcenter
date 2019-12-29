function parse(callback, year) {
  if (year <= 2018) year = 2018;

  $.getJSON("../../json/" + String(year) + "_dgree_by_major.json", json => {
    // console.log(json)
    callback(json);
  });
}

function check() {
  var val = document.getElementsByName("chk_type");
  var type = [0, 0, 0];
  var year = 0;
  for (var i = 0; i < val.length; i++) {
    if (val[i].checked) {
      console.log(val[i].value + "체크");
      type[i] = Number(val[i].value);
    } else console.log(val[i].value + "안체크");
  }
  var year = document.getElementById("years").value;
  var picked = $("select[name=menu]").val();
  console.log(year, picked);
  calld3(type, year, picked);
}

function calld3(type, year, picked) {
  parse(json => {
    // console.log(json)
    var dataset = new Object();
    var children_array = new Array();
    for (var i = 0; i < json.length; ++i) {
      if (type[0] == 1) {
        tmp = new Object();
        tmp["Name"] = json[i]["category"] + "사";
        tmp["Count"] = json[i]["bachelor"];
        if (tmp["Count"]) children_array.push(tmp);
      }
      if (type[1] == 2) {
        tmp = new Object();
        tmp["Name"] = json[i]["category"] + " 석사";
        tmp["Count"] = json[i]["master"];
        if (tmp["Count"]) children_array.push(tmp);
      }
      if (type[2] == 3) {
        tmp = new Object();
        tmp["Name"] = json[i]["category"] + " 박사";
        tmp["Count"] = json[i]["doctor"];
        if (tmp["Count"]) children_array.push(tmp);
      }
    }

    children_array.sort((a, b) =>
      a.Count > b.Count ? -1 : b.Count > a.Count ? 1 : 0
    );
    etc = {
      Name: "그 외",
      Count: 0
    };
    for (var i = 30; i < children_array.length; ++i) {
      etc["Count"] += children_array[i]["Count"];
    }
    children_array = children_array.slice(0, 30);
    children_array.push(etc);

    dataset["children"] = children_array;
    // console.log(dataset)
    d3.select("svg").remove();
    var diameter = 900;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var bubble = d3
      .pack(dataset)
      .size([diameter, diameter])
      .padding(1.5);

    var svg = d3
      .select("#myGraph")
      .append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

    var nodes = d3.hierarchy(dataset).sum(function(d) {
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
      .filter(function(d) {
        return !d.children;
      })
      .append("g")
      .attr("class", "node")
      .attr("opacity", ".7")
      .attr("id", function(d) {
        var s = d.data.Name;
        var ne = "";
        for (var i = 0; i < s.length; ++i) {
          if (s[i] != " ") ne += s[i];
        }
        // return d.data.Name
        return ne;
      })
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("mouseover", function(d, i) {
        d3.select(this)
          .transition()
          .duration("50")
          .attr("opacity", "1");
        div
          .transition()
          .duration(50)
          .style("opacity", 1);
        div
          .html(
            year +
              "학년도 " +
              d.data.Name +
              "는 " +
              d3.format(",")(d.data.Count) +
              "명 입니다."
          )
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 10 + "px");
      })
      .on("mouseout", function(d, i) {
        d3.select(this)
          .transition()
          .duration("50")
          .attr("opacity", ".4");
        div
          .transition()
          .duration("50")
          .style("opacity", 0);
      });

    // node.append("title")
    //     .text(function (d) {return d.Name + ": " + d.Count});
    console.log(picked);

    node
      .append("circle")
      .attr("r", function(d) {
        return d.r;
      })
      .style("fill", function(d, i) {
        return color(i);
      });

    node
      .append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.data.Name;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", function(d) {
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

    if (picked != "전체") {
      var found = false;

      // d3.select("#" + picked + "학사")
      //   .attr("opacity", "1")
      //   .select("circle")
      //   .style("stroke", "red")
      //   .style("stroke-width", "3");

      if (
        !d3
          .select("#" + picked + "사")
          .attr("opacity", "1")
          .select("circle")
          .style("stroke", "red")
          .style("stroke-width", "3")
          .empty()
      )
        found = true;

      if (
        !d3
          .select("#" + picked + "석사")
          .attr("opacity", "1")
          .select("circle")
          .style("stroke", "red")
          .style("stroke-width", "3")
          .empty()
      )
        found = true;

      if (
        !d3
          .select("#" + picked + "박사")
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
    }
  }, year);
}
