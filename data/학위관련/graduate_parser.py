import xlrd
from pprint import pprint


def get_data_from_sheet(sheet):
    nrows = sheet.nrows
    ret = []
    for row_num in range(2, nrows):
        major = sheet.cell_value(row_num, 0)
        bachelor = sheet.cell_value(row_num, 1)
        master = sheet.cell_value(row_num, 2)
        phd = sheet.cell_value(row_num, 3)

        if major == '' or bachelor == '':
            continue
        if bachelor == '-':
            bachelor = 0
        if master == '-':
            master = 0
        if phd == '-':
            phd = 0
        ret.append([major,  int(bachelor),   int(master)+int(phd) ])
    return ret

data = []
with xlrd.open_workbook(r'C:\Users\taeyo\IRcenter\data\학위관련\학위수여2.xlsx') as file:
    sheet = file.sheet_by_index(2)
    data += get_data_from_sheet(sheet)
    sheet = file.sheet_by_index(3)
    data += get_data_from_sheet(sheet)
    data.sort(key=lambda data: data[1],reverse = True)
    bach = []
    for i in range(10):
        bach.append({
            'major': data[i][0],
            'bachelor': data[i][1]        
        })
    data.sort(key=lambda data: data[2],reverse = True)
    mop = []
    for i in range(10):
        mop.append({
            'major': data[i][0],
            'master_or_phd': data[i][2]        
        })
        
    pprint(bach)
    pprint(mop)
    
        