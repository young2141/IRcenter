# To add a new cell, type '#%%'
# To add a new markdown cell, type '#%% [markdown]'
#%% Change working directory from the workspace root to the ipynb file location. Turn this addition off with the DataScience.changeDirOnImportExport setting
# ms-python.python added
import os
try:
	os.chdir(os.path.join(os.getcwd(), 'USER'))
	print(os.getcwd())
except:
	pass

#%%
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup 
from datetime import datetime
import requests
import openpyxl, xlrd
import pandas as pd
import json,os
from selenium import webdriver
from selenium.webdriver.common.keys im

port Keys
import time
import csv
import sqlite3
import re
import os
import win32api, win32con
cnt = 0

class paper:
    source = str()    
    Title = str()
    Authors = str()
    Journal_name =str()
    Progress = str()
    KNUauthor = str()
    citation = str()
    ISSN=str()
    EISSN=str()
    Publication_Day = str()
    Publication_Month = str()
    Publication_Year = str()
    Volumn = str()
    Issue = str()
    StartPage = str()
    EndPage = str()
    Early_Acess_date = str()
    Early_Acess_Year = str()
    Keyword = str()
    Reg_date = str()

    
def add_paper_from_WoS_module(date): #first operation
    for i in range(0,23):
        WoS_add_paper_from_file_to_DB(i, 'KNU')
    for i in range(0,12):
        WoS_add_paper_from_file_to_DB(i, 'PSU')
        
def add_paper_from_Scoupus_module(date): #first operation
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2016_knu1.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2016_knu2.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2017_knu1.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2017_knu2.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2018_knu1.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2018_knu2.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2019_knu1.csv', 'KNU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2019_knu2.csv', 'KNU', date)
    
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2018_Pusan1.csv', 'PSU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2018_Pusan2.csv', 'PSU', date)
    
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2019_Pusan1.csv', 'PSU', date)
    Scopus_add_paper_from_file_to_DB('rawdata\scopus_2019_Pusan2.csv', 'PSU', date)
    
def Scopus_add_paper_from_file_to_DB(filename, univ, date):
    file = open(filename, 'r',  encoding='UTF-8')  
    rdr = csv.reader(file)
    for line in rdr:
        add_scopus_paper(line, univ, date)
    file.close()     


def WoS_add_paper_from_file_to_DB(index, univ):
    if univ == 'KNU':
        file = xlrd.open_workbook(r'rawdata\Wos_KNU.xlsx')
    elif univ == 'PSU':
        file = xlrd.open_workbook(r'rawdata\Wos_PSU.xlsx')
    sheet = file.sheet_by_index(index)
    nrows = sheet.nrows
    flag = 0
    print("Module Start")
    for row_num in range(1,nrows):
        if row_num+1 == nrows:
            break
        if flag == 1:
            flag = 0
            continue
        
        temp = sheet.cell_value(row_num+1,0)  
        if temp != 'J':
            add_paper_type2(sheet, row_num, univ)
            flag =1
        else:
            add_paper_type1(sheet, row_num, univ)

def add_paper_type1(sheet, row_num, univ):
    WoSpaper = paper()
    WoSpaper.source = 'WoS'
    WoSpaper.Authors = sheet.cell_value(row_num,5)
    WoSpaper.Title = sheet.cell_value(row_num,8)
    WoSpaper.Journal_name = sheet.cell_value(row_num,9)
    WoSpaper.Progress = sheet.cell_value(row_num,13)
    WoSpaper.KNUauthor = "TBA"
    WoSpaper.Keyword = sheet.cell_value(row_num,19)
    WoSpaper.citation = sheet.cell_value(row_num,30)
    WoSpaper.ISSN = sheet.cell_value(row_num,38)
    WoSpaper.EISSN = sheet.cell_value(row_num,39)
    Publication_date = sheet.cell_value(row_num,43)
    if Publication_date == "":
        WoSpaper.Publication_Month = "undefined"
        WoSpaper.Publication_Day= "undefined"
    else:
        try :
            tmp = int(Publication_date)
            dt = datetime.fromordinal(datetime(1900, 1, 1).toordinal() + tmp - 2)
            WoSpaper.Publication_Month = tmp[5:7]
            WoSpaper.Publication_Day = tmp[9:11]
            print(WoSpaper.Publication_Month, "//", WoSpaper.Publication_Day )
        except Exception as e :
            WoSpaper.Publication_Month = "undefined"
            WoSpaper.Publication_Day= "undefined"
            tmp = Publication_date
            months = ["null", "JAN","FEB", "MAR", "APR","MAY", "JUN", "JUL" ,"AUG", "SEP", "OCT", "NOV", "DEC"]
            for i in range(1, 13):
                if months[i] == tmp:
                    WoSpaper.Publication_Month = str(i)
    WoSpaper.Publication_Year = sheet.cell_value(row_num,44)
    WoSpaper.Volumn = sheet.cell_value(row_num,45)
    WoSpaper.Issue = sheet.cell_value(row_num,46)
    WoSpaper.StartPage = sheet.cell_value(row_num,51)
    WoSpaper.EndPage = sheet.cell_value(row_num,52)
    WoSpaper.Early_Acess_date = sheet.cell_value(row_num,56)
    WoSpaper.Early_Acess_Year = sheet.cell_value(row_num,57)
    WoSpaper.Reg_date = '2019-09-24'

    if len(str(WoSpaper.ISSN)) == 9:
        add_paper_to_DB(WoSpaper, univ)
    elif len(str(WoSpaper.EISSN))== 9:
        add_paper_to_DB(WoSpaper, univ)
#    else :
#        print("error on line(No ISSN/EISSN) :", row_num)
    
def add_paper_type2(sheet, row_num, univ):
    WoSpaper = paper()
    WoSpaper.source = 'WoS'
    WoSpaper.Authors = sheet.cell_value(row_num,5)
    WoSpaper.Title = sheet.cell_value(row_num,8)
    WoSpaper.Journal_name = sheet.cell_value(row_num,9)
    WoSpaper.Progress = sheet.cell_value(row_num,13)
    WoSpaper.KNUauthor = "TBA"
    WoSpaper.Keyword = sheet.cell_value(row_num,19)
    WoSpaper.citation = sheet.cell_value(row_num+1,30-22)
    WoSpaper.ISSN = sheet.cell_value(row_num+1,38-22)#16
    WoSpaper.EISSN = sheet.cell_value(row_num+1,39-22)
    Publication_date = sheet.cell_value(row_num+1,43-22)
    WoSpaper.Publication_Year = sheet.cell_value(row_num+1,44-22)
    WoSpaper.Volumn = sheet.cell_value(row_num+1,45-22)
    WoSpaper.Issue = sheet.cell_value(row_num+1,46-22)
    WoSpaper.StartPage = sheet.cell_value(row_num+1,51-22)
    WoSpaper.EndPage = sheet.cell_value(row_num+1,52-22)
    WoSpaper.Early_Acess_date = sheet.cell_value(row_num+1,56-22)
    WoSpaper.Early_Acess_Year = sheet.cell_value(row_num+1,57-22)
    WoSpaper.Reg_date = sheet.cell_value(row_num+1,67-22)
    
    if Publication_date == "":
        WoSpaper.Publication_Month = "undefined"
        WoSpaper.Publication_Day= "undefined"
    else:
        try :
            tmp = int(Publication_date)
            dt = datetime.fromordinal(datetime(1900, 1, 1).toordinal() + tmp - 2)
            WoSpaper.Publication_Month = tmp[5:7]
            WoSpaper.Publication_Day = tmp[9:11]
        except Exception as e :
            WoSpaper.Publication_Month = "undefined"
            WoSpaper.Publication_Day= "undefined"
            tmp = Publication_date
            months = ["null", "JAN","FEB", "MAR", "APR","MAY", "JUN", "JUL" ,"AUG", "SEP", "OCT", "NOV", "DEC"]
            for i in range(1, 13):
                if months[i] == tmp:
                    WoSpaper.Publication_Month = str(i)
                    
    if len(str(WoSpaper.ISSN)) == 9:
        add_paper_to_DB(WoSpaper, univ)
    elif len(str(WoSpaper.EISSN)) == 9:
        add_paper_to_DB(WoSpaper, univ)
#    else :
#        print("error on line(No ISSN/EISSN):", row_num,WoSpaper.Title)

def add_paper_to_DB(WoSpaper, univ):
    if WoSpaper.Publication_Year== '':
        WoSpaper.Publication_Year = "undefined"
    else:
        try:
            WoSpaper.Publication_Year = str(int(WoSpaper.Publication_Year))
        except Exception as e :
            print("Exception:", e)
            return
        
    JYear = WoSpaper.Publication_Year
    
    if univ == "KNU":
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == "PSU":
        conn = sqlite3.connect('IR_Papers_PSU.db')
    cur = conn.cursor()
    error_file_name = "./error_log/journals_error.txt"

    try :
        sql = "SELECT * FROM '" + JYear + "' WHERE Title = '" + WoSpaper.Title  + "'"
        cur.execute(sql)
        rows = cur.fetchone()
        if rows :
            #print("이미 있는 논문 입니다.")
            conn.commit()
            conn.close()
            return
    except Exception as e :
        if str(e) == "no such table: " + str(JYear) :
            #테이블이 없어서 에러가 나는 경우는 새로 만들어준다.
            print("테이블을 새로 생성하였습니다.")
            paper_create_table(JYear, univ)
        else :
            #다른에러로 터지는 경우
            print("Exception:", e)
            return

    sql = "INSERT INTO '" + JYear + "' VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
   
    cur.execute(sql, (WoSpaper.source, WoSpaper.Title, WoSpaper.Authors, WoSpaper.Journal_name, WoSpaper.Progress,WoSpaper.KNUauthor, WoSpaper.Keyword, WoSpaper.citation, WoSpaper.ISSN,WoSpaper.EISSN ,WoSpaper.Publication_Day,WoSpaper.Publication_Month, WoSpaper.Publication_Year,WoSpaper.Volumn ,WoSpaper.Issue ,WoSpaper.StartPage , WoSpaper.EndPage, WoSpaper.Early_Acess_date ,WoSpaper.Early_Acess_Year, WoSpaper.Reg_date ))
    #print("insert success")
    conn.commit()
    conn.close()
    
def paper_create_table(JYear, univ) :
    if univ == 'KNU':
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == 'PSU':
        conn = sqlite3.connect('IR_Papers_PSU.db')
    cur = conn.cursor()
   
    sql = "CREATE TABLE '" + JYear + "' (source string, Title string, Authors string, Journal_name string, Progress string, "
    sql += "KNUauthor string, Keyword string, citation string, ISSN string, EISSN string, Publication_Day string, Publication_Month string,Publication_Year string, "
    sql += "Volumn string, Issue string, StartPage string, EndPage string, Early_Acess_date string, Early_Acess_Year string, "
    sql += 'Reg_date string )'    
    cur.execute(sql)
    
    conn.commit()
    conn.close()
        
def add_scopus_paper(line, univ, date):
    if line[0] == 'Authors':
        return
    if line[17] != 'Article':
        return   

    Scopus_paper = paper()
    Scopus_paper.source = 'Scopus'
    Scopus_paper.Title = line[2]
    Scopus_paper.Authors = line[0]
    Scopus_paper.Journal_name =line[4]
    Scopus_paper.Progress = line[20]
    Scopus_paper.KNUauthor = 'TBA'
    Scopus_paper.citation =line[11]
    ISSN=str(line[14])
    
    if len(ISSN) < 8:
        for i in range (1, 8):
            ISSN = '0' + ISSN
            if len(ISSN) == 8:
                break
        
    if len(ISSN) == 8:
        Scopus_paper.ISSN = ISSN[0:4] + '-' + ISSN[4:8]     
    Scopus_paper.EISSN='undefined'
    Scopus_paper.Publication_Day = 'undefined'
    Scopus_paper.Publication_Month = 'undefined'
    Scopus_paper.Publication_Year = line[3]
    Scopus_paper.Volumn = line[5]
    Scopus_paper.Issue = line[6]
    Scopus_paper.StartPage =line[8]
    Scopus_paper.EndPage = line[9]
    Scopus_paper.Early_Acess_date = 'undefined'
    Scopus_paper.Early_Acess_Year = 'undefined'
    Scopus_paper.Keyword = 'undefined'
    Scopus_paper.Reg_date = date
    Scoupus_add_paper_to_DB(Scopus_paper, univ)
    
def Scoupus_add_paper_to_DB(paper, univ):   
    JYear = paper.Publication_Year
        
    if univ == 'KNU':
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == 'PSU':
        conn = sqlite3.connect('IR_Papers_PSU.db')
        
    cur = conn.cursor()
    error_file_name = "./error_log/journals_error.txt"

    try :
        sql = "SELECT * FROM '" + JYear + "' WHERE Title = '" + paper.Title + "'"
        cur.execute(sql)
        rows = cur.fetchone()
        if rows :
            #print("이미 있는 논문 입니다.")
            conn.commit()
            conn.close()
            return
    except Exception as e :
        if str(e) == "no such table: " + str(JYear) :
            #테이블이 없어서 에러가 나는 경우는 새로 만들어준다.
            print("테이블을 새로 생성하였습니다.")
            paper_create_table(JYear, univ)
        else :
            #다른에러로 터지는 경우
            print("Exception:", e)
            return

    sql = "INSERT INTO '" + JYear + "' VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    
    cur.execute(sql, (paper.source, paper.Title, paper.Authors, paper.Journal_name, paper.Progress,paper.KNUauthor, paper.Keyword, paper.citation, paper.ISSN,paper.EISSN ,paper.Publication_Day,paper.Publication_Month, paper.Publication_Year,paper.Volumn ,paper.Issue ,paper.StartPage , paper.EndPage, paper.Early_Acess_date ,paper.Early_Acess_Year, paper.Reg_date ))
    global cnt
    if cnt == 0:
        cnt = 1
        print("source : ", paper.source)
        print("title : ", paper.Title)
        print("author : ", paper.Authors)
        print("journal : ", paper.Journal_name)
        print("cite : ", paper.citation)
        print("issn : ", paper.ISSN)
        print("month : ", paper.Publication_Month)
    conn.commit()
    conn.close()
    
       
            
def count_data_all(univ, year) :    ###DB가 없으면 -1 return. 아니면 갯수 return
    count = 0
    if univ == 'KNU':
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == 'PSU':
        conn = sqlite3.connect('IR_Papers_PSU.db')
    
    cur = conn.cursor()
    
    try :
        sql = "SELECT count(*) FROM '" + year + "'"
        cur.execute(sql)
    except Exception as e :
        if str(e) == "no such table: " + str(JYear) :
            print("DB없음")
            return -1
        
    rows = cur.fetchone()

    conn.commit()
    conn.close()
    return int(rows[0])

def count_data_month(univ, year, month) :    ###DB가 없으면 -1 return. 아니면 갯수 return
    if univ == 'KNU':
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == 'PSU':
        conn = sqlite3.connect('IR_Papers_PSU.db')
    cur = conn.cursor()
    
    try :
        sql = "SELECT count(*) FROM '" + str(year) + "'"
        if month != "undefined":
            sql += " WHERE Publication_Month = '" + str(month) + "'"
        cur.execute(sql)
    except Exception as e :
        if str(e) == "no such table: " + str(year) :
            print("DB없음")
            return -1
        else :
            print(str(e))
        
    rows = cur.fetchone()

    conn.commit()
    conn.close()
    return int(rows[0])

def paper_counts_per_week(univ, year):
    papers = [0,0,0,0,0,0,0,0,0,0,0,0,0]
    sums = 0
    mins = 99999999999999;
    if year == '2019':
        end = 11
    else:
        end =13
    total = int(count_data_all(univ, year))
    
    for i in range (1, end):
        papers[i] = int(count_data_month(univ, year, str(i)))
        if papers[i] < mins and papers[i] != 0:
            mins = papers[i]

    for i in range (1, end):
        if int(papers[i]) == 0:
            papers[i] = mins
      
    for i in range (1, end):    
        sums += papers[i]
  
    remine = total - sums

    for i in range (1, end):
        priority = float(papers[i]) / float(sums) 
        papers[i] += int(priority * remine )
    
    sums = 0
    for i in range (1, end):    
        sums += papers[i]
    
    if year == '2019':
        papers[9] += total - sums
    else:
        papers[12] += total - sums
    return papers

def get_Issn(year, univ) :
    if univ == 'KNU':
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == 'PSU':
        conn = sqlite3.connect('IR_Papers_PSU.db')
        
    cur = conn.cursor()
    
    try :
        sql = "SELECT distinct(ISSN) FROM '" + str(year) + "'"
        cur.execute(sql)
    except Exception as e :
        if str(e) == "no such table: " + str(year) : 
            print("DB없음")
            return -1
        
    rows = cur.fetchall()
    returnlist = []
    for i in range(0, len(rows)) :
        returnlist.append(rows[i][0])
    
    conn.commit()
    conn.close()
    
    return returnlist

def insert_basic_journal(JYear) :
    file = xlrd.open_workbook(r'rawdata\IF.xlsx')
    sheet = file.sheet_by_index(0)
    nrows = sheet.nrows
    for row_num in range(6,nrows):       
        ISSN = sheet.cell_value(row_num,2)
        Title = sheet.cell_value(row_num,1) 
        JCR = sheet.cell_value(row_num,4) 
        IF = sheet.cell_value(row_num,5) 
        
        journal_DB_update(JYear,ISSN, Title , IF, JCR)

def journal_create_table(JYear) :
    conn = sqlite3.connect('IR_Journal.db')
    cur = conn.cursor()
   
    sql = "CREATE TABLE '" + JYear + "' (ISSN string, Journal_Name string, IF string, "
    sql += 'JCR string)'  
    cur.execute(sql)
    
    conn.commit()
    conn.close()
    
def make_journal_db(myset):
    mylists = list(myset)
    for i in range(1, len(mylists)):
        add_journal('2019', mylists[i], 'undefined','undefined', 'undefined' )

def add_journal(JYear, ISSN, J_name, IF, JCR) :
    conn = sqlite3.connect('IR_Journal.db')
    cur = conn.cursor()

    try :
        sql = "SELECT * FROM '" + JYear + "' WHERE ISSN = '" + ISSN  + "'"
        cur.execute(sql)
        rows = cur.fetchone()
        if rows :
            #print("이미 있는 논문 입니다.")
            conn.commit()
            conn.close()
            return
    except Exception as e :
        if str(e) == "no such table: " + str(JYear) :
            #테이블이 없어서 에러가 나는 경우는 새로 만들어준다.
            print("테이블을 새로 생성하였습니다.")
            journal_create_table(JYear)
        else :
            #다른에러로 터지는 경우
            print("Exception:", e)
            return

    sql = "INSERT INTO '" + JYear + "' VALUES(?, ?, ?, ?)"
   
    cur.execute(sql, (ISSN, J_name, IF, JCR ))
    print("insert success")
    conn.commit()
    conn.close()
    
def journal_DB_update(JYear, ISSN, Title,  IF, JCR):
    conn = sqlite3.connect('IR_Journal.db')
    cur = conn.cursor()
    
    sql = "SELECT * FROM '" + JYear + "' WHERE ISSN = '" + ISSN  + "'"
    cur.execute(sql)
    rows = cur.fetchone()

    if rows :
        sql = "DELETE FROM '" + JYear +  "' WHERE ISSN = '" + ISSN  + "'"
        cur.execute(sql)
        conn.commit()
        conn.close()        
        add_journal('2019', ISSN, Title,IF, JCR)
        print("UPDATE from ", ISSN, Title, IF, JCR)
    else:
        conn.close()  
        
def get_lists(JYear):
    conn = sqlite3.connect('IR_Journal.db')
    cur = conn.cursor()
    
    sql = "SELECT * FROM '" + JYear + "' WHERE IF = '" + 'undefined'  + "'"
    cur.execute(sql)
    rows = cur.fetchall()
    returnlist = []
    for i in range(0, len(rows)) :
        returnlist.append(rows[i][0])
    
    conn.close() 
    return returnlist

def html_parsing(ISSN):
    info = 'http://155.230.184.123:8080/InCites%20Journal%20Citation%20Reports.html'
    
    mylist = []
    JCRs = []
    with requests.Session() as s:
        response = s.get(info)
        soup = BeautifulSoup(response.content, 'html.parser')
    
    table = soup.find('div', {'field' : 'journalTitle' })
    Title = table.text
    print("-------------Title : ", Title, "------------")
    
    table = soup.find('div', {'class' : 'bar-chart-body' })
    for tr in table.find_all('div', {'class' : 'chart-y-mark-tooltip-legend-value' }):
        mylist.append(tr.text)
        
    print(mylist)
    for i in range(len(mylist)-1, 0, -1) :
        strText = str(mylist[i])
        index = strText.find('%')
        if index != -1:
            temp = strText[0:index]
            JCRs.append(float(temp))
        else :
            IF = mylist[i]
            break;
            
    maxJCR = max(JCRs)
            
    
    print("IF :", IF)
    print("JCR :", maxJCR)
    
    file = open('updatelog2.txt', 'a',  encoding='UTF-8') 
    Logs = ISSN+ " "+ str(IF) + " "+ str(maxJCR)+ " "+ Title +"\n"
    file.write(Logs)
    file.close()
    
    journal_DB_update('2019', ISSN, Title, IF, maxJCR )
    
def web_search_journal(ISSN):
    #chromedriver 설치 경로 C:\ 로가정 

    driver = webdriver.Chrome('C:/Apache24/chromedriver')
    driver.get('https://jcr.clarivate.com/JCRLandingPageAction.action?Init=Yes&SrcApp=IC2LS&SID=J1-ZZzD7AjzfDrR18n5m5HhFRhb5Vms1OUR-18x2dsgx2BouzEhhqcVa0lgrsEC0Qx3Dx3DfNCgtRmSHByNt3nD3BfKvAx3Dx3D-WwpRYkX4Gz8e7T4uNl5SUQx3Dx3D-wBEj1mx2B0mykql8H4kstFLwx3Dx3D')
    
    box = driver.find_element_by_name("search-inputEl")
    box.send_keys(ISSN)
    time.sleep(5)
    box.send_keys(Keys.RETURN)

    
    
def main():
    print("데이터 추가 : 1")
    print("데이터 검증 : 2")
    print("ISSN 추출 : 3")
    print("테스트중 : 4")
    print("크롬웹드라이버 : 5")
    print("데이터 삭제")
    inputs = input()
    if inputs == '1':
        add_paper_from_WoS_module('20190924')
        add_paper_from_Scoupus_module('20190924')
    elif inputs == '2':
        print("경북대 2016 :", count_data_all('KNU', '2016'))
        print("경북대 2017 :", count_data_all('KNU', '2017'))
        print("경북대 2018 :", count_data_all('KNU', '2018'))
        print("경북대 2019 :", count_data_all('KNU', '2019'))
        print("----------------------------------------")
        print("부산대 2018 :", count_data_all('PSU', '2018'))
        print("부산대 2019 :", count_data_all('PSU', '2019'))
        print("----------------------------------------")
        
        
        for i in range (2016, 2020):
            mylist = paper_counts_per_week('KNU', str(i))
            print(mylist)   
            
        mylist = paper_counts_per_week('PSU', '2018')
        print(mylist)   
        mylist = paper_counts_per_week('PSU', '2019')
        print(mylist)   
    elif inputs == '3':
        lists1 = set(get_Issn('2017', 'KNU'))
        lists2 = set(get_Issn('2018', 'KNU'))
        lists3 = set(get_Issn('2019', 'KNU'))
        lists4 = set(get_Issn('2016', 'KNU'))
        lists5 = set(get_Issn('2018', 'PSU'))
        
        total_set = lists1 | lists2 |lists3 |lists4 |lists5
        print("all journals : ", len(total_set))
        
        make_journal_db(total_set)
        insert_basic_journal('2019')
    elif inputs == '4':
        mylist = get_lists('2019')
        print("total ISSNs : ", len(mylist))

        for i in range (0, len(mylist)):
            try:
                web_search_journal(mylist[i])
                time.sleep(4)
                win32api.SetCursorPos((50, 500))
                time.sleep(1)
                win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
                time.sleep(0.2)
                win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)
                time.sleep(1)
                win32api.SetCursorPos((55, 600))
                time.sleep(1)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                time.sleep(0.5)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
                time.sleep(2)
                win32api.SetCursorPos((1750, 665))
                time.sleep(1)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                time.sleep(0.5)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
                time.sleep(1)
                win32api.SetCursorPos((980, 540))
                time.sleep(1)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                time.sleep(0.5)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
                time.sleep(3)
                win32api.SetCursorPos((930, 20))
                time.sleep(1)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                time.sleep(0.5)
                win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
                html_parsing(mylist[i])
            except Exception as e :
                file = open('updatelog2.txt', 'a',  encoding='UTF-8') 
                Logs = mylist[i]+ "Failed\n"
                file.write(Logs)
                file.close()
                
        mylist = get_lists('2018')
        print("total ISSNs : ", len(mylist))
    elif inputs == '5':
        per1 = cnt_5_10('2019', 'KNU', 10, 1)
        per1 = cnt_5_10('2019', 'KNU', 10, 1)
        print("2019 KNU")
        per2 = cnt_5_10('2018', 'KNU', 10, 1)
        print("2018 KNU")
        per3 = cnt_5_10('2017', 'KNU', 10, 1)
        print("2017 KNU")
        per4 = cnt_5_10('2016', 'KNU', 10, 1)
        print("2016 KNU")
        per5 = cnt_5_10('2018', 'PSU', 10, 1)
        print("2018 PSU")
        per5 = cnt_5_10('2019', 'PSU', 10, 1)
        print("2018 PSU")
        #per3 = cnt_5_10('2019')
    elif inputs == '6':
        while(1):
            input2 = input()
            if input2 == '-1':
                break
            else :
                remove_IF(input2)
    
    print("END")

def remove_IF(inputs, year):
    conn = sqlite3.connect('IR_Journal.db')
    cur = conn.cursor()
    sql = "SELECT JCR FROM '" + year + "' WHERE ISSN = '" + temp  + "'"

def cnt_5_10(year, univ, IF, JCR):
    global cnt
    if univ == 'KNU':
        conn = sqlite3.connect('IR_Papers_KNU.db')
    elif univ == 'PSU':
        conn = sqlite3.connect('IR_Papers_PSU.db')
    cur = conn.cursor()
        
    sql = "SELECT ISSN FROM '" + year + "'"
    cur.execute(sql)
    
    rows = cur.fetchall()
    cnt = 0;
    for i in range(0, len(rows)) :
        get_info(year, rows[i], IF, JCR)
        
    conn.close()  


def get_info(year, inputs, IFs, JCRs):
    global cnt
    if inputs == '' or inputs == ',':
        return 0
    tmp = str(inputs)
    temp = tmp[2:11]
    
    
    conn = sqlite3.connect('IR_Journal.db')
    cur = conn.cursor()
    try :
        sql = "SELECT IF FROM '" + '2019' + "' WHERE ISSN = '" + temp  + "'"
        cur.execute(sql) 
        rows = cur.fetchone()
    except Exception as e :
        conn.close() 
        return 0
    if rows:
        IF = str(rows)
        IF = IF[1:5]
    else :
        return 0
    
    sql = "SELECT JCR FROM '" + '2019' + "' WHERE ISSN = '" + temp  + "'"
    cur.execute(sql) 
    rows = cur.fetchone()
    if rows:
        JCR = str(rows)
        JCR = JCR[1:len(JCR)-2]
    else :
        return 0
    
    conn.close() 
    #print("IF:", IF, "JCR", JCR)
    try :
        if float(JCR) < JCRs:
            cnt += 1
            print("Good :", float(JCR), "ISSN : ",temp , "IF :", IF)
            return 1
        else :
            return 0
    except Exception as e :
        return 0
    
    
    

    
        
main()

#%% [markdown]
# ### 

#%%



#%%



#%%



