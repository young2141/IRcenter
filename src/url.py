import requests
import urllib.request, urllib.parse
from bs4 import BeautifulSoup

req = requests.get('https://scholar.google.com/citations?user=LvAnSYgAAAAJ&hl=en&oe=ASCII&cstart=20&pagesize=1000')
html = req.text

soup = BeautifulSoup(html, 'html.parser')
table = soup.find('table', {'id' : 'gsc_a_t'})

print(table)

'''
https://scholar.google.com/citations?user=LvAnSYgAAAAJ&hl=en&oe=ASCII

curl "https://scholar.google.com/citations?user=LvAnSYgAAAAJ^&hl=en^&oe=ASCII^&cstart=20^&pagesize=80" -H "sec-fetch-mode: cors" -H "cookie: SID=egeB--iaOKfa2EFABab_hwLJhsVQDIQT6_xzF8wtjyjlo8ovtf0Dezi4Q2SW6WBo3jmUtg.; HSID=AUr5QyPUkTVqchs3o; SSID=AaBv4ap-1Yea-RuAA; APISID=1fGts7CO31fO2PBr/A2thHa90yLXLDXa9K; SAPISID=lyi0CMFuTFkDhFoU/A0P5MnDx__ty3Ulf7; SEARCH_SAMESITE=CgQIvI0B; 1P_JAR=2019-8-15-6; NID=188=xuJybv28FTeXOj_z2zJ77J-UZ6xlnDosUOnUpOqzk-BfPys9aZFcMqtHgBY86UUiHSciRmh8sMfvSlygXtJOKS8CP0RrNh6WipiweKkeMncTf5hR_EymvoIwKBTbeLFdxTucloX0EeYTXc0V_aYRPsuq5J6W8CIillez4jnn7j-fWnB_6XCC6UX700Ec-M-_91lYZ7dMa1lBYWClMqxZp_uY2J0P0ld_bgBjRAIf; SIDCC=AN0-TYtkw8HwALeTVgXUEEAf5_asRb2RxaX9LUVLcnJRNd_f9KIR6lrgrlrPA8ErcaHUcQ4jPFk" -H "origin: https://scholar.google.com" -H "accept-encoding: gzip, deflate, br" -H "accept-language: en-IN,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,en-GB;q=0.6,en-US;q=0.5" -H "x-requested-with: XHR" -H "x-client-data: CIu2yQEIorbJAQjEtskBCKmdygEIqKPKAQjOpcoBCOKoygEI5qzKAQjqrMoBCJetygEIna3KAQjNrcoBCMuuygEIya/KAQjnr8oBCKGyygE=" -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36" -H "content-type: application/x-www-form-urlencoded" -H "accept: */*" -H "referer: https://scholar.google.com/citations?user=LvAnSYgAAAAJ^&hl=en^&oe=ASCII" -H "authority: scholar.google.com" -H "sec-fetch-site: same-origin" --data "json=1" --compressed
https://scholar.google.com/citations?user=LvAnSYgAAAAJ&hl=en&oe=ASCII&cstart=20&pagesize=80
'''