
from pprint import pprint
import openpyxl
import xlrd
import json
import os
# out : C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over
path_dir = r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\fund\\'
file_list = os.listdir(path_dir)
file_list.sort()
for file_name in file_list:
    year, _ = file_name.split('.')
    year = int(year)
    out = {
        'within': {
            'recruitment_within_admission': 0,
            'applied_within_admission': 0,
            'admitted_within_admission': 0,
            'within_recruitment_rate': 0,
            'within_competition_rate': 0
        },
        'over': {
            'recruitment_over_admission': 0,
            'applied_over_admission': 0,
            'admitted_over_admission': 0,
            'over_recruitment_rate': 0,
            'over_competition_rate': 0,
        },
        'total': {
            'total_recruitment': 0,
            'total_applied': 0,
            'total_admitted': 0,
            'total_recruitment_rate': 0,
            'total_competition_rate': 0,
        },
    }

    with open(path_dir+str(file_name), 'r', encoding='UTF-8-sig') as jfile:
        data = json.load(jfile)
        for major in data:
            out['within']['recruitment_within_admission'] += major['recruitment_within_admission']
            out['within']['applied_within_admission'] += major['applied_within_admission']
            out['within']['admitted_within_admission'] += major['man_admitted_within_admission'] + \
                major['woman_admitted_within_admission']
            out['over']['recruitment_over_admission'] += major['recruitment_over_admission']
            out['over']['applied_over_admission'] += major['applied_over_admission']
            out['over']['admitted_over_admission'] += major['man_admitted_over_admission'] + \
                major['woman_admitted_over_admission']
            out['total']['total_recruitment'] += major['total_recruitment']
            out['total']['total_applied'] += major['total_applied']
            out['total']['total_admitted'] += major['total_admitted']

    # 충원율 : 입학자 / 모집인원, 경쟁률 : 지원자 / 모집인원
    out['within']['within_recruitment_rate'] = out['within']['admitted_within_admission'] / \
        out['within']['recruitment_within_admission'] * 100
    out['within']['within_competition_rate'] = out['within']['applied_within_admission'] / \
        out['within']['recruitment_within_admission']
    out['over']['over_recruitment_rate'] = out['over']['admitted_over_admission'] / \
        out['over']['recruitment_over_admission'] * 100
    out['over']['over_competition_rate'] = out['over']['applied_over_admission'] / \
        out['over']['recruitment_over_admission']
    out['total']['total_recruitment_rate'] = out['total']['total_admitted'] / \
        out['total']['total_recruitment'] * 100
    out['total']['total_competition_rate'] = out['total']['total_applied'] / \
        out['total']['total_recruitment']

    split = {
        'rates': {
            'within': {
                'within_recruitment_rate': 0,
                'within_competition_rate': 0
            },
            'over': {
                'over_recruitment_rate': 0,
                'over_competition_rate': 0,
            },
            'total': {
                'total_recruitment_rate': 0,
                'total_competition_rate': 0,
            },
        },
        'ara': {
            'within': {
                'recruitment_within_admission': 0,
                'applied_within_admission': 0,
                'admitted_within_admission': 0,
            },
            'over': {
                'recruitment_over_admission': 0,
                'applied_over_admission': 0,
                'admitted_over_admission': 0,
            },
            'total': {
                'total_recruitment': 0,
                'total_applied': 0,
                'total_admitted': 0,
            },
        },
    }
    for key, item in out.items():
        for k, i in item.items():
            if i//1 == i:
                split['ara'][key][k] = int(i)
            else:
                split['rates'][key][k] = round(i, 2)
    '''
    카테고리 : 정원내 / 정원외 / 전체
    지원, 모집, 입학 / 경쟁, 충원 '''
    
    for key, item in out.items():
        with open(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over\\' + str(year) + '_ARA' + '.json', 'w', encoding='UTF-8-sig') as ara:
            ara.write(json.dumps(split['ara'], ensure_ascii=False))
        with open(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over\\' + str(year) + '_rates' + '.json', 'w', encoding='UTF-8-sig') as rates:
            rates.write(json.dumps(split['rates'], ensure_ascii=False))