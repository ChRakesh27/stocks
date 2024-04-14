from datetime import datetime
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
current_datetime = datetime.now()

MONGODB_URL= os.getenv("MONGODB_URL")

client = MongoClient(MONGODB_URL)

db = client.get_database('stocks-market')



# collection1 = db.get_collection(current_datetime.strftime("%Y_%m_%d"))
# documents = collection1.find()
# for document in documents:
#     print(document)

@app.route("/getData")
def fetchData():
    projection = {'_id': False}

    getDate = request.args.get('date')
    collectionName=current_datetime.strftime("%Y-%m-%d")

    if getDate:
        collectionName=getDate

    # collection = db.get_collection(current_datetime.strftime("%Y_%m_%d"))
    collection = db.get_collection(collectionName)

    res = list(collection.find({},projection))
    # client.close()
    return jsonify(res)

# if __name__ == "__main__":
#     app.run()
   