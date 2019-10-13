from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

def web_search_journal(ISSN):
    #chromedriver 설치 경로 C:\ 로가정 
    driver = webdriver.Chrome('C:\\chromedriver')
    driver.get('https://jcr.clarivate.com/JCRLandingPageAction.action?Init=Yes&SrcApp=IC2LS&SID=J3-CTkSVwniVe02UGi4X5XUafEZxxTg21bpL-18x2dsSi9bBuBwWNTPTpUU0DGKQx3Dx3DZSQg4LF3S7LKuxxkUA9GoyAx3Dx3D-WwpRYkX4Gz8e7T4uNl5SUQx3Dx3D-wBEj1mx2B0mykql8H4kstFLwx3Dx3D')
    
    box = driver.find_element_by_name("search-inputEl")
    box.send_keys(ISSN)
    time.sleep(3)
    box.send_keys(Keys.RETURN)

if __name__ == "__main__":
    web_search_journal('0962-4929')
    web_search_journal('1078-8956')