import json, xlrd, os
from pprint import pprint

printing_city = ('대구','경북','경남','부산','울산','서울','경기','충북','계')
file_list = os.listdir(r'C:\Users\taeyo\IRcenter\data\지역별 지원,입학\json')
for i,file_name in enumerate(file_list):
    year = 2010 + i
    jf = open(r'C:\Users\taeyo\IRcenter\data\지역별 지원,입학\json\\'+file_name,'r',encoding = 'UTF-8-sig')
    data = json.load(jf)
    
    out = []
    other_apply = 0
    other_admission = 0
    for d in data:
        if d['city'] == '계' : continue
        if d['city'] not in printing_city:
            other_apply += d['apply']
            other_admission += d['admission']
        else:
            out.append(d)
    out.append({
    'city' : '기타',
    'apply' : other_apply,
    'admission' : other_admission
    })
    with open(r'C:\Users\taeyo\IRcenter\data\지역별 지원,입학\json\\' + str(year) + '_city_re' + '.json', 'w', encoding='UTF-8-sig') as ara:
            ara.write(json.dumps(out, ensure_ascii=False))