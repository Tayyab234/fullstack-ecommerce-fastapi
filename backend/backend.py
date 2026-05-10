from fastapi import FastAPI,HTTPException,APIRouter
from pydantic import BaseModel
from typing import List, Optional
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
cart_collection = db["cart"]
orders_collection = db["orders"]  # optional but recommended

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

class CartItem(BaseModel):
    productId: str
    quantity: int
    productName: str
    productPriceCents: int
    image: str
    option: int


# =========================
# Cart Endpoint
# =========================

@app.post("/cart")
def add_to_cart(item: CartItem):

    cart_collection.update_one(
        {"productId": item.productId},
        {
            "$inc": {
                "quantity": item.quantity
            },
            "$set": {
                "productName": item.productName,
                "productPriceCents": item.productPriceCents,
                "image": item.image,
                "option": item.option
            }
        },
        upsert=True
    )

    return {
        "message": "Cart updated successfully"
    }

@app.get("/cart")
def get_cart():

    cart_items = list(cart_collection.find())

    items_total_cents = 0
    shipping_cents = 0

    for item in cart_items:
        item["_id"] = str(item["_id"])

        # item total
        item_total = item["productPriceCents"] * item["quantity"]
        items_total_cents += item_total

        # shipping logic (per item OR per cart rule depending on your design)
        option = item.get("option", 1)

        if option == 1:
            shipping_cents += 0
        elif option == 2:
            shipping_cents += 499
        elif option == 3:
            shipping_cents += 999

    # subtotal before tax
    subtotal_cents = items_total_cents + shipping_cents

    # tax 10%
    tax_cents = int(subtotal_cents * 0.10)

    # final total
    total_cents = subtotal_cents + tax_cents

    return {
        "items": len(cart_items),

        "itemsTotal": items_total_cents / 100,
        "shipping": shipping_cents / 100,
        "subtotal": subtotal_cents / 100,
        "tax": tax_cents / 100,
        "total": total_cents / 100
    }
@app.get("/cart/count")
def get_cart_count():

    cart_items = list(cart_collection.find())

    total_items = 0

    for item in cart_items:
        total_items += item.get("quantity", 0)

    return {
        "count": total_items
    }

@app.get("/cart/items")
def get_cart_items():

    cart_items = list(cart_collection.find({}, {"_id": 0}))

    return cart_items




class UpdateCartItem(BaseModel):
    productId: str
    quantity: Optional[int] = None
    option: Optional[int] = None


@app.put("/cart")
def update_cart(item: UpdateCartItem):

    update_fields = {}

    # update quantity if provided
    if item.quantity is not None:
        update_fields["quantity"] = item.quantity

    # update option if provided
    if item.option is not None:
        update_fields["option"] = item.option

    # update database
    cart_collection.update_one(
        {"productId": item.productId},
        {
            "$set": update_fields
        }
    )

    return {
        "message": "Cart updated successfully"
    }


@app.delete("/cart/{productId}")
def delete_cart_item(productId: str):

    result = cart_collection.delete_one(
        {"productId": productId}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")

    return {
        "message": "Item deleted successfully"
    }

class OrderProduct(BaseModel):
    productId: str
    productImage: str
    productName: str 
    productPriceCents: int
    productDelivery: str
    productQuantity: int


class PlaceOrderRequest(BaseModel):
    date: str
    totalPriceCents: int
    products: List[OrderProduct]



@app.post("/placeorder")
def place_order(order: PlaceOrderRequest):

    # 1. Build order document
    order_data = {
        "date": order.date,
        "totalPriceCents": order.totalPriceCents,
        "products": [product.dict() for product in order.products]
    }

    # 2. Save order (recommended for real apps)
    inserted_order = orders_collection.insert_one(order_data)

    # 3. Clear cart after placing order
    delete_result = cart_collection.delete_many({})

    # 4. Safety check (optional)
    if inserted_order.inserted_id is None:
        raise HTTPException(status_code=500, detail="Order could not be created")

    return {
        "message": "Order placed successfully",
        "orderId": str(inserted_order.inserted_id),
        "cartClearedCount": delete_result.deleted_count
    }


@app.get("/orders")
def get_last_orders():

    orders = orders_collection.find().sort("_id", -1).limit(10)

    result = []

    for order in orders:
        result.append({
            "id": str(order["_id"]),
            "date": order["date"],
            "totalPriceCents": order["totalPriceCents"],
            "products": order["products"]
        })

    return {
        "orders": result
    }
