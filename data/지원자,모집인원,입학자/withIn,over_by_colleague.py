import json,xlrd
from pprint import pprint
import re

for name in range(2010, 2020):
    print(name)
    dirr = r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\fund\\'
    with open(dirr + str(name)+'.json','r',encoding='UTF-8-sig') as jf:
        data = json.load(jf)
        colleague_type = {'자연과학계열':0, '공학계열':1,'예체능계열':2,'의학계열':3,'인문사회계열':4}
        colleague = [[] for _ in range(5)]

        with xlrd.open_workbook(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\xl_data\학과분류.xlsx') as xf:
            sheet = xf.sheet_by_index(1)
            nrows = sheet.nrows
            applied,recruitment,admitted,B,C,D = [0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]
            tot_applied, tot_recuitment, tot_admitted = [0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]

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
                        applied[num] += d['applied_over_admission']
                        recruitment[num] += d['recruitment_over_admission']
                        admitted[num] += d['man_admitted_over_admission'] + d['woman_admitted_over_admission']
                        B[num] += d['recruitment_within_admission']
                        C[num] += d['applied_within_admission']
                        D[num] += d['man_admitted_within_admission']+d['woman_admitted_within_admission']
                        tot_applied[num] += d['total_applied']
                        tot_admitted[num] += d['total_admitted']
                        tot_recuitment[num] += d['total_recruitment']
                        break
                else:
                    if d['major'] in c: 
                        applied[num] += d['applied_over_admission']
                        recruitment[num] += d['recruitment_over_admission']
                        admitted[num] += d['man_admitted_over_admission'] + d['woman_admitted_over_admission']
                        B[num] += d['recruitment_within_admission']
                        C[num] += d['applied_within_admission']
                        D[num] += d['man_admitted_within_admission']+d['woman_admitted_within_admission']    
                        tot_applied[num] += d['total_applied']
                        tot_admitted[num] += d['total_admitted']
                        tot_recuitment[num] += d['total_recruitment']
                        break
            else:
                #print("{} not found".format(d['major']))
                applied[5] += d['applied_over_admission']
                recruitment[5] += d['recruitment_over_admission']
                admitted[5] += d['man_admitted_over_admission'] + d['woman_admitted_over_admission']
                B[5] += d['recruitment_within_admission']
                C[5] += d['applied_within_admission']
                D[5] += d['man_admitted_within_admission']+d['woman_admitted_within_admission']    
                tot_applied[5] += d['total_applied']
                tot_admitted[5] += d['total_admitted']
                tot_recuitment[5] += d['total_recruitment']

        within_rate = []
        for i in range(6):
            try:
                recuit_rate = round(D[i] / B[i] * 100,2)
            except ZeroDivisionError:
                recuit_rate = 0
            try:
                compet_rate = round(C[i] / B[i],2)
            except ZeroDivisionError:
                compet_rate = 0
            within_rate.append([recuit_rate, compet_rate])
            
        # B =  recuit, C = apply, D = admit // within
        within = {
            'total': {                
                'applied' : int(sum(C)),
                'recruitment': int(sum(B)),
                'admitted' : int(sum(D)),
                'recruitment_rate': round(sum(D) / sum(B) * 100,2),
                'competition_rate': round(sum(C) / sum(B),2)                
            },
            '자연과학' : {
                'applied' : int(C[0]),
                'recruitment': int(B[0]),
                'admitted' : int(D[0]),
                'recruitment_rate': within_rate[0][0],
                'competition_rate': within_rate[0][1]
            },
            '예체능': {
                'applied' : int(C[1]),
                'recruitment': int(B[1]),
                'admitted' : int(D[1]),
                'recruitment_rate': within_rate[1][0],
                'competition_rate': within_rate[1][1]
            },
            '공학':{
                'applied' : int(C[2]),
                'recruitment': int(B[2]),
                'admitted' : int(D[2]),
                'recruitment_rate': within_rate[2][0],
                'competition_rate': within_rate[2][1]
            },
            '의학':{
                'applied' : int(C[3]),
                'recruitment': int(B[3]),
                'admitted' : int(D[3]),
                'recruitment_rate': within_rate[3][0],
                'competition_rate': within_rate[3][1]
            },
            '인문사회':{
                'applied' : int(C[4]),
                'recruitment': int(B[4]),
                'admitted' : int(D[4]),
                'recruitment_rate': within_rate[4][0],
                'competition_rate': within_rate[4][1]
            },
            '기타':{
                'applied' : int(C[5]),
                'recruitment': int(B[5]),
                'admitted' : int(D[5]),
                'recruitment_rate': within_rate[5][0],
                'competition_rate': within_rate[5][1]
            },
        }
        
        
        # B =  recuit, C = apply, D = admit // within
        over_rate = []
        for i in range(6):
            try:
                recuit_rate = round(admitted[i] / recruitment[i] * 100,2)
            except ZeroDivisionError:
                recuit_rate = 0
            try:
                compet_rate = round(applied[i] / recruitment[i],2)
            except ZeroDivisionError:
                compet_rate = 0
            over_rate.append([recuit_rate, compet_rate])

        over = {
            'total':{
                'applied' : int(sum(applied)),
                'recruitment': int(sum(recruitment)),
                'admitted' : int(sum(admitted)),
                'recruitment_rate': round(sum(admitted) / sum(recruitment) * 100,2),
                'competition_rate': round(sum(applied) / sum(recruitment),2)
            },
            '자연과학':{
                'applied' : int(applied[0]),
                'recruitment': int(recruitment[0]),
                'admitted' : int(admitted[0]),
                'recruitment_rate': over_rate[0][0],
                'competition_rate': over_rate[0][1]
            },
            '예체능':{
                'applied' : int(applied[1]),
                'recruitment': int(recruitment[1]),
                'admitted' : int(admitted[1]),
                'recruitment_rate': over_rate[1][0],
                'competition_rate': over_rate[1][1]
            },
            '공학':{
                'applied' : int(applied[2]),
                'recruitment': int(recruitment[2]),
                'admitted' : int(admitted[2]),
                'recruitment_rate': over_rate[2][0],
                'competition_rate': over_rate[2][1]
            },
            '의학':{
                'applied' : int(applied[3]),
                'recruitment': int(recruitment[3]),
                'admitted' : int(admitted[3]),
                'recruitment_rate': over_rate[3][0],
                'competition_rate': over_rate[3][1]
            },
            '인문사회':{
                'applied' : int(applied[4]),
                'recruitment': int(recruitment[4]),
                'admitted' : int(admitted[4]),
                'recruitment_rate': over_rate[4][0],
                'competition_rate': over_rate[4][1]
            },
            '기타':{
                'category' : '기타',
                'applied' : int(applied[5]),
                'recruitment': int(recruitment[5]),
                'admitted' : int(admitted[5]),
                'recruitment_rate': over_rate[5][0],
                'competition_rate': over_rate[5][1]
            }
        }
        
        # B =  recuit, C = apply, D = admit // within
        total_rate = []
        for i in range(6):
            try:
                recuit_rate = round(tot_admitted[i] / tot_recuitment[i] * 100,2)
            except ZeroDivisionError:
                recuit_rate = 0
            try:
                compet_rate = round(tot_applied[i] / tot_recuitment[i],2)
            except ZeroDivisionError:
                compet_rate = 0
            total_rate.append([recuit_rate, compet_rate])
        
        total  = {
            'total': {                
                'applied' : int(sum(tot_applied)),
                'recruitment': int(sum(tot_recuitment)),
                'admitted' : int(sum(tot_admitted)),
                'recruitment_rate': round(sum(tot_admitted) / sum(tot_recuitment) * 100,2),
                'competition_rate': round(sum(tot_applied) / sum(tot_recuitment),2)                
            },
            '자연과학' : {
                'applied' : int(tot_applied[0]),
                'recruitment': int(tot_recuitment[0]),
                'admitted' : int(tot_admitted[0]),
                'recruitment_rate': total_rate[0][0],
                'competition_rate': total_rate[0][1]
            },
            '예체능': {
                'applied' : int(tot_applied[1]),
                'recruitment': int(tot_recuitment[1]),
                'admitted' : int(tot_admitted[1]),
                'recruitment_rate': total_rate[1][0],
                'competition_rate': total_rate[1][1]
            },
            '공학':{
                'applied' : int(tot_applied[2]),
                'recruitment': int(tot_recuitment[2]),
                'admitted' : int(tot_admitted[2]),
                'recruitment_rate': total_rate[2][0],
                'competition_rate': total_rate[2][1]
            },
            '의학':{
                'applied' : int(tot_applied[3]),
                'recruitment': int(tot_recuitment[3]),
                'admitted' : int(tot_admitted[3]),
                'recruitment_rate': total_rate[3][0],
                'competition_rate': total_rate[3][1]
            },
            '인문사회':{
                'applied' : int(tot_applied[4]),
                'recruitment': int(tot_recuitment[4]),
                'admitted' : int(tot_admitted[4]),
                'recruitment_rate': total_rate[4][0],
                'competition_rate': total_rate[4][1]
            },
            '기타':{
                'applied' : int(tot_applied[5]),
                'recruitment': int(tot_recuitment[5]),
                'admitted' : int(tot_admitted[5]),
                'recruitment_rate': total_rate[5][0],
                'competition_rate': total_rate[5][1]
            },
        }

        with open(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over_by_colleague\\'+'4page_'+str(name)+'_colleage_within'+'.json','w',encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(within,ensure_ascii=False))
        with open(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over_by_colleague\\'+'4page_'+str(name)+'_colleage_over'+'.json','w',encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(over,ensure_ascii=False))
        with open(r'C:\Users\taeyo\IRcenter\data\지원자,모집인원,입학자\json_data\with,over_by_colleague\\'+'4page_'+str(name)+'_colleage_total'+'.json','w',encoding='UTF-8-sig') as outfile:
            outfile.write(json.dumps(total,ensure_ascii=False))
        