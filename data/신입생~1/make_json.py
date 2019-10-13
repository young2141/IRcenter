import xlrd,os,json
from pprint import pprint
file_list = os.listdir('./')
file_list.sort()
# 일반고, 특수목적고, 특성화고, 자율고, 기타 총입학자수.

for file_name in file_list:
    if file_name.find('.xls') != -1 and int(file_name[:4]) >= 2013:
        year = int(file_name[:4])
        file = xlrd.open_workbook(file_name)
        sheet = file.sheet_by_index(0)
        nrow = sheet.nrows
        ppl_by_school_type = {'normal':0, 'special_intent':0,'specified':0,'free':0,'etc':0}
        for row_num in range(6,nrow-1):
            ppl_by_school_type['normal'] += int(sheet.cell_value(row_num, 6))
            ppl_by_school_type['special_intent'] += int(sheet.cell_value(row_num, 8))
            ppl_by_school_type['special_intent'] += int(sheet.cell_value(row_num, 10))
            ppl_by_school_type['special_intent'] += int(sheet.cell_value(row_num, 12))
            ppl_by_school_type['special_intent'] += int(sheet.cell_value(row_num, 14))
            ppl_by_school_type['specified'] += int(sheet.cell_value(row_num, 16))
            ppl_by_school_type['free'] += int(sheet.cell_value(row_num, 18))
            ppl_by_school_type['etc'] += int(sheet.cell_value(row_num, 20))
            ppl_by_school_type['etc'] += int(sheet.cell_value(row_num, 22))
            ppl_by_school_type['etc'] += int(sheet.cell_value(row_num, 24))
        print(str(year)+':',end='')
        pprint(ppl_by_school_type)
        with open(str(year)+'.json','w',encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(ppl_by_school_type,ensure_ascii=False))
    