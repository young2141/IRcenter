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

for year in range(2010, 2020):
    starter = 3
    calculator = {
        "all": {
            "all": 0,
            "male": 0,
            "female": 0,
            "time taken": 0,
            "count": 0
        },
        "science": {
            "all": 0,
            "male": 0,
            "female": 0,
            "time taken": 0,
            "count": 0
        },
        "artphysical": {
            "all": 0,
            "male": 0,
            "female": 0,
            "time taken": 0,
            "count": 0
        },
        "mech": {
            "all": 0,
            "male": 0,
            "female": 0,
            "time taken": 0,
            "count": 0
        },
        "society": {
            "all": 0,
            "male": 0,
            "female": 0,
            "time taken": 0,
            "count": 0
        }
    }

    with xlrd.open_workbook('working on/xl/graduate/'+str(year)+'.xls') as wb:
        sheet = wb.sheet_by_index(0)
        n = sheet.nrows
        for row in range(starter, n):
            major = sheet.cell_value(row, 4)
            p = re.compile(r'([ 가-힣|(|)|,|・|.|/a-zA-Z]*)([\d]+)')
            m = p.match(major)
            if m:
                major = m.group(1)[:-1]

            male = int(sheet.cell_value(row, 10))
            female = int(sheet.cell_value(row, 11))
            time_taken = sheet.cell_value(row, 12)
            #print(major, male, female, time_taken)
            if not male and not female:
                continue
            y = month = -1
            calculator['year'] = str(year-1)+'-'+str(year)

            for s in reversed(time_taken):
                # print(s)
                if str.isdigit(s):
                    if month == -1:
                        month = int(s)
                    elif y == -1:
                        y = int(s)
                    elif y != -1:
                        y += int(s) * 10

            if major in sorter:
                colleague = categories[sorter[major]]
                if colleague == '의학계열':
                    continue
                calculator[colleague]['all'] += male + female
                calculator[colleague]['male'] += male
                calculator[colleague]['female'] += female
                calculator[colleague]['time taken'] += (y + month/12)
                calculator[colleague]['count'] += 1
            else:
                print('exception : '+major+' not found')

            calculator['all']['all'] = calculator['science']['all'] + \
                calculator['artphysical']['all'] + \
                calculator['mech']['all'] + calculator['society']['all']
            calculator['all']['male'] = calculator['science']['male'] + \
                calculator['artphysical']['male'] + \
                calculator['mech']['male'] + calculator['society']['male']
            calculator['all']['female'] = calculator['science']['female'] + \
                calculator['artphysical']['female'] + \
                calculator['mech']['female'] + calculator['society']['female']
            calculator['all']['time taken'] = calculator['science']['time taken'] + \
                calculator['artphysical']['time taken'] + \
                calculator['mech']['time taken'] + \
                calculator['society']['time taken']
            calculator['all']['count'] = calculator['science']['count'] + \
                calculator['artphysical']['count'] + \
                calculator['mech']['count'] + calculator['society']['count']

        outj.append(calculator)

with open('working on/json/grad_info.json', 'w') as f:
    json.dump(outj, f, ensure_ascii=False, indent=4)
