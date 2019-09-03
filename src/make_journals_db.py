import sqlite3
import xlrd
from pprint import pprint


file = xlrd.open_workbook(r'C:\IR\(지표1)2017 IF, JCR 상위 List.xlsx')
sheet = file.sheet_by_index(0)
nrows = sheet.nrows
data = {}
cols = ['year','title','issn','category','jcr','if','sci']

for row_num in range(6,nrows):
    data[row_num-6] = {}
    for col in range(7):
        data[row_num-6][col] = sheet.cell_value(row_num,col)

con = sqlite3.connect('C:\IR\Journals.db')
cur = con.cursor()
for i in range(1950,2020):
     cur.execute("CREATE TABLE '"+str(i)+"'(Title text, ISSN text, Category text, JCR float, IF float, Collection text);")

sql = "insert into '2017'(Title,ISSN,Category,JCR,IF,Collection) values (?,?,?,?,?,?)"
for rows in range(nrows-6):    
    cur.execute(sql, (data[rows][1].lower(),data[rows][2].lower(),data[rows][3].lower(),data[rows][4],data[rows][5],data[rows][6].lower()))
    con.commit()
cur.execute("select * from '2017'")
rows = cur.fetchall()
for row in rows:
    print(row)
    
con.close()
