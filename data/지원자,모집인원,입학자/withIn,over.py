
from pprint import pprint
import openpyxl, xlrd
import json,os
# out : C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over
path_dir = r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\fund'
file_list = os.listdir(path_dir)
file_list.sort()

for file_name in file_list:
    year = int(file_name)
    out = {        
        'within':{
            'recruitment_within_admission': 0,
            'applied_within_admission' : 0,
            'admitted_within_admission' : 0,
            'within_recruitment_rate' : 0,
            'within_competition_rate' : 0
        },
        'over':{
            'recruitment_over_admission':0,
            'applied_over_admission':0,
            'admitted_over_admission':0,        
            'over_recruitment_rate' :0,
            'over_competition_rate' : 0,
        },
        'total':{
            'total_recruitment': 0,
            'total_applied' : 0,
            'total_admitted': 0,
            'total_recruitment_rate' : 0,
            'total_competition_rate' : 0,
        },
    }
    
    with open(path_dir+str(file_name)+'.json','r',encoding='UTF-8-sig') as jfile:
        data = json.load(jfile)
        for major in data:
            out['within']['recruitment_within_admission'] += major['recruitment_within_admission']
            out['within']['applied_within_admission'] += major['applied_within_admission']
            out['within']['admitted_within_admission'] += major['admitted_within_admission']
            out['over']['recruitment_over_admission'] += major['recruitment_over_admission']
            out['over']['applied_over_admission'] += major['applied_over_admission']
            out['over']['admitted_over_admission'] += major['admitted_over_admission']
            out['total']['total_recruitment'] += major['total_recruitment']
            out['total']['total_applied'] += major['total_applied']
            out['total']['total_admitted'] += major['total_admitted']
            
            
    '''TODO:
    calculate recuitment_Rate, competition_rate from within, total, over each. 
        
    
    