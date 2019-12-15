# -*- coding: utf-8 -*-
import os
import xlrd
import json
import re
from pprint import pprint


json_data = open('working on/parser/sort.json', encoding='utf-8').read()
sorter = json.loads(json_data)
categories = {
    "인문사회계열": "society",  # "society"
    "자연과학계열": "science",  # "science"
    "공학계열": "mech",  # "mech"
    "예체능계열": "artphysical",  # "artphysical"
    "의학계열": "의학계열"
}
outj = []


for year in range(2010, 2018):
    calculator = {
        "all": {
            "maleA": 0,
            "maleB": 0,
            "femaleA": 0,
            "femaleB": 0
        },
        "science": {
            "maleA": 0,
            "maleB": 0,
            "femaleA": 0,
            "femaleB": 0
        },
        "artphysical": {
            "maleA": 0,
            "maleB": 0,
            "femaleA": 0,
            "femaleB": 0
        },
        "mech": {
            "maleA": 0,
            "maleB": 0,
            "femaleA": 0,
            "femaleB": 0
        },
        "society": {
            "maleA": 0,
            "maleB": 0,
            "femaleA": 0,
            "femaleB": 0
        },
    }
    if year >= 2014:
        starter = 4
    else:
        starter = 3

    with xlrd.open_workbook('working on/xl/college/'+str(year)+'.xls') as wb:
        sheet = wb.sheet_by_index(0)
        n = sheet.nrows
        for row in range(starter, n):
            major = sheet.cell_value(row, 4)
            p = re.compile(r'([ 가-힣|(|)|,|・|.|/a-zA-Z]*)([\d]+)')
            m = p.match(major)
            if m:
                major = m.group(1)[:-1]

            if major in sorter:
                colleague = categories[sorter[major]]
                if colleague == '의학계열':
                    continue

                calculator[colleague]['maleA'] += int(sheet.cell_value(row, 7))
                calculator[colleague]['maleB'] += int(sheet.cell_value(row, 9))
                calculator[colleague]['femaleA'] += int(
                    sheet.cell_value(row, 8))
                calculator[colleague]['femaleB'] += int(
                    sheet.cell_value(row, 10))
                calculator['all']['maleA'] += int(sheet.cell_value(row, 7))
                calculator['all']['maleB'] += int(sheet.cell_value(row, 9))
                calculator['all']['femaleA'] += int(
                    sheet.cell_value(row, 8))
                calculator['all']['femaleB'] += int(
                    sheet.cell_value(row, 10))

        pprint(calculator)

        tmp = {
            "all": {
                "all": 0,
                "male": 0,
                "female": 0},
            "science": {
                "all": 0,
                "male": 0,
                "female": 0},
            "artphysical": {
                "all": 0,
                "male": 0,
                "female": 0},
            "mech": {
                "all": 0,
                "male": 0,
                "female": 0},
            "society": {
                "all": 0,
                "male": 0,
                "female": 0},
        }

        for cat in tmp:
            for sex in tmp[cat]:
                if sex == 'all':
                    tmp[cat][sex] = round((calculator[cat]['maleB'] + calculator[cat]['femaleB']) / (
                        calculator[cat]['maleA'] + calculator[cat]['femaleA']) * 100, 2)
                else:
                    tmp[cat][sex] = round(
                        calculator[cat][sex+'B'] / calculator[cat][sex+'A'] * 100, 2)

        tmp['year'] = str(year)
        outj.append(tmp)

with open('college_rate.json', 'w') as f:
    json.dump(outj, f, ensure_ascii=False, indent=4)
