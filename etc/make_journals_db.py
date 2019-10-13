import sqlite3
import xlrd
from pprint import pprint
import json

def make_db():
    file = xlrd.open_workbook(r'C:\IR\(지표1)2017 IF, JCR 상위 List.xlsx')
    sheet = file.sheet_by_index(0)
    nrows = sheet.nrows
    data = {}    

    for row_num in range(6,nrows):
        data[row_num-6] = {}
        for col in range(7):
            data[row_num-6][col] = sheet.cell_value(row_num,col)

    con = sqlite3.connect(r'C:\IR\Journals.db')
    cur = con.cursor()
    for i in range(1950,2020):
        cur.execute("CREATE TABLE '"+str(i)+"'(Title text, ISSN text, Category text, JCR float, IF float, Collection text);")

    sql = "insert into '2017'(Title,ISSN,Category,JCR,IF,Collection) values (?,?,?,?,?,?)"
    for rows in range(nrows-6):    
        cur.execute(sql, (data[rows][1].upper(),data[rows][2].upper(),data[rows][3].upper(),data[rows][4],data[rows][5],data[rows][6].upper()))
        con.commit()
    con.close()
    
def make_json_from_db():
    with sqlite3.connect(r'C:\IR\Journals.db') as con:
        cur = con.cursor()        
        cur.execute("select * from '2017'")
        rows = cur.fetchall()
        data = []
        for row in rows:
            match = {'title':row[0],
            'issn':row[1],
            'category':row[2],
            'jcr':row[3],
            'if':row[4],
            'collection':row[5]}
            data.append(match)
        # pprint(data)
    
    with open('journals.json','w',encoding='UTF-8-sig') as outfile:
        outfile.write(json.dumps(data,ensure_ascii=False))
    
if __name__ == "__main__":
    make_json_from_db()    