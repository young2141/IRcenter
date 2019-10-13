from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup 
import pandas as pd
import urllib
import requests
import csv
import sqlite3
import time

def create_tables():
    create_member_table()
    create_paper_table()
    create_journal_table()

def create_member_table():   
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor()
    cur.execute('''CREATE TABLE Members ( 
        ID integer,
        KORName text,
        ENGName text,
        GQuery text,
        TYPE text
    )''')
    conn.commit()
    conn.close()

def create_paper_table():
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor() 
    cur.execute('''CREATE TABLE Papers ( 
        Title text,
        J_Name text,
        J_ISSN text,
        F_Author text,
        C_Auther text, 
        Authers text, 
        P_Year integer, 
        P_Month integer, 
        P_day integer, 
        Reg_Year integer, 
        Reg_Month integer, 
        Reg_day integer 
    )''')
    conn.commit()
    conn.close()
    
def create_journal_table():
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor()
    cur.execute('''CREATE TABLE Journals ( 
        J_Name text,
        J_ISSN text,
        JCR integer,
        IF integer
    )''')
    conn.commit()
    conn.close()

    
def insert_professor(ID, KORName, ENGName, GQuery, Type):  
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor()
    find_sql = "SELECT * FROM Members WHERE ID='" + str(ID) + "'"
    
    if cur.execute(find_sql) != None :
        conn.close()
        return
    
    insert_sql = 'INSERT INTO Members VALUES(?,?,?,?,?)'
    cur.execute(insert_sql, (ID, KORName, ENGName, GQuery, Type))
    print('professor data' + KORName + ' is inserted' )
    conn.commit()
    conn.close()    


def get_paper_list_start():
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor()
    cur.execute( "SELECT GQuery FROM Members")
    query_str = cur.fetchall()
    conn.close()
    return query_str


def print_professor():
    print('전체 데이터 출력하기')
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor()
    cur.execute( "SELECT * FROM Members")
    print(cur.fetchall())
    conn.close()
    
def reset_table():
    print('Reset Start')
    conn = sqlite3.connect('IR_center.db')
    cur = conn.cursor()
    cur.execute('DELETE FROM Members')
    print('members del...')
    cur.execute('DELETE FROM Papers')
    print('papers del...')
    cur.execute('DELETE FROM Journals')
    print('All tables are reseted')
    conn.commit()
    conn.close()
    
    
def insert_baic_professors():
    print('hello world')
    
    
def tests():
    f1 = open('C:\\Apache24\\htdocs\\gscholar.txt', 'r')
    temp = f1.readline()
    name_index = temp.find('http')
    name = temp[0:name_index-2]
    link = temp[name_index:len(temp)]
    print(name)
    print(link)
    #for i in 
    #insert_professor(2003084, '김동균', 'Dongkyun Kim', 'IsKrxuwAAAAJ', 'Professor' )
    #insert_professor(2018516, '이성원', 'Sungwon Lee', 'IsKrxuwABAAJ', 'Professor' )
    

def make_query(input_str):
    info = 'https://scholar.google.co.kr/citations?hl=ko&user='
    info += input_str
    info += '&view_op=list_works&sortby=pubdate'
    return info
    
    
def get_paper_lists(info):    
    with requests.Session() as s:
        response = s.get(info)
        soup = BeautifulSoup(response.content, 'html.parser')
        

    table = soup.find('table', {'id' : 'gsc_a_t' })
    cnt = 0
    for tr in table.find_all('tr'):
        cnt += 1
        tds = list(tr.find_all('td')) 
        print('==========', cnt, '========')
             
        for td in tds:
            point = td.find('a').text
            print(point)
            td2 = str(td)
            point2 = td2.rfind('<div class')
            print(point2)
            tmp = td2[point2:point2+13]
            print(tmp)
            break
        
        #for td in tds:
            #i
        #for td2 in tds:
        #    if td2.find('div'):
        #        points = td2.rfind('div').text
        #        print(points)
    
def main():
    print("========start google scholar medule=======")
    print("1: create table")
    print("2: reset table")
    print("3: insert basic informations(samples)")
    print("4: insert_papers module")
    print("5: data check")

    inputs = input()

    if(inputs == str(1)):
        create_tables()
    elif(inputs == str(2)):
        reset_table()
    elif(inputs == str(3)):
        insert_baic_professors()
    elif(inputs == str(4)):
        q_str = get_paper_list_start()
        temp = str(q_str)
        temp = temp[3:-4]
        info = make_query(temp)
        get_paper_lists(info) 
    elif(inputs == str(5)):
        print("1: check Members")
        print("2: check Papers")
        print("3: check Journals")
        input2 = input()
        if(input2 == str(1)):
            print_professor()
        elif(input2 == str(2)):
            print("TBA")
        elif(input2 == str(3)):
            print("TBA")
    else:
        print("No inputs")   
    return

        
main()
tests()