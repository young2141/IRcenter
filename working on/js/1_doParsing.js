/**
 * param {String[]} _needData 필요한 데이터 종류(json에서의 데이터 이름)
 * param {String} _filename 파싱할 json 파일 이름
 * param {String[]} _years 찾을 년도들
 * param {String[]} _conditions 어떤 데이터를 찾을건지(전체, 정원내외, 특정단대 등)
 * param {Number} _cnt _needData 의 개수. 즉 필요로 하는 Y축 데이터의 종류 개수
 * param {function} callback 콜백함수
 */

function iter(_needData, _filename, _years, _conditions, _cnt, callback) {
  var result = [];
  for (var i = 0; i < _years.length; i++) {
    var file = String(_years[i]) + _filename;
    var temp = { year: String(_years[i]) };
    doParsing(file, _needData, _conditions, temp, _cnt, data => {
      result.push(data);
      if (result.length == _years.length) {
        callback(result);
      }
    });
  }
}
/**
 *
 * param {Stirng}  _fileName 파싱할 json 파일 이름
 * param {String[]} _needData 필요한 데이터 종류(json에서의 데이터 이름)
 * param {String[]} _conditions 어떤 데이터를 찾을건지(전체, 정원내외, 특정 단대 등)
 * param {Object} _temp 임시 데이터...
 * param {Number} _cnt _needData의 개수.
 * param {function} callback 콜백함수
 */

function doParsing(_fileName, _needData, _conditions, _temp, _cnt, callback) {
  $.getJSON("C:/workspace/IRcenter/working on/json/" + _fileName, jsonData => {
    for (var c = 0; c < _conditions.length; c++) {
      var jsonCur = 0;
      while (jsonCur < jsonData.length) {
        if (_conditions[c] != jsonData[jsonCur].category) {
          jsonCur++;
          continue;
        }
        for (var i = 0; i < _cnt; i++) {
          _temp[_needData[i]] = jsonData[jsonCur][_needData[i]];
        }
        jsonCur++;
      }
    }
    callback(_temp);
  });
}

function test(callback) {
  callback();
}
