# -*- coding: utf-8 -*-
import os
import xlrd
import json
from pprint import pprint


json_data = open('working on/sort.json').read()
data = json.loads(json_data)
categories = {
    "인문사회": "society",
    "자연과학": "science",
    "공학": "mech",
    "예체능": "artphysical"
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

for year in range(2010, 2018):
    with xlrd.open_workbook('working on/xl/graduate/'+str(2010)+'.xls') as wb:
        sheet = wb.sheet_by_index(0)
        n = sheet.nrows
        for row in range(2, n):
            if sheet.cell_value(row, 4) in data:
                outj[sheet.cell_value(row, 4).encode('utf-8')] = {}

        with open('data' + str(year)+'.json', 'w') as f:
            json.dump(outj, f, ensure_ascii=False, indent=4)
