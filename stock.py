from bs4 import BeautifulSoup
from selenium import webdriver
from datetime import datetime
import db
import time
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options

url = "https://groww.in/markets/top-gainers?index=GIDXNIFTY100"
driver = webdriver.Chrome()
driver.get(url)

def fetch_data():
    current_datetime = datetime.now()
    currentTime = current_datetime.strftime("%H:%M:%S")
    if currentTime>startTime and currentTime<endTime:
        print("fetching..")
    else:
        print("TimeOut",currentTime)
        time.sleep(1)
        fetch_data()
        return
    # options = Options()
    # options.add_argument("--headless")
    # options.add_argument("--disable-gpu")
    # options.add_argument("--window-size=1920,1200")
    # s=Service(ChromeDriverManager().install())
    # driver = webdriver.Chrome(service=s, options=options)
    
    driver.refresh()
    page_source = driver.page_source
   
    soup = BeautifulSoup(page_source, 'html.parser')
    update={}
    table = soup.find('table', class_='tb10Table')
    if table:
        place=0
        count=0
        rows = table.find_all('tr')
        for row in rows[1:]:
            columns = row.find_all('td')
            company = columns[0].find('a').text.strip()
            market_price = columns[2].text.strip()
            percet = market_price.split()
            link= "<a href='https://groww.in"+columns[0].find('a').get('href')+"'target='_blank'>"+company +"</a>"
            filter = {'company': company, "link":link}

            key = current_datetime.strftime("%H:%M")
            # key = "09:17"
            place+=1
            count+=1
            htmlPlace=""
            if count<=5:
               htmlPlace= '<span><small class="pos_red"> (' + str(count) +')</small></span>'
            
            ukey = "records."+key

            update = {
                '$set': {
                    ukey: {
                        "price":percet[0][0:percet[0].find('.')+3], 
                        "percentage": percet[1][1:-2],
                        "place":place,
                        "pric_perc_Place": '<span><b>' + percet[1][1:-2] +'</b><br><small>' +percet[0][0:percet[0].find('.')+3] + '</small></span>'+htmlPlace
                    }
                }
            }
            print("=>",update)
            result = db.collection.update_many(filter, update, upsert=True)
    # print(dataSet)
    # time.sleep(60)
    # fetch_data()
    time.sleep(60)
    fetch_data()
    return
    
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
# time.sleep(10)
# fetch_data()
    
   
