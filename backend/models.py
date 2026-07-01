from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: float
    description: str
    image: str
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str
    image: str
    featured: bool = False


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int


class CustomerInfo(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    delivery_zone: str


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer: CustomerInfo
    items: List[OrderItem]
    delivery_fee: float
    total_amount: float
    notes: Optional[str] = ""
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class OrderCreate(BaseModel):
    customer: CustomerInfo
    items: List[OrderItem]
    delivery_fee: float
    total_amount: float
    notes: Optional[str] = ""


class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    rating: int
    comment: str
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ReviewCreate(BaseModel):
    name: str
    rating: int
    comment: str
