from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup 
from datetime import datetime
import requests
import openpyxl, xlrd
import pandas as pd
import json,os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import csv
import sqlite3
import re
import os
import win32api, win32con
import pyautogui


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
        
def get_lists(JYear):
    conn = sqlite3.connect(r'C:\IR\USER\IR_Journal.db')
    cur = conn.cursor()    
    sql = "SELECT * FROM '" + JYear + "' WHERE IF = '" + 'undefined'  + "'"
    cur.execute(sql)
    
    rows = cur.fetchall()
    returnlist = []
    for i in range(0, len(rows)) :
        returnlist.append(rows[i][0])    
    conn.close() 
    return returnlist

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
        save = ISSN+'.html'   
        box.send_keys(Keys.RETURN)
        time.sleep(5)
        pyautogui.hotkey('ctrl','s')
        time.sleep(1)
        pyautogui.typewrite(save)
        pyautogui.hotkey('enter')    
        time.sleep(4)    
    driver.quit()
    
    
def main():
   
    mylist = get_lists('2019')
    print("total ISSNs : ", len(mylist))
    failed_list = []
    for i in range (0, len(mylist)):        
        web_search_journal(mylist[i],failed)

    with open('failed_ISSN.txt','w') as f:
        f.writelines(failed_list)        
    print("END")

if __name__ == "__main__":
    main()