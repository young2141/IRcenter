import json, xlrd
from pprint import pprint

with xlrd.open_workbook(r'C:\Users\taeyo\IRcenter\data\지역별 지원,입학\지역별 입학 현황.xlsx') as file:
    sheet = file.sheet_by_index(0)
    nrows = sheet.nrows
    
    data = [[] for _ in range(4)]
    cities = [] 
    
    for row_num in range(36,37):
        for col_num in range(1,20):
            cities.append(sheet.cell_value(row_num,col_num))

    for alpha in range(0,8,2)  :
        for col_num in range(2,20):        
                data[alpha//2].append({
                'city' : cities[col_num-1],
                'apply' : int(sheet.cell_value(38+alpha,col_num)),
                'admission' : int(sheet.cell_value(39+alpha,col_num)),
                })      
    
    for da in data:
        other_admission = 0
        other_apply = 0
        for d in da:
            if d['city'] not in printing_city:
                if d['city'] == '계': 
                    d['admission'] = 0
                    d['apply'] = 0
                    continue
                
                other_admission += d['admission']
                other_apply += d['apply']
                d['admission'] = 0
                d['apply'] = 0
            da.append({
                'city' : 'other',
                'admission' : other_admission,
                'apply' : other_apply,
            })
        
    pprint(data)
    
    #with open(r'C:\Users\taeyo\IRcenter\data\지역별 지원,입학\\'+'str(2016+alpha//2)'+'_city'+ '.json','w',encoding='UTF-8-sig') as outfile:
    #        outfile.write(json.dumps(data[alpha//2],ensure_ascii=False))