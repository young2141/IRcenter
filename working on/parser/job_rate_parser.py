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
    print(year)
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

            # print(major) mil = 15
            A = int(sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 10)) + \
                int(sheet.cell_value(row, 11)) + int(sheet.cell_value(row, 12))

            B = int(sheet.cell_value(row, 7)) + int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 13)) -\
                int(sheet.cell_value(row, 14)) - int(sheet.cell_value(row, 15)) - int(sheet.cell_value(
                    row, 16)) - int(sheet.cell_value(row, 17)) - int(sheet.cell_value(row, 18))

            if major in sorter:
                colleague = categories[sorter[major]]
                if colleague == '의학계열':
                    continue
                if year == 2010:
                    calculator[colleague]['maleA'] += int(
                        sheet.cell_value(row, 9))
                    calculator[colleague]['femaleA'] += int(
                        sheet.cell_value(row, 10))
                    calculator["all"]['maleA'] += int(
                        sheet.cell_value(row, 9))
                    calculator["all"]['femaleA'] += int(
                        sheet.cell_value(row, 10))
                    calculator[colleague]['maleB'] += int(sheet.cell_value(row, 7)) - int(sheet.cell_value(row, 11)) - int(sheet.cell_value(row, 13)) - int(sheet.cell_value(
                        row, 15)) - int(sheet.cell_value(row, 16)) - int(sheet.cell_value(row, 18))/2
                    calculator[colleague]['femaleB'] += int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 12)) - int(
                        sheet.cell_value(row, 17)) - int(sheet.cell_value(row, 15)) - int(sheet.cell_value(row, 18))/2
                    calculator["all"]['maleB'] += int(sheet.cell_value(row, 7)) - int(sheet.cell_value(row, 11)) - int(sheet.cell_value(row, 13)) - int(sheet.cell_value(
                        row, 15)) - int(sheet.cell_value(row, 16)) - int(sheet.cell_value(row, 18))/2
                    calculator["all"]['femaleB'] += int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 12)) - int(
                        sheet.cell_value(row, 17)) - int(sheet.cell_value(row, 15)) - int(sheet.cell_value(row, 18))/2

                elif year == 2011:
                    calculator[colleague]['maleA'] += int(
                        sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 11))
                    calculator[colleague]['femaleA'] += int(
                        sheet.cell_value(row, 10)) + int(sheet.cell_value(row, 12))
                    calculator[colleague]['maleB'] += int(sheet.cell_value(row, 7)) - int(sheet.cell_value(row, 13)) - int(sheet.cell_value(
                        row, 15)) - int(sheet.cell_value(row, 16)) - int(sheet.cell_value(row, 18)) - int(sheet.cell_value(row, 20))
                    calculator[colleague]['femaleB'] += int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 14)) - int(
                        sheet.cell_value(row, 17)) - int(sheet.cell_value(row, 19)) - int(sheet.cell_value(row, 21))

                    calculator["all"]['maleA'] += int(
                        sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 11))
                    calculator["all"]['femaleA'] += int(
                        sheet.cell_value(row, 10)) + int(sheet.cell_value(row, 12))
                    calculator["all"]['maleB'] += int(sheet.cell_value(row, 7)) - int(sheet.cell_value(row, 13)) - int(sheet.cell_value(
                        row, 15)) - int(sheet.cell_value(row, 16)) - int(sheet.cell_value(row, 18)) - int(sheet.cell_value(row, 20))
                    calculator["all"]['femaleB'] += int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 14)) - int(
                        sheet.cell_value(row, 17)) - int(sheet.cell_value(row, 19)) - int(sheet.cell_value(row, 21))

                else:
                    calculator[colleague]['maleA'] += int(sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 11)) + int(sheet.cell_value(
                        row, 13)) + int(sheet.cell_value(row, 15)) + int(sheet.cell_value(row, 17)) + int(sheet.cell_value(row, 19))
                    calculator[colleague]['femaleA'] += int(sheet.cell_value(row, 10)) + int(sheet.cell_value(row, 12)) + int(
                        sheet.cell_value(row, 14)) + int(sheet.cell_value(row, 16)) + int(sheet.cell_value(row, 18)) + int(sheet.cell_value(row, 20))
                    calculator[colleague]['maleB'] += int(sheet.cell_value(row, 7)) - int(sheet.cell_value(row, 21)) - int(sheet.cell_value(
                        row, 23)) - int(sheet.cell_value(row, 24)) - int(sheet.cell_value(row, 26)) - int(sheet.cell_value(row, 28))
                    calculator[colleague]['femaleB'] += int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 22)) - int(sheet.cell_value(
                        row, 25)) - int(sheet.cell_value(row, 27)) - int(sheet.cell_value(row, 29))
                    calculator["all"]['maleA'] += int(sheet.cell_value(row, 9)) + int(sheet.cell_value(row, 11)) + int(sheet.cell_value(
                        row, 13)) + int(sheet.cell_value(row, 15)) + int(sheet.cell_value(row, 17)) + int(sheet.cell_value(row, 19))
                    calculator["all"]['femaleA'] += int(sheet.cell_value(row, 10)) + int(sheet.cell_value(row, 12)) + int(
                        sheet.cell_value(row, 14)) + int(sheet.cell_value(row, 16)) + int(sheet.cell_value(row, 18)) + int(sheet.cell_value(row, 20))
                    calculator["all"]['maleB'] += int(sheet.cell_value(row, 7)) - int(sheet.cell_value(row, 21)) - int(sheet.cell_value(
                        row, 23)) - int(sheet.cell_value(row, 24)) - int(sheet.cell_value(row, 26)) - int(sheet.cell_value(row, 28))
                    calculator["all"]['femaleB'] += int(sheet.cell_value(row, 8)) - int(sheet.cell_value(row, 22)) - int(sheet.cell_value(
                        row, 25)) - int(sheet.cell_value(row, 27)) - int(sheet.cell_value(row, 29))
                #print(major, B, A, A/B)
            else:
                print('exception : '+major+' not found')
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
                    tmp[cat][sex] = round((calculator[cat]['maleA'] + calculator[cat]['femaleA']) / (
                        calculator[cat]['maleB'] + calculator[cat]['femaleB']) * 100, 2)
                else:
                    tmp[cat][sex] = round(
                        calculator[cat][sex+'A'] / calculator[cat][sex+'B'] * 100, 2)

        tmp['year'] = str(year)
        outj.append(tmp)

with open('job_rate.json', 'w') as f:
    json.dump(outj, f, ensure_ascii=False, indent=4)
