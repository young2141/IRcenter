from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup 
from datetime import datetime
import requests
import openpyxl, xlrd
import pandas as pd
import json,os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import csv
import sqlite3
import re
import os
import win32api, win32con
import pyautogui
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
            break
            
    maxJCR = max(JCRs)
            
    
    print("IF :", IF)
    print("JCR :", maxJCR)
    
    file = open('updatelog2.txt', 'a',  encoding='UTF-8') 
    Logs = ISSN+ " "+ str(IF) + " "+ str(maxJCR)+ " "+ Title +"\n"
    file.write(Logs)
    file.close()
    
    journal_DB_update('2019', ISSN, Title, IF, maxJCR )
    
def web_search_journal(ISSN,failed):
    file_list = os.listdir(r'C:\Users\taeyo\Downloads')
    if ISSN+'.html' in file_list: 
        print(ISSN+" already exists")
        return
        
    driver = webdriver.Chrome('C:/Apache24/chromedriver')
    driver.get('https://jcr.clarivate.com/JCRLandingPageAction.action?Init=Yes&SrcApp=IC2LS&SID=J1-ZZzD7AjzfDrR18n5m5HhFRhb5Vms1OUR-18x2dsgx2BouzEhhqcVa0lgrsEC0Qx3Dx3DfNCgtRmSHByNt3nD3BfKvAx3Dx3D-WwpRYkX4Gz8e7T4uNl5SUQx3Dx3D-wBEj1mx2B0mykql8H4kstFLwx3Dx3D')
    
    box = driver.find_element_by_name("search-inputEl")
    driver.implicitly_wait(5)
    box.send_keys(ISSN)
    time.sleep(1)
    
    try:
        driver.find_element_by_xpath("//*[text()='No results found']")
        failed.append(ISSN+'\n')
    except:
        save = ISSN+'.html' # add directory if needed
        box.send_keys(Keys.RETURN)
        time.sleep(5)
        pyautogui.hotkey('ctrl','s')
        time.sleep(1)
        pyautogui.typewrite(save)
        pyautogui.hotkey('enter')    
        time.sleep(4)    
    driver.quit()

    
    
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
        failed_list = []
        for i in range (0, len(mylist)):        
            web_search_journal(mylist[i],failed_list)

        with open('failed_ISSN.txt','w') as f:
            f.writelines(failed_list)                
        mylist = get_lists('2018')
        print("total ISSNs : ", len(mylist))
        print("END")

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
    
    
    

    
'''  
main()
데이터 추가 : 1
데이터 검증 : 2
ISSN 추출 : 3
테스트중 : 4
크롬웹드라이버 : 5
데이터 삭제
4
total ISSNs :  89
-------------Title :  Nano Convergence ------------
['3.324', '55.85%', '69.11%', '76.01%']
-------------Title :  CHINESE JOURNAL OF CATALYSIS ------------
['1.964', '68.75%', '42.81%', '61.85%', '2.628', '75.69%', '59.38%', '77.41%', '2.813', '77.08%', '58.56%', '73.70%', '3.525', '79.86%', '64.29%', '81.39%', '4.914', '90.85%', '75.34%', '88.77%']
IF : 4.914
JCR : 90.85
insert success
UPDATE from  1872-2067 CHINESE JOURNAL OF CATALYSIS 4.914 90.85
-------------Title :  JOURNAL OF MICROBIOLOGY ------------
['1.439', '20.59%', '1.621', '24.80%', '1.924', '35.60%', '2.319', '41.67%', '2.319', '33.46%']
IF : 2.319
JCR : 33.46
insert success
UPDATE from  1225-8873 JOURNAL OF MICROBIOLOGY 2.319 33.46
-------------Title :  JOURNAL OF MICROBIOLOGY ------------
['1.439', '20.59%', '1.621', '24.80%', '1.924', '35.60%', '2.319', '41.67%', '2.319', '33.46%']
IF : 2.319
JCR : 33.46
insert success
UPDATE from  1881-8366 JOURNAL OF MICROBIOLOGY 2.319 33.46
-------------Title :  JOURNAL OF MICROBIOLOGY ------------
['1.439', '20.59%', '1.621', '24.80%', '1.924', '35.60%', '2.319', '41.67%', '2.319', '33.46%']
IF : 2.319
JCR : 33.46
insert success
UPDATE from  0927-7099 JOURNAL OF MICROBIOLOGY 2.319 33.46
-------------Title :  Asian Pacific Journal of Tropical Biomedicine ------------
['1.587', '45.24%']
-------------Title :  PHYSICAL REVIEW LETTERS ------------
['7.512', '92.95%', '7.645', '93.04%', '8.462', '93.04%', '8.839', '92.95%', '9.227', '93.21%']
IF : 9.227
JCR : 93.21
insert success
UPDATE from  1079-7114 PHYSICAL REVIEW LETTERS 9.227 93.21
-------------Title :  Mathematics ------------
['1.105', '76.20%']
-------------Title :  Mathematics ------------
['1.105', '76.20%']
-------------Title :  Frontiers of Physics ------------
['2.086', '73.72%', '2.462', '81.65%', '2.579', '82.91%', '1.892', '57.05%', '2.483', '67.28%']
IF : 2.483
JCR : 67.28
insert success
UPDATE from  2095-0462 Frontiers of Physics 2.483 67.28
-------------Title :  Nature Catalysis ------------
['0.34%']
-------------Title :  CURRENT MICROBIOLOGY ------------
['1.423', '18.91%', '1.519', '20.73%', '1.322', '18.80%', '1.373', '17.06%', '1.595', '18.42%']
IF : 1.595
JCR : 18.42
insert success
UPDATE from  0343-8651 CURRENT MICROBIOLOGY 1.595 18.42
-------------Title :  Foods ------------
['3.011', '73.70%']
-------------Title :  Korean Journal of Pain ------------
['1.563', '19.35%']
-------------Title :  IEEE Transactions on Computational Imaging ------------
['4.546', '84.72%', '80.36%']
-------------Title :  Environmental Technology & Innovation ------------
['2.800', '61.42%', '52.88%', '62.60%']
-------------Title :  Environmental Technology & Innovation ------------
['2.800', '61.42%', '52.88%', '62.60%']
-------------Title :  Environmental Technology & Innovation ------------
['2.800', '61.42%', '52.88%', '62.60%']
-------------Title :  Alexandria Engineering Journal ------------
['3.696', '85.80%']
-------------Title :  SPANISH JOURNAL OF AGRICULTURAL RESEARCH ------------
['0.703', '54.46%', '0.760', '58.77%', '0.687', '43.75%', '0.811', '50.00%', '1.035', '50.89%']
IF : 1.035
JCR : 50.89
insert success
UPDATE from  1695-971X SPANISH JOURNAL OF AGRICULTURAL RESEARCH 1.035 50.89
-------------Title :  International Journal of Stem Cells ------------
['2.768', '36.58%', '1.870', '17.36%', '13.46%']
IF : 1.870
JCR : 17.36
insert success
UPDATE from  2005-3606 International Journal of Stem Cells 1.870 17.36
-------------Title :  NEURORADIOLOGY ------------
['2.485', '58.59%', '53.57%', '67.60%', '2.274', '48.96%', '39.29%', '62.50%', '2.093', '40.98%', '39.29%', '57.09%', '2.346', '42.39%', '39.29%', '58.53%', '2.504', '45.98%', '53.57%', '58.53%']
IF : 2.504
JCR : 58.53
insert success
UPDATE from  0028-3940 NEURORADIOLOGY 2.504 58.53
-------------Title :  Cancer Communications ------------
['0.22%']
-------------Title :  AMERICAN JOURNAL OF PHYSICAL MEDICINE & REHABILITATION ------------
['2.202', '83.59%', '75.93%', '2.064', '83.85%', '71.34%', '1.734', '60.77%', '52.47%', '1.843', '60.77%', '46.30%', '1.908', '65.38%', '50.00%']
IF : 1.908
JCR : 65.38
insert success
UPDATE from  0894-9115 AMERICAN JOURNAL OF PHYSICAL MEDICINE & REHABILITATION 1.908 65.38
-------------Title :  PHASE TRANSITIONS ------------
['0.954', '36.96%', '24.63%', '0.858', '28.85%', '21.64%', '1.060', '28.85%', '23.13%', '1.028', '25.00%', '18.66%', '1.026', '25.00%', '21.32%']
IF : 1.026
JCR : 25.0
insert success
UPDATE from  0141-1594 PHASE TRANSITIONS 1.026 25.0
-------------Title :  ACS Omega ------------
['2.584', '56.10%']
-------------Title :  INTERNATIONAL JOURNAL OF GYNECOLOGICAL CANCER ------------
['1.958', '26.78%', '57.59%', '2.116', '30.28%', '61.88%', '2.369', '35.25%', '63.13%', '2.192', '25.34%', '57.93%', '1.746', '13.32%', '37.95%']
IF : 1.746
JCR : 37.95
insert success
UPDATE from  1048-891X INTERNATIONAL JOURNAL OF GYNECOLOGICAL CANCER 1.746 37.95
-------------Title :  International Journal of Environmental Research ------------
['1.100', '29.37%', '0.992', '22.00%', '0.927', '17.25%', '1.019', '16.74%', '1.488', '28.20%']
IF : 1.488
JCR : 28.2
insert success
UPDATE from  1735-6865 International Journal of Environmental Research 1.488 28.2
-------------Title :  Orthopaedic Journal of Sports Medicine ------------
['2.589', '71.71%', '70.48%']
-------------Title :  Investigative and Clinical Urology ------------
['1.638', '30.63%']
-------------Title :  Investigative and Clinical Urology ------------
['1.638', '30.63%']
-------------Title :  Investigative and Clinical Urology ------------
['1.638', '30.63%']
-------------Title :  Tissue Engineering Part A ------------
['3.616', '51.92%', '73.77%', '53.63%']
-------------Title :  ESC Heart Failure ------------
['3.407', '64.34%']
-------------Title :  ESC Heart Failure ------------
['3.407', '64.34%']
-------------Title :  ESC Heart Failure ------------
['3.407', '64.34%']
-------------Title :  Frontiers in Microbiology ------------
['3.989', '77.73%', '4.165', '81.71%', '4.076', '79.60%', '4.019', '75.00%', '4.259', '76.32%']
IF : 4.259
JCR : 76.32
insert success
UPDATE from  1664-302X Frontiers in Microbiology 4.259 76.32
-------------Title :  Journal of Superconductivity and Novel Magnetism ------------
['0.909', '22.57%', '21.64%', '1.100', '30.00%', '27.61%', '1.180', '26.01%', '27.61%', '1.142', '22.26%', '23.13%', '1.130', '19.93%', '25.74%']
IF : 1.130
JCR : 25.74
insert success
UPDATE from  1557-1939 Journal of Superconductivity and Novel Magnetism 1.130 25.74
-------------Title :  ACM Transactions on Embedded Computing Systems ------------
['0.471', '19.00%', '15.87%', '0.714', '40.20%', '34.43%', '1.367', '39.42%', '46.70%', '1.156', '37.50%', '42.79%', '1.368', '39.42%', '46.26%']
IF : 1.368
JCR : 46.26
insert success
UPDATE from  1539-9087 ACM Transactions on Embedded Computing Systems 1.368 46.26
-------------Title :  Journal of Magnesium and Alloys ------------
['4.523', '94.08%']
-------------Title :  Journal of Magnesium and Alloys ------------
['4.523', '94.08%']
-------------Title :  JOURNAL OF THE FACULTY OF AGRICULTURE KYUSHU UNIVERSITY ------------
['0.255', '15.18%', '0.216', '7.89%', '0.296', '13.39%', '0.351', '21.93%', '0.216', '2.68%']
IF : 0.216
JCR : 2.68
insert success
UPDATE from  0023-6152 JOURNAL OF THE FACULTY OF AGRICULTURE KYUSHU UNIVERSITY 0.216 2.68
-------------Title :  AUTONOMOUS ROBOTS ------------
['2.066', '69.51%', '71.74%', '1.547', '53.46%', '58.00%', '2.706', '74.06%', '67.31%', '2.244', '62.50%', '55.77%', '3.634', '75.56%', '71.15%']
IF : 3.634
JCR : 75.56
insert success
UPDATE from  0929-5593 AUTONOMOUS ROBOTS 3.634 75.56
-------------Title :  Asia-Pacific Journal of Clinical Oncology ------------
['1.542', '17.30%', '1.722', '20.89%', '1.959', '26.50%', '1.494', '10.54%', '1.539', '9.39%']
IF : 1.539
JCR : 9.39
insert success
UPDATE from  1743-7555 Asia-Pacific Journal of Clinical Oncology 1.539 9.39
-------------Title :  DIABETES & METABOLISM ------------
['3.267', '56.64%', '4.693', '82.33%', '4.101', '76.45%', '3.744', '68.66%', '4.008', '74.83%']
IF : 4.008
JCR : 74.83
insert success
UPDATE from  1262-3636 DIABETES & METABOLISM 4.008 74.83
-------------Title :  International Journal of Data Mining and Bioinformatics ------------
['0.495', '2.63%', '0.528', '4.46%', '0.624', '11.40%', '0.652', '7.63%', '0.789', '9.32%']
IF : 0.789
JCR : 9.32
insert success
UPDATE from  1748-5673 International Journal of Data Mining and Bioinformatics 0.789 9.32
-------------Title :  EUROPEAN JOURNAL OF GYNAECOLOGICAL ONCOLOGY ------------
['0.611', '4.03%', '8.23%', '0.580', '2.58%', '4.38%', '0.692', '2.53%', '6.88%', '0.617', '1.57%', '6.71%', '0.245', '1.53%', '3.01%']
IF : 0.245
JCR : 3.01
insert success
UPDATE from  0392-2936 EUROPEAN JOURNAL OF GYNAECOLOGICAL ONCOLOGY 0.245 3.01
-------------Title :  EUROPEAN JOURNAL OF GYNAECOLOGICAL ONCOLOGY ------------
['0.611', '4.03%', '8.23%', '0.580', '2.58%', '4.38%', '0.692', '2.53%', '6.88%', '0.617', '1.57%', '6.71%', '0.245', '1.53%', '3.01%']
IF : 0.245
JCR : 3.01
insert success
UPDATE from  2005-6443 EUROPEAN JOURNAL OF GYNAECOLOGICAL ONCOLOGY 0.245 3.01
-------------Title :  Annals of Translational Medicine ------------
['3.689', '65.72%', '65.81%']
-------------Title :  Economics of Innovation and New Technology ------------
['1.529', '60.74%']
-------------Title :  Economics of Innovation and New Technology ------------
['1.529', '60.74%']
-------------Title :  INTERNATIONAL JOURNAL OF REMOTE SENSING ------------
['1.652', '55.36%', '64.58%', '1.640', '55.36%', '68.75%', '1.724', '46.55%', '51.92%', '1.782', '48.33%', '61.11%', '2.493', '55.00%', '58.93%']
IF : 2.493
JCR : 58.93
insert success
UPDATE from  0143-1161 INTERNATIONAL JOURNAL OF REMOTE SENSING 2.493 58.93
-------------Title :  General Thoracic and Cardiovascular Surgery ------------
['1.219', '13.60%', '28.33%']
-------------Title :  General Thoracic and Cardiovascular Surgery ------------
['1.219', '13.60%', '28.33%']
-------------Title :  Antioxidants ------------
['4.520', '79.03%', '90.98%', '92.96%']
-------------Title :  Antioxidants ------------
['4.520', '79.03%', '90.98%', '92.96%']
-------------Title :  Antioxidants ------------
['4.520', '79.03%', '90.98%', '92.96%']
-------------Title :  SYMBIOSIS ------------
['1.438', '19.75%', '1.284', '15.85%', '1.300', '18.00%', '1.713', '26.59%', '2.009', '28.20%']
IF : 2.009
JCR : 28.2
insert success
UPDATE from  0334-5114 SYMBIOSIS 2.009 28.2
-------------Title :  HEAT AND MASS TRANSFER ------------
['0.946', '39.09%', '33.21%', '1.044', '42.24%', '39.63%', '1.233', '37.07%', '38.72%', '1.494', '46.61%', '39.93%', '1.551', '44.17%', '35.45%']
IF : 1.551
JCR : 44.17
insert success
UPDATE from  0947-7411 HEAT AND MASS TRANSFER 1.551 44.17
-------------Title :  COMPUTERS & ELECTRICAL ENGINEERING ------------
['0.817', '45.00%', '19.12%', '34.74%', '1.084', '53.92%', '30.29%', '42.61%', '1.570', '47.12%', '37.62%', '44.47%', '1.747', '62.50%', '41.43%', '48.65%', '2.189', '62.50%', '49.53%', '50.75%']
IF : 2.189
JCR : 62.5
insert success
UPDATE from  0045-7906 COMPUTERS & ELECTRICAL ENGINEERING 2.189 62.5
-------------Title :  COMPUTERS & ELECTRICAL ENGINEERING ------------
['0.817', '45.00%', '19.12%', '34.74%', '1.084', '53.92%', '30.29%', '42.61%', '1.570', '47.12%', '37.62%', '44.47%', '1.747', '62.50%', '41.43%', '48.65%', '2.189', '62.50%', '49.53%', '50.75%']
IF : 2.189
JCR : 62.5
insert success
UPDATE from  2352-0477 COMPUTERS & ELECTRICAL ENGINEERING 2.189 62.5
-------------Title :  PLANT BREEDING ------------
['1.598', '73.46%', '35.89%', '59.07%', '1.502', '69.28%', '30.12%', '57.18%', '1.335', '65.66%', '24.06%', '50.24%', '1.392', '59.20%', '22.67%', '47.31%', '1.251', '54.49%', '12.65%', '40.57%']
IF : 1.251
JCR : 54.49
insert success
UPDATE from  0179-9541 PLANT BREEDING 1.251 54.49
-------------Title :  Lancet Gastroenterology & Hepatology ------------
['12.856', '93.45%']
-------------Title :  Lancet Gastroenterology & Hepatology ------------
['12.856', '93.45%']
-------------Title :  JOURNAL OF VETERINARY PHARMACOLOGY AND THERAPEUTICS ------------
['1.189', '18.63%', '64.29%', '1.279', '19.02%', '72.83%', '1.202', '16.54%', '67.28%', '1.441', '17.82%', '68.93%', '1.175', '12.55%', '59.93%']
IF : 1.175
JCR : 59.93
insert success
UPDATE from  0140-7783 JOURNAL OF VETERINARY PHARMACOLOGY AND THERAPEUTICS 1.175 59.93
-------------Title :  Quantum Science and Technology ------------
['3.022', '67.86%', '74.69%']
-------------Title :  Circulation-Genomic and Precision Medicine ------------
['0.37%', '0.86%']
-------------Title :  Circulation-Genomic and Precision Medicine ------------
['0.37%', '0.86%']
-------------Title :  Circulation-Genomic and Precision Medicine ------------
['0.37%', '0.86%']
-------------Title :  MODERN PHYSICS LETTERS B ------------
['0.746', '14.24%', '14.18%', '21.30%', '0.547', '7.24%', '9.70%', '6.60%', '0.617', '7.09%', '11.19%', '10.00%', '0.731', '9.93%', '11.19%', '17.27%', '0.929', '15.20%', '16.91%', '26.36%']
IF : 0.929
JCR : 26.36
insert success
UPDATE from  0217-9849 MODERN PHYSICS LETTERS B 0.929 26.36
-------------Title :  INTERVENTIONAL NEURORADIOLOGY ------------
['0.780', '10.16%', '12.40%', '0.703', '8.55%', '6.85%', '0.739', '8.51%', '9.84%', '1.021', '10.91%', '16.67%', '1.450', '15.33%', '24.42%']
IF : 1.450
JCR : 24.42
insert success
UPDATE from  1591-0199 INTERVENTIONAL NEURORADIOLOGY 1.450 24.42
-------------Title :  DERMATOLOGIC SURGERY ------------
['2.109', '69.05%', '65.91%', '1.936', '64.75%', '63.75%', '2.351', '69.05%', '67.77%', '2.471', '67.97%', '67.75%', '2.190', '53.79%', '60.34%']
IF : 2.190
JCR : 60.34
insert success
UPDATE from  1076-0512 DERMATOLOGIC SURGERY 2.190 60.34
-------------Title :  JOURNAL OF ELECTROMYOGRAPHY AND KINESIOLOGY ------------
['1.647', '22.42%', '27.11%', '61.72%', '54.94%', '1.530', '18.16%', '18.67%', '54.62%', '51.83%', '1.510', '16.41%', '22.02%', '53.08%', '47.53%', '1.568', '13.98%', '23.49%', '42.31%', '35.19%', '1.753', '17.04%', '29.01%', '57.69%', '37.95%']
IF : 1.753
JCR : 57.69
insert success
UPDATE from  1050-6411 JOURNAL OF ELECTROMYOGRAPHY AND KINESIOLOGY 1.753 57.69
-------------Title :  CHEMICAL ENGINEERING SCIENCE ------------
['2.337', '69.26%', '2.750', '80.37%', '2.895', '76.67%', '3.306', '79.20%', '3.372', '75.72%']
IF : 3.372
JCR : 75.72
insert success
UPDATE from  0009-2509 CHEMICAL ENGINEERING SCIENCE 3.372 75.72
-------------Title :  Frontiers in Earth Science ------------
['2.892', '72.70%']
-------------Title :  Frontiers in Earth Science ------------
['2.892', '72.70%']
-------------Title :  Processes ------------
['1.279', '38.32%', '1.963', '50.36%']
IF : 1.963
JCR : 50.36
insert success
UPDATE from  2227-9717 Processes 1.963 50.36
-------------Title :  Processes ------------
['1.279', '38.32%', '1.963', '50.36%']
IF : 1.963
JCR : 50.36
insert success
UPDATE from  2233-8233 Processes 1.963 50.36
-------------Title :  Processes ------------
['1.279', '38.32%', '1.963', '50.36%']
IF : 1.963
JCR : 50.36
insert success
UPDATE from  1823-5514 Processes 1.963 50.36
-------------Title :  Processes ------------
['1.279', '38.32%', '1.963', '50.36%']
IF : 1.963
JCR : 50.36
insert success
UPDATE from  2214-0271 Processes 1.963 50.36
-------------Title :  Translational Vision Science & Technology ------------
['2.221', '60.17%', '2.193', '58.47%', '2.399', '68.64%']
IF : 2.399
JCR : 68.64
insert success
UPDATE from  2164-2591 Translational Vision Science & Technology 2.399 68.64
-------------Title :  JOURNAL OF FOOD PROCESS ENGINEERING ------------
['0.675', '27.78%', '26.42%', '0.745', '28.52%', '28.40%', '1.370', '44.81%', '47.31%', '1.955', '53.65%', '57.52%', '1.448', '38.77%', '38.15%']
IF : 1.448
JCR : 38.77
insert success
UPDATE from  0145-8876 JOURNAL OF FOOD PROCESS ENGINEERING 1.448 38.77
-------------Title :  Chronic Respiratory Disease ------------
['2.694', '56.03%', '1.646', '26.72%', '1.818', '27.97%', '2.275', '35.83%', '2.885', '57.94%']
IF : 2.885
JCR : 57.94
insert success
UPDATE from  1479-9723 Chronic Respiratory Disease 2.885 57.94
-------------Title :  Chronic Respiratory Disease ------------
['2.694', '56.03%', '1.646', '26.72%', '1.818', '27.97%', '2.275', '35.83%', '2.885', '57.94%']
IF : 2.885
JCR : 57.94
insert success
UPDATE from  2315-4462 Chronic Respiratory Disease 2.885 57.94
-------------Title :  Chronic Respiratory Disease ------------
['2.694', '56.03%', '1.646', '26.72%', '1.818', '27.97%', '2.275', '35.83%', '2.885', '57.94%']
IF : 2.885
JCR : 57.94
insert success
UPDATE from  2287-9110 Chronic Respiratory Disease 2.885 57.94
-------------Title :  Chronic Respiratory Disease ------------
['2.694', '56.03%', '1.646', '26.72%', '1.818', '27.97%', '2.275', '35.83%', '2.885', '57.94%']
IF : 2.885
JCR : 57.94
insert success
UPDATE from  2515-690X Chronic Respiratory Disease 2.885 57.94
-------------Title :  Chronic Respiratory Disease ------------
['2.694', '56.03%', '1.646', '26.72%', '1.818', '27.97%', '2.275', '35.83%', '2.885', '57.94%']
IF : 2.885
JCR : 57.94
insert success
UPDATE from  1865-7923 Chronic Respiratory Disease 2.885 57.94
[1;31m---------------------------------------------------------------------------[0m
[1;31mOperationalError[0m                          Traceback (most recent call last)
[1;32m<ipython-input-8-c671a7831570>[0m in [0;36m<module>[1;34m[0m
[0;32m    772[0m [1;33m[0m[0m
[0;32m    773[0m [1;33m[0m[0m
[1;32m--> 774[1;33m [0mmain[0m[1;33m([0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0m
[1;32m<ipython-input-8-c671a7831570>[0m in [0;36mmain[1;34m()[0m
[0;32m    675[0m                 [0mfile[0m[1;33m.[0m[0mclose[0m[1;33m([0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0;32m    676[0m [1;33m[0m[0m
[1;32m--> 677[1;33m         [0mmylist[0m [1;33m=[0m [0mget_lists[0m[1;33m([0m[1;34m'2018'[0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0m[0;32m    678[0m         [0mprint[0m[1;33m([0m[1;34m"total ISSNs : "[0m[1;33m,[0m [0mlen[0m[1;33m([0m[0mmylist[0m[1;33m)[0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0;32m    679[0m     [1;32melif[0m [0minputs[0m [1;33m==[0m [1;34m'5'[0m[1;33m:[0m[1;33m[0m[1;33m[0m[0m

[1;32m<ipython-input-8-c671a7831570>[0m in [0;36mget_lists[1;34m(JYear)[0m
[0;32m    526[0m [1;33m[0m[0m
[0;32m    527[0m     [0msql[0m [1;33m=[0m [1;34m"SELECT * FROM '"[0m [1;33m+[0m [0mJYear[0m [1;33m+[0m [1;34m"' WHERE IF = '"[0m [1;33m+[0m [1;34m'undefined'[0m  [1;33m+[0m [1;34m"'"[0m[1;33m[0m[1;33m[0m[0m
[1;32m--> 528[1;33m     [0mcur[0m[1;33m.[0m[0mexecute[0m[1;33m([0m[0msql[0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0m[0;32m    529[0m     [0mrows[0m [1;33m=[0m [0mcur[0m[1;33m.[0m[0mfetchall[0m[1;33m([0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0;32m    530[0m     [0mreturnlist[0m [1;33m=[0m [1;33m[[0m[1;33m][0m[1;33m[0m[1;33m[0m[0m

[1;31mOperationalError[0m: no such table: 2018
###

[1;31m---------------------------------------------------------------------------[0m
[1;31mNameError[0m                                 Traceback (most recent call last)
[1;32m<ipython-input-5-04f5111e6777>[0m in [0;36m<module>[1;34m[0m
[1;32m----> 1[1;33m [0mmytext[0m [1;33m=[0m [0mtable[0m[1;33m.[0m[0mtext[0m[1;33m[0m[1;33m[0m[0m
[0m[0;32m      2[0m [0mlocation[0m [1;33m=[0m [0mmytext[0m[1;33m.[0m[0mrfind[0m[1;33m([0m[1;34m'2018'[0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0;32m      3[0m [0mtemp[0m [1;33m=[0m [0mmytext[0m[1;33m[[0m[0mlocation[0m[1;33m:[0m[0mlen[0m[1;33m([0m[0mmytext[0m[1;33m)[0m[1;33m][0m[1;33m[0m[1;33m[0m[0m
[0;32m      4[0m [0mmylists[0m [1;33m=[0m [0mtemp[0m[1;33m.[0m[0msplit[0m[1;33m([0m[1;34m'%'[0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m
[0;32m      5[0m [0mmylists[0m[1;33m.[0m[0mremove[0m[1;33m([0m[1;34m''[0m[1;33m)[0m[1;33m[0m[1;33m[0m[0m

[1;31mNameError[0m: name 'table' is not defined
'''