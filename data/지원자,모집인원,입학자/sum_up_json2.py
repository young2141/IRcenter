import json,xlrd
from pprint import pprint
import re

for name in range(2010, 2020):
    print(name)
    dirr = r'C:\Users\\taeyo\IRcenter\data\지원자,모집인원,입학자\\'
    with open(dirr + str(name)+'.json','r',encoding='UTF-8-sig') as jf:
        data = json.load(jf)
        colleague_type = {'자연과학계열':0, '공학계열':1,'예체능계열':2,'의학계열':3,'인문사회계열':4}
        colleague = [[] for _ in range(5)]

        with xlrd.open_workbook(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\학과분류.xlsx') as xf:
            sheet = xf.sheet_by_index(1)
            nrows = sheet.nrows
            applied,recruitment,admitted,B,C,D = [0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]

            for row_num in range(2,nrows):
                try:
                    colleague[colleague_type[sheet.cell_value(row_num, 8)]].append(sheet.cell_value(row_num,1))
                    colleague[colleague_type[sheet.cell_value(row_num, 8)]].append(sheet.cell_value(row_num,4))
                except Exception as e:
                    print('error at :{}'.format(sheet.cell_value(row_num,13)))

        for d in data:
            for num,c in enumerate(colleague):
                code = re.compile(r'\d+')
                code_value = code.search(d['major'])
                if code_value:                
                    if str(code_value.group()) in c:
                        applied[num] += d['total_applied']
                        recruitment[num] += d['total_recruitment']
                        admitted[num] += d['total_admitted']
                        B[num] += d['recruitment_within_admission']
                        C[num] += d['applied_within_admission']
                        D[num] += d['man_admitted_within_admission']+d['woman_admitted_within_admission']
                        break
                else:
                    if d['major'] in c: 
                        applied[num] += d['total_applied']
                        recruitment[num] += d['total_recruitment']
                        admitted[num] += d['total_admitted']
                        B[num] += d['recruitment_within_admission']
                        C[num] += d['applied_within_admission']
                        D[num] += d['man_admitted_within_admission']+d['woman_admitted_within_admission']    
                        break
            else:
                #print("{} not found".format(d['major']))
                applied[5] += d['total_applied']
                recruitment[5] += d['total_recruitment']
                admitted[5] += d['total_admitted']
                B[5] += d['recruitment_within_admission']
                C[5] += d['applied_within_admission']
                D[5] += d['man_admitted_within_admission']+d['woman_admitted_within_admission']    

        B = [ 1 if x == 0 else x for x in B]
        out = [
            {
                'category' : 'total',
                'applied:' : int(sum(applied)),
                'recruitment': int(sum(recruitment)),
                'admitted' : int(sum(admitted)),
                'recruitment_rate': round(sum(D) / sum(B) * 100,2),
                'competition_rate': round(sum(C) / sum(B),2)
            },
            {
                'category' : 'Natural_science',
                'applied:' : int(applied[0]),
                'recruitment': int(recruitment[0]),
                'admitted' : int(admitted[0]),
                'recruitment_rate': round(D[0] / B[0] * 100,2),
                'competition_rate': round(C[0] / B[0],2)
            },
            {
                'category' : 'Engineering',
                'applied:' : int(applied[1]),
                'recruitment': int(recruitment[1]),
                'admitted' : int(admitted[1]),
                'recruitment_rate': round(D[1] / B[1] * 100,2),
                'competition_rate': round(C[1] / B[1],2)
            },
            {
                'category' : 'Entertain',
                'applied:' : int(applied[2]),
                'recruitment': int(recruitment[2]),
                'admitted' : int(admitted[2]),
                'recruitment_rate': round(D[2] / B[2] * 100,2),
                'competition_rate': round(C[2] / B[2],2)
            },
            {
                'category' : 'medicine',
                'applied:' : int(applied[3]),
                'recruitment': int(recruitment[3]),
                'admitted' : int(admitted[3]),
                'recruitment_rate': round(D[3] / B[3] * 100,2),
                'competition_rate': round(C[3] / B[3],2)
            },
            {
                'category' : 'humanities_and_social',
                'applied:' : int(applied[4]),
                'recruitment': int(recruitment[4]),
                'admitted' : int(admitted[4]),
                'recruitment_rate': round(D[4] / B[4] * 100,2),
                'competition_rate': round(C[4] / B[4],2)
            },
            {
                'category' : 'etc',
                'applied:' : int(applied[5]),
                'recruitment': int(recruitment[5]),
                'admitted' : int(admitted[5]),
                'recruitment_rate': round(D[5] / B[5] * 100,2),
                'competition_rate': round(C[5] / B[5],2)
            },
        ]


        with open(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\\'+str(name)+'_summed'+'.json','w',encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(out,ensure_ascii=False))
        