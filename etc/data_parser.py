# excel to json

import openpyxl, xlrd
import pandas as pd
import json,os

# file = openpyxl.load_workbook('./2019_경북대학교_본교_4-다.xls')
#df = pd.read_excel('./2019_경북대학교_본교_4-다.xls',shee_name = 'empty')
path_dir = './지원자, 모집인원, 입학자'
file_list = os.listdir(path_dir)
file_list.sort()

for file_name in file_list:
    file = xlrd.open_workbook('./지원자, 모집인원, 입학자/'+file_name)
    sheet = file.sheet_by_index(0)
    nrows = sheet.nrows

    data = []
    for row_num in range(4,nrows-1):
        data.append({
            'year':sheet.cell_value(row_num,0),
            'university':sheet.cell_value(row_num,1),
            'college':sheet.cell_value(row_num,2),
            'major':sheet.cell_value(row_num,3),
            'time':sheet.cell_value(row_num,4),
            'course':sheet.cell_value(row_num,5),
            'admission':sheet.cell_value(row_num,6),
            'total_recruitment':sheet.cell_value(row_num,7),
            'recruitment_within_admission':sheet.cell_value(row_num,8),
            'recruitment_over_admission':sheet.cell_value(row_num,9),
            'total_applied':sheet.cell_value(row_num,10),
            'applied_within_admission':sheet.cell_value(row_num,11),
            'applied_over_admission':sheet.cell_value(row_num,12),
            'total_admitted':sheet.cell_value(row_num,13),
            'man_admitted_within_admission':sheet.cell_value(row_num,14),
            'woman_admitted_within_admission':sheet.cell_value(row_num,15),
            'man_admitted_over_admission':sheet.cell_value(row_num,16),
            'woman_admitted_over_admission':sheet.cell_value(row_num,17),
            'recruitment_rate':sheet.cell_value(row_num,18),
            'competition_rate':sheet.cell_value(row_num,19),
            })

    with open(file_name.split('.')[0]+'.json','w',encoding='UTF-8-sig') as outfile:
        outfile.write(json.dumps(data,ensure_ascii=False))