import json,xlrd
from pprint import pprint
import re

for name in range(2010, 2020):
    print(name)
    dirr = r'C:\IR\지원자,모집인원,입학자\\'
    with open(dirr + str(name)+'.json','r',encoding='UTF-8-sig') as jf:
        data = json.load(jf)
        
        with xlrd.open_workbook(r'C:\IR\지원자,모집인원,입학자\학과분류.xlsx') as xf:
            sheet = xf.sheet_by_index(1)
            nrows = sheet.nrows
            
            colleague_type = {'자연과학계열':0, '공학계열':1,'예체능계열':2,'의학계열':3,'인문사회계열':4}
            colleague = [[] for _ in range(5)]
            applied = [0,0,0,0,0,0]
            recruitment = [0,0,0,0,0,0]
            admitted = [0,0,0,0,0,0]
            
            #지원, 모집, 입학
            
            
            for row_num in range(2,nrows):
                try:
                    colleague[colleague_type[sheet.cell_value(row_num, 8)]].append(sheet.cell_value(row_num,1))
                    colleague[colleague_type[sheet.cell_value(row_num, 8)]].append(sheet.cell_value(row_num,4))
                except Exception as e:
                    print('error at :{}'.format(sheet.cell_value(row_num,13)))
                #1=code, 4=major, 8= colleague
            
        
        for d in data: 
            for num,c in enumerate(colleague):
                code = re.compile(r'\d+')
                code_value = code.search(d['major'])
                if code_value:                
                    if str(code_value.group()) in c:
                        applied[num] += d['total_applied']
                        recruitment[num] += d['total_recruitment']
                        admitted[num] += d['total_admitted']
                        break
                else:
                    if d['major'] in c: 
                        applied[num] += d['total_applied']
                        recruitment[num] += d['total_recruitment']
                        admitted[num] += d['total_admitted']
                        break
            else:
                #print("{} not found".format(d['major']))
                applied[5] += d['total_applied']
                recruitment[5] += d['total_recruitment']
                admitted[5] += d['total_admitted']
        print('지원:')
        for key, value in colleague_type.items():
            print(str(key)+':'+str(int(applied[value])),end=' ')
        print('기타: '+ str(int(applied[5])),end=' ')
        print('전체: '+ str(int(sum(applied))))
        print('모집:')
        for key, value in colleague_type.items():
            print(str(key)+':'+str(int(recruitment[value])),end=' ')
        print('기타: '+ str(int(recruitment[5])),end=' ')
        print('전체: '+ str(int(sum(recruitment))))
        print('입학:')
        for key, value in colleague_type.items():
            print(str(key)+':'+str(int(admitted[value])),end=' ')
        print('기타: '+ str(int(admitted[5])),end=' ')
        print('전체: '+ str(int(sum(admitted))))        
        print('-----------------------------------------------\n')
        
            

        
                    