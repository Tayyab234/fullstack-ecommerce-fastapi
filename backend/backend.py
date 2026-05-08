from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pymongo import MongoClient
import json
import time

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MongoDB ----------------
client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce"]
products_collection = db["products"]

# ---------------- Streaming Generator ----------------
def stream_products():

    products = products_collection.find()

    for product in products:

        # Convert ObjectId to string
        product["_id"] = str(product["_id"])

        # Convert product to JSON string
        data = json.dumps(product)

        # Send chunk
        yield data + "\n"

        # Delay to simulate streaming
        time.sleep(1)

# ---------------- Endpoint ----------------
@app.get("/products-stream")
def get_products_stream():

    return StreamingResponse(
        stream_products(),
        media_type="text/plain"
    )
@app.get("/products")
def get_products():
    products = list(products_collection.find())
    for p in products:
        p["_id"] = str(p["_id"])
    return products