from bs4 import BeautifulSoup
from selenium import webdriver
from datetime import datetime
import db
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

url = "https://groww.in/markets/top-gainers?index=GIDXNIFTY100"

def fetch_data():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1200")
    current_datetime = datetime.now()
    s=Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=s, options=options)
    driver.get(url)
    page_source = driver.page_source

    driver.quit()

    soup = BeautifulSoup(page_source, 'html.parser')
    
    table = soup.find('table', class_='tb10Table')
    if table:
        rows = table.find_all('tr')
        for row in rows[1:]:
            columns = row.find_all('td')
            company = columns[0].find('a').text.strip()
            market_price = columns[2].text.strip()
            percet = market_price.split()
            link= "<a href='https://groww.in"+columns[0].find('a').get('href')+"'target='_blank'>"+company +"</a>"
            filter = {'company': company, "link":link}

            key = current_datetime.strftime("%H:%M")
            # key = "10:20"

            ukey = "records."+key

            update = {
                '$set': {
                    ukey: {
                        "price":percet[0][0:percet[0].find('.')+3], 
                        "percentage": percet[1][1:-2]
                    }
                }
            }
            print("=>",update)
            result = db.collection.update_many(filter, update, upsert=True)
    # print(dataSet)
    
startTime="09:15"
endTime="15:30"

# while True:
#     current_datetime = datetime.now()
#     currentTime = current_datetime.strftime("%H:%M:%S")
#     if currentTime>startTime and currentTime<endTime:
#         print("fetching..")
#         fetch_data()
#         time.sleep(60)
#     else:
#         print("TimeOut",currentTime)
#         time.sleep(1)


fetch_data()
# time.sleep(60)
# fetch_data()
    
   
