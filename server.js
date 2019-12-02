/*
NOTE!! 꼭 읽어보자
1. 같은 페이지 내에서는 통신하면서 변수 안꼬이게 변수명 다 다르게해야하는구나... 비동기식 통신이다. 근데 ajax를 동기식으로 통신할 수 있다. 이걸 잘 참고하자
    왜 동기식으로 처리해야될까? 원하는 순서대로 실행되길 원하기 때문이다.
2. 지금
*/
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencode = require('urlencode')
var db;

app.use('/js', express.static(__dirname + "/js")); // 외부파일 읽기
app.use('/json', express.static(__dirname + "/json"));
app.use('/image', express.static(__dirname + "/image"));

app.use(bodyParser.urlencoded({
    extended: true
})); // Post 방식을 하기 위해선 bodyparser가 필요하다.

var server = http.createServer(app).listen(3000, function () {
    console.log("server start");
});

//첫화면
app.get('/', function (req, res) {
    fs.readFile('./views/첫화면.html', function (error, data) {
        res.writeHead(200, {'Content-Type': 'text/html;' });
        res.end(data);
    })
})

app.get('/' + urlencode('첫화면.html'), function (req, res) {
    fs.readFile('./views/첫화면.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html;' });
        res.end(data);
    })
})

//선택창
app.get("/" + urlencode('대학현황.html'), function (req, res) {
    fs.readFile('./views/대학현황.html', function (error, data) {
        res.writeHead(200, {'Content-Type': 'text/html;' });
        res.end(data);
    })
})

app.get('/' + urlencode('입학') + '/' + urlencode('입학.html'), function (req, res) {
    fs.readFile('./views/입학/입학.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html;' });
        res.end(data);
    })
})

//학부입학_요약
app.get('/' + urlencode('학부입학') + '/' + urlencode('학부입학_요약.html'), function (req, res) {
    fs.readFile('./views/학부입학/학부입학_요약.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    })
})
//학부입학/대학현황_요약/충원율 경쟁률
app.post('/post/admission_summary', function (req, res) {
    var data = req.body.condition;
    db = new sqlite3.Database('./db/admission.db');
    if (data == "competition_rate") { // 경쟁률
        db.serialize(function () {
            ctempyear = 2010; // 시작년도
            ctempdata = [];
            ctempjson = {};
            csendjson = [];
            for (var i = 2010; i < 2020; i++) {
                db.each("select sum(recruitment_in) as temp1, sum(apply_in) as temp2 from apply_admission_by_major where year=" + String(i), function (err, row) {
                    ctempdata.push(String(ctempyear));
                    ctempdata.push(row.temp2 / row.temp1);
                    ctempyear++;
                });
                db.each("select sum(recruitment_in) as temp1, sum(apply_in) as temp2 from apply_admission_by_major where year=" + String(i) + " and academic_field='자연과학계열'", function (err, row) {
                    ctempdata.push(row.temp2 / row.temp1);
                });
                db.each("select sum(recruitment_in) as temp1, sum(apply_in) as temp2 from apply_admission_by_major where year=" + String(i) + " and academic_field='예체능계열'", function (err, row) {
                    ctempdata.push(row.temp2 / row.temp1);
                });
                db.each("select sum(recruitment_in) as temp1, sum(apply_in) as temp2 from apply_admission_by_major where year=" + String(i) + " and academic_field='공학계열'", function (err, row) {
                    ctempdata.push(row.temp2 / row.temp1);
                });
                db.each("select sum(recruitment_in) as temp1, sum(apply_in) as temp2 from apply_admission_by_major where year=" + String(i) + " and academic_field='인문사회계열'", function (err, row) {
                    ctempdata.push(row.temp2 / row.temp1);
                    ctempjson = { "year": ctempdata[0], "all": ctempdata[1], "science": ctempdata[2], "artphysical": ctempdata[3], "mech": ctempdata[4], "society": ctempdata[5] };
                    csendjson.push(ctempjson);
                    ctempdata = [];
                    if (ctempyear == i - 1) {
                        res.send(csendjson);
                    }
                });
            }
        });
    }
    else {// 충원율
        db.serialize(function () {
            rtempyear = 2010; // 시작년도
            rtempdata = [];
            rtempjson = {};
            rsendjson = [];
            for (var j = 2010; j < 2020; j++) {
                db.each("select sum(admission_in_male) as temp1, sum(admission_in_female) as temp2, sum(recruitment_in) as temp3 from apply_admission_by_major where year=" + String(j), function (err, row) {
                    rtempdata.push(String(rtempyear));
                    rtempdata.push((row.temp1 + row.temp2) * 100 / row.temp3);
                    rtempyear++;
                });
                db.each("select sum(admission_in_male) as temp1, sum(admission_in_female) as temp2, sum(recruitment_in) as temp3 from apply_admission_by_major where year=" + String(j) + " and academic_field='자연과학계열'", function (err, row) {
                    rtempdata.push((row.temp1 + row.temp2) * 100 / row.temp3);
                });
                db.each("select sum(admission_in_male) as temp1, sum(admission_in_female) as temp2, sum(recruitment_in) as temp3 from apply_admission_by_major where year=" + String(j) + " and academic_field='예체능계열'", function (err, row) {
                    rtempdata.push((row.temp1 + row.temp2) * 100 / row.temp3);
                });
                db.each("select sum(admission_in_male) as temp1, sum(admission_in_female) as temp2, sum(recruitment_in) as temp3 from apply_admission_by_major where year=" + String(j) + " and academic_field='공학계열'", function (err, row) {
                    rtempdata.push((row.temp1 + row.temp2) * 100 / row.temp3);
                });
                db.each("select sum(admission_in_male) as temp1, sum(admission_in_female) as temp2, sum(recruitment_in) as temp3 from apply_admission_by_major where year=" + String(j) + " and academic_field='인문사회계열'", function (err, row) {
                    rtempdata.push((row.temp1 + row.temp2) * 100 / row.temp3);
                    rtempjson = { "year": rtempdata[0], "all": rtempdata[1], "science": rtempdata[2], "artphysical": rtempdata[3], "mech": rtempdata[4], "society": rtempdata[5] };
                    rsendjson.push(rtempjson);
                    rtempdata = [];
                    if (rtempyear == j - 1) {
                        res.send(rsendjson);
                    }
                });
            }
        });
    }
})

//학부입학_대학현황1
app.get('/' + urlencode('학부입학') + '/' + urlencode('대학현황_1.html'), function (req, res) {
    fs.readFile('./views/학부입학/대학현황_1.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    })
})

//학부입학/대학현황_1/지원자, 모집자, 입학자
app.post('/post/admission1-1', function (req, res) {
    var condition = req.body.condition;
    db = new sqlite3.Database('./db/admission.db');
    if (condition == "total")
        condition = "_sum";
    else if (condition == "within")
        condition = "_in";
    else
        condition = "_out";

    db.serialize(function () {
        tempyear1 = 2010; // 시작년도
        sendjson1 = [];
        for (var i = 2010; i < 2020; i++) {
            if (condition == "_sum") {
                db.each("select sum(recruitment" + condition + ") as temp1, sum(apply" + condition + ") as temp2, sum(admission" + condition + ") as temp3 from apply_admission_by_major where year=" + String(i), function (err, row) {
                    tempjson1 = { "year": String(tempyear1), "recruitment": row.temp1, "applied": row.temp2, "admitted": row.temp3 };
                    sendjson1.push(tempjson1);
                    tempyear1++;
                    if (tempyear1 == i) {
                        res.send(sendjson1);
                    }
                });
            }
            else {
                db.each("select sum(recruitment" + condition + ")as temp1, sum(apply" + condition + ") as temp2, sum(admission" + condition + "_male) as temp3, sum(admission" + condition + "_female) as temp4 from apply_admission_by_major where year=" + String(i), function (err, row) {
                    tempjson1 = { "year": String(tempyear1), "recruitment": row.temp1, "applied": row.temp2, "admitted": row.temp3 + row.temp4 };
                    sendjson1.push(tempjson1);
                    tempyear1++;
                    if (tempyear1 == i) {
                        res.send(sendjson1);
                    }
                });
            }
        }
    });
})

//학부입학/대학현황_1/충원율, 경쟁율
app.post('/post/admission1-2', function (req, res) {
    var condition = req.body.condition;
    var condition2 = req.body.condition2;

    db = new sqlite3.Database('./db/admission.db');
    if (condition == "total")
        condition = "_sum";
    else if (condition == "within")
        condition = "_in";
    else
        condition = "_out";

    db.serialize(function () {
        tempyear2 = 2010; // 시작년도
        sendjson2 = [];
        tempyear3 = 2010; // 시작년도
        sendjson3 = [];
        for (var i = 2010; i < 2020; i++) {
            if (condition == "_sum") {
                db.each("select sum(recruitment" + condition + ") as temp1, sum(apply" + condition + ") as temp2, sum(admission" + condition + ") as temp3 from apply_admission_by_major where year=" + String(i), function (err, row) {
                    if (condition2 == "competition") {
                        tempjson2 = { "year": String(tempyear2), "competition_rate": row.temp2 / row.temp1 };
                        sendjson2.push(tempjson2);
                        tempyear2++;
                        if (tempyear2 == i) {
                            res.send(sendjson2);
                        }
                    }
                    else {
                        tempjson3 = { "year": String(tempyear3), "recruitment_rate": (row.temp3) * 100 / row.temp1 };
                        sendjson3.push(tempjson3);
                        tempyear3++;
                        if (tempyear3 == i) {
                            res.send(sendjson3);
                        }
                    }
                });
            }
            else {
                db.each("select sum(recruitment" + condition + ")as temp1, sum(apply" + condition + ") as temp2, sum(admission" + condition + "_male) as temp3, sum(admission" + condition + "_female) as temp4 from apply_admission_by_major where year=" + String(i), function (err, row) {
                    if (condition2 == "competition") {
                        tempjson2 = { "year": String(tempyear2), "competition_rate": row.temp2 / row.temp1 };
                        sendjson2.push(tempjson2);
                        tempyear2++;
                        if (tempyear2 == i) {
                            res.send(sendjson2);
                        }
                    }
                    else {
                        tempjson3 = { "year": String(tempyear3), "recruitment_rate": (row.temp3 + row.temp4) * 100 / row.temp1 };
                        sendjson3.push(tempjson3);
                        tempyear3++;
                        if (tempyear3 == i) {
                            res.send(sendjson3);
                        }
                    }
                });
            }
        }
    });

})

//학부입학/대학현황_2
app.get('/' + urlencode('학부입학') + '/' + urlencode('대학현황_2.html'), function (req, res) {
    fs.readFile('./views/학부입학/대학현황_2.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    })
})

//학부입학/대학현황_3
app.get('/' + urlencode('학부입학') + '/' + urlencode('대학현황_3.html'), function (req, res) {
    fs.readFile('./views/학부입학/대학현황_3.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    })
})
//학부입학/대학현황_3/연도별_고등학교 분류
app.post('/post/admission3-1', function (req, res) {
    var condition = req.body.condition;
    db = new sqlite3.Database('./db/admission.db');
    db.all("select sum(normal_num) as temp1, sum(science_num) as temp2, sum(foreign_num) as temp3, sum(artphysical_num) as temp4, sum(industry_num) as temp5, sum(characterization_num) as temp6,sum(self_num) as temp7,sum(gifted_num) as temp8,sum(school_qualification_num) as temp9,sum(etc_num) as temp10 from high_school where year=" + condition, function (err, row) {
        var temp = [
            {"category": "일반고", "value":row[0].temp1},
            { "category": "특수목적고", "value": row[0].temp2 + row[0].temp3 + row[0].temp4 + row[0].temp5},
            { "category": "특성화고", "value": row[0].temp6},
            { "category": "자율고", "value": row[0].temp7},
            { "category": "기타", "value": row[0].temp8 + row[0].temp9 + row[0].temp10}
        ];
        res.send(temp);
    });
});

//학부입학/대학현황_4
app.get('/' + urlencode('학부입학') + '/' + urlencode('대학현황_4.html'), function (req, res) {
    fs.readFile('./views/학부입학/대학현황_4.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    })
})
//학부입학/대학현황_4/지역별 지원자_입학자 수
app.post('/post/admission4-1', function (req, res) {
    var data = req.body.condition1;
    db = new sqlite3.Database('./db/admission.db');
    db.all("select category, daegu, kyungbuk, kyungnam, busan, ulsan, seoul, kyeongki, chungbuk, sum from admission_by_region where year=" + data, function (err, row) {
        var temp = [{ "city": "대구", "apply": row[1].daegu, "admission": row[0].daegu },
        { "city": "경북", "apply": row[1].kyungbuk, "admission": row[0].kyungbuk },
        { "city": "경남", "apply": row[1].kyungnam, "admission": row[0].kyungnam },
        { "city": "부산", "apply": row[1].busan, "admission": row[0].busan },
        { "city": "울산", "apply": row[1].ulsan, "admission": row[0].ulsan },
        { "city": "서울", "apply": row[1].seoul, "admission": row[0].seoul },
        { "city": "경기", "apply": row[1].kyeongki, "admission": row[0].kyeongki },
        { "city": "충북", "apply": row[1].chungbuk, "admission": row[0].chungbuk },
        {
            "city": "기타", "apply": row[1].sum - row[1].daegu - row[1].kyungbuk - row[1].kyungnam - row[1].busan - row[1].ulsan - row[1].seoul - row[1].kyeongki - row[1].chungbuk,
            "admission": row[0].sum - row[0].daegu - row[0].kyungbuk - row[0].kyungnam - row[0].busan - row[0].ulsan - row[0].seoul - row[0].kyeongki - row[0].chungbuk
        }];
        res.send(temp);
    });
});

//학부입학/대학현황_4/지역별 등급컷 (이건 더미데이터로 만들어서 DB로 구현안함)
app.post('/post/admission4-2', function (req, res) {
    var data = req.body.condition1;
    db = new sqlite3.Database('./db/admission.db');
    db.all("select category, daegu, kyungbuk, kyungnam, busan, ulsan, seoul, kyeongki, chungbuk, sum from admission_by_region where year=" + data, function (err, row) {
        var temp = [{ "city": "대구", "apply": row[1].daegu, "admission": row[0].daegu },
        { "city": "경북", "apply": row[1].kyungbuk, "admission": row[0].kyungbuk },
        { "city": "경남", "apply": row[1].kyungnam, "admission": row[0].kyungnam },
        { "city": "부산", "apply": row[1].busan, "admission": row[0].busan },
        { "city": "울산", "apply": row[1].ulsan, "admission": row[0].ulsan },
        { "city": "서울", "apply": row[1].seoul, "admission": row[0].seoul },
        { "city": "경기", "apply": row[1].kyeongki, "admission": row[0].kyeongki },
        { "city": "충북", "apply": row[1].chungbuk, "admission": row[0].chungbuk },
        {
            "city": "기타", "apply": row[1].sum - row[1].daegu - row[1].kyungbuk - row[1].kyungnam - row[1].busan - row[1].ulsan - row[1].seoul - row[1].kyeongki - row[1].chungbuk,
            "admission": row[0].sum - row[0].daegu - row[0].kyungbuk - row[0].kyungnam - row[0].busan - row[0].ulsan - row[0].seoul - row[0].kyeongki - row[0].chungbuk
            }];

        res.send(temp);
    });
});

//학부입학/대학현황_5
app.get('/' + urlencode('학부입학') + '/' + urlencode('대학현황_5.html'), function (req, res) {
    fs.readFile('./views/학부입학/대학현황_5.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    })
})
//학부입학/대학현황_5/지원자, 모집자, 입학자
app.post('/post/admission5-1', function (req, res) {
    var condition1 = req.body.condition1;
    var condition2 = req.body.condition2;
    db = new sqlite3.Database('./db/admission.db');
    if (condition1 == "total")
        condition1 = "_sum";
    else if (condition1 == "within")
        condition1 = "_in";
    else
        condition1 = "_out";

    db.serialize(function () {
        tempyear1 = 2010; // 시작년도
        sendjson1 = [];
        for (var i = 2010; i < 2020; i++) {
            if (condition1 == "_sum") {
                if (condition2 == "전체")
                    sql = "select sum(recruitment" + condition1 + ") as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + ") as temp3 from apply_admission_by_major where year=" + String(i);
                else
                    sql = "select sum(recruitment" + condition1 + ") as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + ") as temp3 from apply_admission_by_major where year=" + String(i) + " and academic_field='" + condition2 + "계열'"
                db.each(sql, function (err, row) {
                    tempjson1 = { "year": String(tempyear1), "recruitment": row.temp1, "applied": row.temp2, "admitted": row.temp3 };
                    sendjson1.push(tempjson1);
                    tempyear1++;
                    if (tempyear1 == i) {
                        res.send(sendjson1);
                    }
                });
            }
            else {
                if (condition2 == "전체")
                    sql = "select sum(recruitment" + condition1 + ")as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + "_male) as temp3, sum(admission" + condition1 + "_female) as temp4 from apply_admission_by_major where year=" + String(i);
                else
                    sql = "select sum(recruitment" + condition1 + ")as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + "_male) as temp3, sum(admission" + condition1 + "_female) as temp4 from apply_admission_by_major where year=" + String(i) + " and academic_field='" + condition2 + "계열'"
                db.each(sql, function (err, row) {
                    tempjson1 = { "year": String(tempyear1), "recruitment": row.temp1, "applied": row.temp2, "admitted": row.temp3 + row.temp4 };
                    sendjson1.push(tempjson1);
                    tempyear1++;
                    if (tempyear1 == i) {
                        res.send(sendjson1);
                    }
                });
            }
        }
    });
})

//학부입학/대학현황_5/충원율, 경쟁율
app.post('/post/admission5-2', function (req, res) {
    var condition1 = req.body.condition1;
    var condition2 = req.body.condition2;
    var condition3 = req.body.condition3;

    db = new sqlite3.Database('./db/admission.db');
    if (condition1 == "total")
        condition1 = "_sum";
    else if (condition1 == "within")
        condition1 = "_in";
    else
        condition1 = "_out";

    db.serialize(function () {
        tempyear2 = 2010; // 시작년도
        sendjson2 = [];
        tempyear3 = 2010; // 시작년도
        sendjson3 = [];
        for (var i = 2010; i < 2020; i++) {
            if (condition1 == "_sum") {
                if (condition2 == "전체")
                    sql = "select sum(recruitment" + condition1 + ") as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + ") as temp3 from apply_admission_by_major where year=" + String(i);
                else
                    sql = "select sum(recruitment" + condition1 + ") as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + ") as temp3 from apply_admission_by_major where year=" + String(i) + " and academic_field='" + condition2 + "계열'";
                db.each(sql, function (err, row) {
                    if (condition3 == "competition") {
                        tempjson2 = { "year": String(tempyear2), "competition_rate": row.temp2 / row.temp1 };
                        sendjson2.push(tempjson2);
                        tempyear2++;
                        if (tempyear2 == i) {
                            res.send(sendjson2);
                        }
                    }
                    else {
                        tempjson3 = { "year": String(tempyear3), "recruitment_rate": (row.temp3) * 100 / row.temp1 };
                        sendjson3.push(tempjson3);
                        tempyear3++;
                        if (tempyear3 == i) {
                            res.send(sendjson3);
                        }
                    }
                });
            }
            else {
                if (condition2 == "전체")
                    sql = "select sum(recruitment" + condition1 + ")as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + "_male) as temp3, sum(admission" + condition1 + "_female) as temp4 from apply_admission_by_major where year=" + String(i);
                else
                    sql = "select sum(recruitment" + condition1 + ")as temp1, sum(apply" + condition1 + ") as temp2, sum(admission" + condition1 + "_male) as temp3, sum(admission" + condition1 + "_female) as temp4 from apply_admission_by_major where year=" + String(i) + " and academic_field='" + condition2 + "계열'"
                db.each(sql, function (err, row) {
                    if (condition3 == "competition") {
                        tempjson2 = { "year": String(tempyear2), "competition_rate": row.temp2 / row.temp1 };
                        sendjson2.push(tempjson2);
                        tempyear2++;
                        if (tempyear2 == i) {
                            res.send(sendjson2);
                        }
                    }
                    else {
                        tempjson3 = { "year": String(tempyear3), "recruitment_rate": (row.temp3 + row.temp4) * 100 / row.temp1 };
                        sendjson3.push(tempjson3);
                        tempyear3++;
                        if (tempyear3 == i) {
                            res.send(sendjson3);
                        }
                    }
                });
            }
        }
    });

})