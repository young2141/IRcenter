import json,xlrd
from pprint import pprint
import re

for name in range(2010, 2020):
    print(name)
    dirr = r'C:\IR\지원자,모집인원,입학자\\'
    with open(dirr + str(name)+'.json','r',encoding='UTF-8-sig') as jf:
        data = json.load(jf)
        
        applied,recruitment,admitted,B,C,out = 0,0,0,0,0,[]
        for d in data:
            applied += d['total_applied']
            recruitment += d['total_recruitment']
            admitted += d['total_admitted']
            B += d['recruitment_within_admission']
            C += d['applied_within_admission']
        out.append({
            '지원':
            '모집':
            '입학':
            '경쟁률':
            '충원율':        
        })
        
        with open(name+'_sumed'+'.json','w',encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(out,ensure_ascii=False))
        