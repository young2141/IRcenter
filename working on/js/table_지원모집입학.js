function years3() {
    var start = 2010;
    var end = 2019;
    var condition1 = $("input:radio[name=admit]:checked").val();
    var condition2 = $("select[name=college]").val();
    console.log(condition1, condition2);
    var data = [];
    var depth = 7;
    if (condition2 != "전체"){
        depth = 4;
    }
    for (var year = start; year <= end; year++) {
      parsing3(year, condition1, condition2, data, depth, start, end);
    }
  }

  function parsing3(_year, _condition1, _condition2, _data, _depth, _start, _end) {
    var filename =
      "4page_" + String(_year) + "_colleage_" + _condition1 + ".json";
    var temp = { year: String(_year) };
    $.getJSON("../../json/" + filename, jsonData => {
      temp["totalrecruitment"] = jsonData["전체"]["recruitment"];
      temp["totalapplied"] = jsonData["전체"]["applied"];
      temp["totaladmitted"] = jsonData["전체"]["admitted"];
      temp["recruitment1"] = jsonData["인문사회"]["recruitment"];
      temp["applied1"] = jsonData["인문사회"]["applied"];
      temp["admitted1"] = jsonData["인문사회"]["admitted"];
      temp["recruitment2"] = jsonData["자연과학"]["recruitment"];
      temp["applied2"] = jsonData["자연과학"]["applied"];
      temp["admitted2"] = jsonData["자연과학"]["admitted"];
      temp["recruitment3"] = jsonData["공학"]["recruitment"];
      temp["applied3"] = jsonData["공학"]["applied"];
      temp["admitted3"] = jsonData["공학"]["admitted"];
      temp["recruitment4"] = jsonData["예체능"]["recruitment"];
      temp["applied4"] = jsonData["예체능"]["applied"];
      temp["admitted4"] = jsonData["예체능"]["admitted"];
      temp["selectrecruitment"] = jsonData[_condition2]["recruitment"];
      temp["selectapplied"] = jsonData[_condition2]["applied"];
      temp["selectadmitted"] = jsonData[_condition2]["admitted"];
      _data.push(temp);
      if (_data.length === 10) {
        drawTable(_data, _condition2, _depth, _start, _end);
      }
    });
  }

  function drawTable(_data, college, cols, startY, endY) {
    console.log(_data);
    console.log(cols);
    var rows = endY - startY;
    var temp;
    var HTML = "<table border = '1'>";
    HTML += "<tr>";
    HTML += "<td>구분</td>";
    HTML += "<td>년도</td>";

    if(college == "전체"){
        console.log(college);
        console.log("if문 실행중");

        /* 목차 만들기 */
        HTML += "<td>인문사회</td>";
        HTML += "<td>자연과학</td>";
        HTML += "<td>공학</td>";
        HTML += "<td>예체능</td>";
        HTML += "<td>전체</td>";
        HTML += "</tr>";

        /* 값 넣기 */
        for(i=0; i<3; i++){ //첫번째 열 목차 
            temp = startY;
            HTML += "<tr>";
            HTML += "<td rowspan='10'>";
            if(i==0) HTML += "지원"; else if(i==1) HTML += "모집"; else if(i==2) HTML += "입학";
            HTML += "</td>";
            HTML += "<td>" + temp + "</td>";
            temp++;
            if(i==0){
                HTML += "<td>" + _data[0]["applied1"] + "</td>";
                HTML += "<td>" + _data[0]["applied2"] + "</td>";
                HTML += "<td>" + _data[0]["applied3"] + "</td>";
                HTML += "<td>" + _data[0]["applied4"] + "</td>";
                HTML += "<td>" + _data[0]["totalapplied"] + "</td>";
             }
             else if(i==1){
                HTML += "<td>" + _data[0]["recruitment1"] + "</td>";
                HTML += "<td>" + _data[0]["recruitment2"] + "</td>";
                HTML += "<td>" + _data[0]["recruitment3"] + "</td>";
                HTML += "<td>" + _data[0]["recruitment4"] + "</td>";
                HTML += "<td>" + _data[0]["totalrecruitment"] + "</td>";
             }
             else if(i==2){
                HTML += "<td>" + _data[0]["admitted1"] + "</td>";
                HTML += "<td>" + _data[0]["admitted2"] + "</td>";
                HTML += "<td>" + _data[0]["admitted3"] + "</td>";
                HTML += "<td>" + _data[0]["admitted4"] + "</td>";
                HTML += "<td>" + _data[0]["totaladmitted"] + "</td>";
             }
            HTML += "</tr>" ;
            for(j=0; j<rows; j++){
                HTML +=("<tr>");
                HTML +=("<td>" + temp + "</td>");
                temp++;
                if(i==0){
                    HTML += "<td>" + _data[j]["applied1"] + "</td>";
                    HTML += "<td>" + _data[j]["applied2"] + "</td>";
                    HTML += "<td>" + _data[j]["applied3"] + "</td>";
                    HTML += "<td>" + _data[j]["applied4"] + "</td>";
                    HTML += "<td>" + _data[j]["totalapplied"] + "</td>";
                 }
                 else if(i==1){
                    HTML += "<td>" + _data[j]["recruitment1"] + "</td>";
                    HTML += "<td>" + _data[j]["recruitment2"] + "</td>";
                    HTML += "<td>" + _data[j]["recruitment3"] + "</td>";
                    HTML += "<td>" + _data[j]["recruitment4"] + "</td>";
                    HTML += "<td>" + _data[j]["totalrecruitment"] + "</td>";
                 }
                 else if(i==2){
                    HTML += "<td>" + _data[j]["admitted1"] + "</td>";
                    HTML += "<td>" + _data[j]["admitted2"] + "</td>";
                    HTML += "<td>" + _data[j]["admitted3"] + "</td>";
                    HTML += "<td>" + _data[j]["admitted4"] + "</td>";
                    HTML += "<td>" + _data[j]["totaladmitted"] + "</td>";
                 }
                HTML +=("</tr>");
            }
        }

    }
    else{
        console.log("else문 실행중");

         /* 목차 만들기 */
         HTML += "<td>" + college + "</td>";
         HTML += "<td>전체</td>";
         HTML += "</tr>";
 
         /* 값 넣기 */
         for(i=0; i<3; i++){ 
             temp = startY;
             console.log(temp);
             HTML += "<tr>";
             HTML += "<td rowspan='10'>";
             if(i==0) HTML += "지원"; else if(i==1) HTML += "모집"; else if(i==2) HTML += "입학";
             HTML += "</td>";
             HTML += "<td>" + temp + "</td>";
             temp++;
             if(i==0){
                HTML += "<td>" + _data[0]["selectapplied"] + "</td>";
                HTML += "<td>" + _data[0]["totalapplied"] + "</td>";
             }
             else if(i==1){
                HTML += "<td>" + _data[0]["selectrecruitment"] + "</td>";
                HTML += "<td>" + _data[0]["totalrecruitment"] + "</td>";
             }
             else if(i==2){
                HTML += "<td>" + _data[0]["selectadmitted"] + "</td>";
                HTML += "<td>" + _data[0]["totaladmitted"] + "</td>";
             }
             HTML += "</tr>" ;

             for(j=1; j<=rows; j++){
                 HTML +=("<tr>");
                 HTML +=("<td>" + temp + "</td>");
                 temp++;
                 if(i==0){
                    HTML += "<td>" + _data[j]["selectapplied"] + "</td>";
                    HTML += "<td>" + _data[j]["totalapplied"] + "</td>";
                 }
                 else if(i==1){
                    HTML += "<td>" + _data[j]["selectrecruitment"] + "</td>";
                    HTML += "<td>" + _data[j]["totalrecruitment"] + "</td>";
                 }
                 else if(i==2){
                    HTML += "<td>" + _data[j]["selectadmitted"] + "</td>";
                    HTML += "<td>" + _data[j]["totaladmitted"] + "</td>";
                 }
                 HTML +=("</tr>");
             }
         }
    }

    HTML +=("</table>");
    document.getElementById("tablediv").innerHTML = HTML;
    
  }