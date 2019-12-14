# -*- coding: utf-8 -*-
import os
import xlrd
import json
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
    if year >= 2014:
        starter = 4
    else:
        starter = 3

    with xlrd.open_workbook('working on/xl/college/'+str(year)+'.xls') as wb:
        sheet = wb.sheet_by_index(0)
        n = sheet.nrows
        for row in range(starter, n):
            major = sheet.cell_value(row, 4)
            A = int(sheet.cell_value(row, 7)) + int(sheet.cell_value(row, 8))
            B = int(sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 10))

            if major in sorter:
                colleague = sorter[major]
                if colleague == '의학계열':
                    continue
                calculator[categories[colleague]][0] += B
                calculator[categories[colleague]][1] += A
                #print(major, B, A)

        totA = totB = 0
        for i in range(1, 5):
            totA += calculator[i][1]
            totB += calculator[i][0]

        tmp = {}
        tmp['year'] = str(year)
        tmp['all'] = round(totB/totA, 2) * 100
        tmp['science'] = round(calculator[2][0] / calculator[2][1], 2) * 100
        tmp['artphysical'] = round(
            calculator[4][0] / calculator[4][1], 2) * 100
        tmp['mech'] = round(calculator[3][0] / calculator[3][1], 2) * 100
        tmp['society'] = round(calculator[1][0] / calculator[1][1], 2) * 100

        outj.append(tmp)

with open('college_rate.json', 'w') as f:
    json.dump(outj, f, ensure_ascii=False, indent=4)
