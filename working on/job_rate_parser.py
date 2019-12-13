# -*- coding: utf-8 -*-
import os
import xlrd
import json
import re
from pprint import pprint


json_data = open('working on/sort.json', encoding='utf-8').read()
sorter = json.loads(json_data)
categories = {
    "인문사회계열": 1,  # "society"
    "자연과학계열": 2,  # "science"
    "공학계열": 3,  # "mech"
    "예체능계열":  4  # "artphysical"
}
ex = {
    "year": "2011",
    "all": 7.99,
    "science": 6.94,
    "artphysical": 7.23,
    "mech": 6.06,
    "society": 9.8
}
outj = []
calculator = [[0 for _ in range(2)] for _ in range(5)]

for year in range(2010, 2018):
    print(year)
    if year >= 2011:
        starter = 4
    else:
        starter = 4

    with xlrd.open_workbook('working on/xl/job/'+str(year)+'.xls') as wb:
        sheet = wb.sheet_by_index(0)
        n = sheet.nrows
        for row in range(starter, n):
            major = sheet.cell_value(row, 4)
            p = re.compile(r'([ 가-힣|(|)|,|・|.|/a-zA-Z]*)([\d]+)')
            m = p.match(major)
            if m:
                major = m.group(1)[:-1]

            # print(major)
            A = int(sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 10)) + \
                int(sheet.cell_value(row, 11)) + int(sheet.cell_value(row, 12))
            B = int(sheet.cell_value(row, 7)) + int(sheet.cell_value(row, 8)) - \
                int(sheet.cell_value(row, 13)) - \
                int(sheet.cell_value(row, 14)) - int(sheet.cell_value(row, 15)) -\
                int(sheet.cell_value(row, 16)) - int(sheet.cell_value(row, 17)) -\
                int(sheet.cell_value(row, 18)) - int(sheet.cell_value(row, 19)) -\
                int(sheet.cell_value(row, 20)) - int(sheet.cell_value(row, 21))
            if major == '융복합시스템공학부 플랜트시스템전공':
                calculator[3][0] += A
                calculator[categories[colleague]][1] += B

            if major in sorter:
                colleague = sorter[major]
                if colleague == '의학계열':
                    continue
                calculator[categories[colleague]][0] += A
                calculator[categories[colleague]][1] += B
                # print(major, B, A)
            else:
                print('exception : '+major+' not found')

        totA = totB = 0
        for i in range(1, 5):
            totA += calculator[i][1]
            totB += calculator[i][0]
        try:
            tmp = {}
            tmp['year'] = year
            tmp['all'] = round(totB/totA, 2)
            tmp['science'] = round(calculator[2][0] / calculator[2][1], 2)
            tmp['artphysical'] = round(calculator[4][0] / calculator[4][1], 2)
            tmp['mech'] = round(calculator[3][0] / calculator[3][1], 2)
            tmp['society'] = round(calculator[1][0] / calculator[1][1], 2)
        except:
            pass
        outj.append(tmp)

with open('job_rate.json', 'w') as f:
    json.dump(outj, f, ensure_ascii=False, indent=4)
