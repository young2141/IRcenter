from pprint import pprint
import json, os, xlrd

with xlrd.open_workbook(r'C:\Users\taeyo\IRcenter\data\학위관련\xl\수여학위별 현황.xlsx') as file:
    for sheet_num in range(2):
        sheet = file.sheet_by_index(sheet_num)
        nrows = sheet.nrows
        
        data = []
        for row_num in range(2,nrows):
            data.append({
                'category': sheet.cell_value(row_num,0),
                'bachelor' : sheet.cell_value(row_num,1),
                'master' : sheet.cell_value(row_num,2),
                'doctor' : sheet.cell_value(row_num,3),            
            })
        for d in data:
            for key,item in d.items():
                if item == '-':
                    d[key] = 0
                elif type(item) == float:
                    d[key] = int(item)
        with open(r'C:\Users\taeyo\IRcenter\data\학위관련\json\\'+str(2019-sheet_num)+'_dgree_by_major.json','w',encoding='UTF-8-sig') as fout:
            fout.write(json.dumps(data, ensure_ascii=False))
        