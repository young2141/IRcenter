# -*- coding: utf-8 -*-
import os
import xlrd
import json
import re
from pprint import pprint


for year in range(2014, 2015):
    outj = []
    atom = {}
    with xlrd.open_workbook(r'C:\workspace\IRcenter\etc\tuition_parser\tuition/'+str(year)+'.xls') as wb:
        sheet = wb.sheet_by_index(0)
        n = sheet.nrows

        for row in range(3, n-7, 7):
            major = sheet.cell_value(row, 3)
            tuition = sheet.cell_value(row+5, 12)
            print(major, tuition)
            name = ''
            for m in major:
                if m == '(':
                    break
                name += m
            if tuition == 0:
                continue
            if tuition == '0':
                continue
            if name in atom:
                atom[name] = max(atom[name], tuition)
            else:
                atom[name] = tuition

    atom = {k: v for k, v in sorted(atom.items(), key=lambda item: item[1])}
    pprint(atom)
    for key, val in atom.items():
        tmp = {}
        tmp['major'] = key
        tmp['tuition'] = val
        outj.append(tmp)

    with open(r'C:\workspace\IRcenter\etc\tuition_parser/'+str(year)+'.json', 'w', encoding='UTF-8') as f:
        json.dump(outj, f, ensure_ascii=False, indent=4)
