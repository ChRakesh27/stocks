from pymongo import MongoClient
from datetime import datetime

MONGODB_URL= "mongodb+srv://user:user1234@questions.g0dpi3d.mongodb.net/stocks-market?retryWrites=true&w=majority"
current_datetime = datetime.now()

client = MongoClient(MONGODB_URL)
db = client.get_database('stocks-market')
# collection = db.get_collection(current_datetime.strftime("%Y-%m-%d"))
collection = db.get_collection("2023-04-13")