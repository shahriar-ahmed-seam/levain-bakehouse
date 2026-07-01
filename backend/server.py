from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models import (
    Product, ProductCreate,
    Order, OrderCreate,
    Review, ReviewCreate
)
from seed_data import products_seed, reviews_seed


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Startup event to seed database
@app.on_event("startup")
async def startup_db():
    # Seed products if collection is empty
    products_count = await db.products.count_documents({})
    if products_count == 0:
        for product_data in products_seed:
            product = Product(**product_data)
            await db.products.insert_one(product.dict())
        logger.info(f"Seeded {len(products_seed)} products")
    
    # Seed reviews if collection is empty
    reviews_count = await db.reviews.count_documents({})
    if reviews_count == 0:
        for review_data in reviews_seed:
            review_dict = review_data.copy()
            review_dict['date'] = datetime.fromisoformat(review_dict['date'])
            review = Review(**review_dict)
            await db.reviews.insert_one(review.dict())
        logger.info(f"Seeded {len(reviews_seed)} reviews")
    
    # Create indexes
    await db.products.create_index("id", unique=True)
    await db.orders.create_index("id", unique=True)
    await db.reviews.create_index("id", unique=True)
    logger.info("Database initialized successfully")


# ==================== PRODUCTS ENDPOINTS ====================

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = Query(None)):
    """Get all products with optional category filter"""
    try:
        query = {}
        if category and category != "All":
            query["category"] = category
        
        products = await db.products.find(query).to_list(1000)
        return [Product(**product) for product in products]
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get single product by ID"""
    try:
        product = await db.products.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return Product(**product)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch product")


@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate):
    """Create new product"""
    try:
        product = Product(**product_input.dict())
        await db.products.insert_one(product.dict())
        logger.info(f"Created product: {product.name}")
        return product
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create product")


# ==================== ORDERS ENDPOINTS ====================

@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    """Create new order"""
    try:
        order = Order(**order_input.dict())
        await db.orders.insert_one(order.dict())
        logger.info(f"Created order {order.id} for {order.customer.name}")
        return order
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create order")


@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    """Get all orders"""
    try:
        orders = await db.orders.find().sort("created_at", -1).to_list(1000)
        return [Order(**order) for order in orders]
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get single order by ID"""
    try:
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return Order(**order)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")


# ==================== REVIEWS ENDPOINTS ====================

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    """Get all reviews"""
    try:
        reviews = await db.reviews.find().sort("date", -1).to_list(1000)
        return [Review(**review) for review in reviews]
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")


@api_router.post("/reviews", response_model=Review)
async def create_review(review_input: ReviewCreate):
    """Create new review"""
    try:
        review = Review(**review_input.dict())
        await db.reviews.insert_one(review.dict())
        logger.info(f"Created review from {review.name}")
        return review
    except Exception as e:
        logger.error(f"Error creating review: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create review")


# ==================== HEALTH ====================

@api_router.get("/health")
async def health_check():
    """Lightweight health probe for uptime checks / Render."""
    try:
        await db.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Database unavailable")


@app.get("/")
async def root():
    return {"service": "Levain Bakehouse API", "docs": "/docs", "health": "/api/health"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()