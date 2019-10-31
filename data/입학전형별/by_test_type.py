from pprint import pprint
import xlrd,json

def make_json1(test_type,data):
    jay = {
        'apply':{
            '1~1.5': data[0][0],
            '1.5~2': data[0][1],
            '2~2.5': data[0][2],
            '2.5~3.5': data[0][3],
            '3.5~5': data[0][4],
        },
        'pass':{
            '1~1.5': data[1][0],
            '1.5~2': data[1][1],
            '2~2.5': data[1][2],
            '2.5~3.5': data[1][3],
            '3.5~5': data[1][4],
        },
        'admission':{
            '1~1.5': data[2][0],
            '1.5~2': data[2][1],
            '2~2.5': data[2][2],
            '2.5~3.5': data[2][3],
            '3.5~5': data[2][4],
        },
    }   

    with open(r'data\입학전형별\\' + test_type + '.json', 'w', encoding='UTF-8-sig') as rates:
            rates.write(json.dumps(jay, ensure_ascii=False))
            
def make_json2(test_type,data):
    jay = {
        'apply':{
            '1~1.5': data[0][0],
            '1.5~2': data[0][1],
            '2~2.5': data[0][2],
            '2.5~3.5': data[0][3],
            '3.5~5': data[0][4],
        },
        'admission':{
            '1~1.5': data[1][0],
            '1.5~2': data[1][1],
            '2~2.5': data[1][2],
            '2.5~3.5': data[1][3],
            '3.5~5': data[1][4],
        },
    }   

    with open(r'data\입학전형별\\' + test_type + '.json', 'w', encoding='UTF-8-sig') as rates:
            rates.write(json.dumps(jay, ensure_ascii=False))

def parse_xl(start, end,test_type):
    data = [[],[],[]]
    data_col = 0 
    for col in range(start, end+1):        
        for row in range(2,7):
            data[data_col].append(int(sheet.cell_value(row,col)))
        data_col += 1
        
    if end-start == 2:
        make_json1(test_type,data)
    else:
        make_json2(test_type,data)

with xlrd.open_workbook(r'data\입학전형별\입학전형유형별 선발결과 데이터.xlsx') as file:
    sheet = file.sheet_by_index(0)
    nrows = sheet.nrows

    parse_xl(1,3,'학생부 교과')
    parse_xl(4,6,'논술')
    parse_xl(7,8,'학생부종합일반')
    parse_xl(9,10,'학생부종합농어촌')    
    parse_xl(11,12,'정시')