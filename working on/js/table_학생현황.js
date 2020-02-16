function years() {
    var start = 1946;
    var end = 2019;
    var condition1 = $("select[id=grad]").val();
    var condition2 = $("select[id=gender]").val();
    console.log(condition1, condition2);
    var data = [];
    var depth = 4;
    parsing1(condition1, condition2, data, depth, start, end);
  }

  function parsing1(_condition1, _condition2, _data, _depth, _start, _end) {
    var filename = "area_chart_data_v2.json";
    var temp = {};
    $.getJSON("../../../json/" + filename, jsonData => {
      for (var i = 0; i < jsonData.length; i++) 
      {
        console.log(jsonData[i]["year"]);
        temp["year"] = jsonData[i]["year"];
        if (_condition1 == "all"){
          if (_condition2 == "all"){
            temp["college"] = jsonData[i]["graduate_college"] + jsonData[i]["undergraduate_college"];
            temp["master"] = jsonData[i]["graduate_master"] + jsonData[i]["undergraduate_master"];
            temp["doctor"] = jsonData[i]["graduate_doctor"] + jsonData[i]["undergraduate_doctor"];
          }
          else{
            temp["college"] = jsonData[i]["graduate_" + _condition2 + "_college"] + jsonData[i]["undergraduate_" + _condition2 + "_college"];
            temp["master"] = jsonData[i]["graduate_" + _condition2 + "_master"] + jsonData[i]["undergraduate_" + _condition2 + "_master"];
            temp["doctor"] = jsonData[i]["graduate_" + _condition2 + "_doctor"] + jsonData[i]["undergraduate_" + _condition2 + "_doctor"];
          }
        }
        else{
          if (_condition2 == "all"){
            temp["college"] = jsonData[i][_condition1 + "_college"];
            temp["master"] = jsonData[i][_condition1 + "_master"];
            temp["doctor"] = jsonData[i][_condition1 + "_doctor"];
          }
          else{
            temp["college"] = jsonData[i][_condition1 + "_" + _condition2 + "_college"];
            temp["master"] = jsonData[i][_condition1 + "_" + _condition2 + "_master"];
            temp["doctor"] = jsonData[i][_condition1 + "_" + _condition2 + "_doctor"];
          }
        }
        console.log(temp);
        _data.push(temp);
        if(i == 73){
          console.log(_data);
          drawTable(_data, _depth, _start, _end);
        }
      }
        // drawTable(_data, _depth, _start, _end);
    });
  }

  function drawTable(_data, cols, startY, endY) {
    console.log(_data);
    console.log(cols);
    var rows = endY - startY + 1;
    var temp;
    var HTML = "<table border=1 width=1000>";
    HTML += "<tr>";
    HTML += "<td>구분</td>";
    HTML += "<td>학사</td>";
    HTML += "<td>석사</td>";
    HTML += "<td>박사</td>";
    HTML += "</tr>";

    for(i=0; i<rows; i++)   { 
        HTML += "<tr>";
        HTML += "<td>" + _data[i]["year"] + "</td>";
        HTML += "<td>" + _data[i]["college"] + "</td>";
        HTML += "<td>" + _data[i]["master"] + "</td>";
        HTML += "<td>" + _data[i]["doctor"] + "</td>";
        HTML += "</tr>" ;
    }
  
    HTML +=("</table>");
    document.getElementById("tablediv").innerHTML = HTML;
    
  }