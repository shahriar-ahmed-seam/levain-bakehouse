#!/usr/bin/env python3
"""
Sweet Home Bakery Backend API Testing Suite
Tests all backend API endpoints for the bakery application
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, List, Any

# Backend URL from environment
BACKEND_URL = "https://fresh-baked-goods-85.preview.emergentagent.com/api"

class BakeryAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = {
            "products_api": {"passed": False, "details": ""},
            "products_category_filter": {"passed": False, "details": ""},
            "orders_create": {"passed": False, "details": ""},
            "orders_get": {"passed": False, "details": ""},
            "reviews_api": {"passed": False, "details": ""},
            "database_seeding": {"passed": False, "details": ""}
        }
        
    def log(self, message: str):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {message}")
        
    def test_products_api(self) -> bool:
        """Test GET /api/products endpoint"""
        self.log("Testing GET /api/products...")
        
        try:
            response = self.session.get(f"{self.base_url}/products")
            
            if response.status_code != 200:
                self.test_results["products_api"]["details"] = f"HTTP {response.status_code}: {response.text}"
                return False
                
            products = response.json()
            
            # Verify we have 6 seeded products
            if len(products) != 6:
                self.test_results["products_api"]["details"] = f"Expected 6 products, got {len(products)}"
                return False
                
            # Verify product structure
            required_fields = ["id", "name", "category", "price", "description", "image", "featured"]
            for product in products:
                for field in required_fields:
                    if field not in product:
                        self.test_results["products_api"]["details"] = f"Missing field '{field}' in product"
                        return False
                        
            # Verify specific seeded products exist
            product_names = [p["name"] for p in products]
            expected_products = [
                "Artisan Sourdough Bread",
                "Chocolate Fudge Brownies", 
                "Butter Croissants (6 pack)",
                "Classic Chocolate Chip Cookies",
                "Cinnamon Swirl Bread",
                "Assorted Danish Pastries"
            ]
            
            for expected in expected_products:
                if expected not in product_names:
                    self.test_results["products_api"]["details"] = f"Missing expected product: {expected}"
                    return False
                    
            self.test_results["products_api"]["details"] = f"Successfully retrieved {len(products)} products with correct structure"
            self.test_results["products_api"]["passed"] = True
            return True
            
        except Exception as e:
            self.test_results["products_api"]["details"] = f"Exception: {str(e)}"
            return False
            
    def test_products_category_filter(self) -> bool:
        """Test GET /api/products with category filter"""
        self.log("Testing GET /api/products?category=Breads...")
        
        try:
            response = self.session.get(f"{self.base_url}/products?category=Breads")
            
            if response.status_code != 200:
                self.test_results["products_category_filter"]["details"] = f"HTTP {response.status_code}: {response.text}"
                return False
                
            products = response.json()
            
            # Should have 2 bread products based on seed data
            if len(products) != 2:
                self.test_results["products_category_filter"]["details"] = f"Expected 2 bread products, got {len(products)}"
                return False
                
            # Verify all returned products are in Breads category
            for product in products:
                if product["category"] != "Breads":
                    self.test_results["products_category_filter"]["details"] = f"Product {product['name']} has category {product['category']}, expected 'Breads'"
                    return False
                    
            # Verify specific bread products
            bread_names = [p["name"] for p in products]
            expected_breads = ["Artisan Sourdough Bread", "Cinnamon Swirl Bread"]
            
            for expected in expected_breads:
                if expected not in bread_names:
                    self.test_results["products_category_filter"]["details"] = f"Missing expected bread product: {expected}"
                    return False
                    
            self.test_results["products_category_filter"]["details"] = f"Successfully filtered {len(products)} bread products"
            self.test_results["products_category_filter"]["passed"] = True
            return True
            
        except Exception as e:
            self.test_results["products_category_filter"]["details"] = f"Exception: {str(e)}"
            return False
            
    def test_orders_create(self) -> bool:
        """Test POST /api/orders endpoint"""
        self.log("Testing POST /api/orders...")
        
        try:
            # Create a realistic test order
            order_data = {
                "customer": {
                    "name": "Emma Wilson",
                    "email": "emma.wilson@email.com",
                    "phone": "+1-555-0123",
                    "address": "123 Maple Street, Springfield, IL 62701",
                    "delivery_zone": "Zone A"
                },
                "items": [
                    {
                        "product_id": "1",
                        "name": "Artisan Sourdough Bread",
                        "price": 8.99,
                        "quantity": 2
                    },
                    {
                        "product_id": "2", 
                        "name": "Chocolate Fudge Brownies",
                        "price": 12.99,
                        "quantity": 1
                    }
                ],
                "delivery_fee": 5.00,
                "total_amount": 35.97,
                "notes": "Please ring doorbell twice"
            }
            
            response = self.session.post(
                f"{self.base_url}/orders",
                json=order_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                self.test_results["orders_create"]["details"] = f"HTTP {response.status_code}: {response.text}"
                return False
                
            order = response.json()
            
            # Verify order structure
            required_fields = ["id", "customer", "items", "delivery_fee", "total_amount", "status", "created_at"]
            for field in required_fields:
                if field not in order:
                    self.test_results["orders_create"]["details"] = f"Missing field '{field}' in order response"
                    return False
                    
            # Verify order data matches input
            if order["customer"]["name"] != order_data["customer"]["name"]:
                self.test_results["orders_create"]["details"] = "Customer name mismatch in response"
                return False
                
            if len(order["items"]) != len(order_data["items"]):
                self.test_results["orders_create"]["details"] = "Items count mismatch in response"
                return False
                
            if order["total_amount"] != order_data["total_amount"]:
                self.test_results["orders_create"]["details"] = "Total amount mismatch in response"
                return False
                
            # Store order ID for later tests
            self.created_order_id = order["id"]
            
            self.test_results["orders_create"]["details"] = f"Successfully created order {order['id']} for {order['customer']['name']}"
            self.test_results["orders_create"]["passed"] = True
            return True
            
        except Exception as e:
            self.test_results["orders_create"]["details"] = f"Exception: {str(e)}"
            return False
            
    def test_orders_get(self) -> bool:
        """Test GET /api/orders endpoint"""
        self.log("Testing GET /api/orders...")
        
        try:
            response = self.session.get(f"{self.base_url}/orders")
            
            if response.status_code != 200:
                self.test_results["orders_get"]["details"] = f"HTTP {response.status_code}: {response.text}"
                return False
                
            orders = response.json()
            
            # Should have at least the order we just created
            if len(orders) < 1:
                self.test_results["orders_get"]["details"] = "No orders returned, expected at least 1"
                return False
                
            # Verify order structure
            required_fields = ["id", "customer", "items", "delivery_fee", "total_amount", "status", "created_at"]
            for order in orders:
                for field in required_fields:
                    if field not in order:
                        self.test_results["orders_get"]["details"] = f"Missing field '{field}' in order"
                        return False
                        
            # Verify our created order is in the list
            if hasattr(self, 'created_order_id'):
                order_ids = [o["id"] for o in orders]
                if self.created_order_id not in order_ids:
                    self.test_results["orders_get"]["details"] = f"Created order {self.created_order_id} not found in orders list"
                    return False
                    
            self.test_results["orders_get"]["details"] = f"Successfully retrieved {len(orders)} orders"
            self.test_results["orders_get"]["passed"] = True
            return True
            
        except Exception as e:
            self.test_results["orders_get"]["details"] = f"Exception: {str(e)}"
            return False
            
    def test_reviews_api(self) -> bool:
        """Test GET /api/reviews endpoint"""
        self.log("Testing GET /api/reviews...")
        
        try:
            response = self.session.get(f"{self.base_url}/reviews")
            
            if response.status_code != 200:
                self.test_results["reviews_api"]["details"] = f"HTTP {response.status_code}: {response.text}"
                return False
                
            reviews = response.json()
            
            # Verify we have 4 seeded reviews
            if len(reviews) != 4:
                self.test_results["reviews_api"]["details"] = f"Expected 4 reviews, got {len(reviews)}"
                return False
                
            # Verify review structure
            required_fields = ["id", "name", "rating", "comment", "date"]
            for review in reviews:
                for field in required_fields:
                    if field not in review:
                        self.test_results["reviews_api"]["details"] = f"Missing field '{field}' in review"
                        return False
                        
            # Verify specific seeded reviews exist
            reviewer_names = [r["name"] for r in reviews]
            expected_reviewers = ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Thompson"]
            
            for expected in expected_reviewers:
                if expected not in reviewer_names:
                    self.test_results["reviews_api"]["details"] = f"Missing expected reviewer: {expected}"
                    return False
                    
            # Verify ratings are valid (1-5)
            for review in reviews:
                if not (1 <= review["rating"] <= 5):
                    self.test_results["reviews_api"]["details"] = f"Invalid rating {review['rating']} for review by {review['name']}"
                    return False
                    
            self.test_results["reviews_api"]["details"] = f"Successfully retrieved {len(reviews)} reviews with correct structure"
            self.test_results["reviews_api"]["passed"] = True
            return True
            
        except Exception as e:
            self.test_results["reviews_api"]["details"] = f"Exception: {str(e)}"
            return False
            
    def test_database_seeding(self) -> bool:
        """Verify database seeding worked correctly"""
        self.log("Verifying database seeding...")
        
        try:
            # Check if products and reviews APIs both work (indicating seeding worked)
            products_seeded = self.test_results["products_api"]["passed"]
            reviews_seeded = self.test_results["reviews_api"]["passed"]
            
            if not products_seeded:
                self.test_results["database_seeding"]["details"] = "Products seeding failed - no products found"
                return False
                
            if not reviews_seeded:
                self.test_results["database_seeding"]["details"] = "Reviews seeding failed - no reviews found"
                return False
                
            # Additional verification - check that we have the exact expected data
            products_response = self.session.get(f"{self.base_url}/products")
            reviews_response = self.session.get(f"{self.base_url}/reviews")
            
            if products_response.status_code == 200 and reviews_response.status_code == 200:
                products = products_response.json()
                reviews = reviews_response.json()
                
                # Verify exact counts match seed data
                if len(products) == 6 and len(reviews) == 4:
                    self.test_results["database_seeding"]["details"] = "Database seeding successful - 6 products and 4 reviews found"
                    self.test_results["database_seeding"]["passed"] = True
                    return True
                else:
                    self.test_results["database_seeding"]["details"] = f"Seeding incomplete - found {len(products)} products and {len(reviews)} reviews"
                    return False
            else:
                self.test_results["database_seeding"]["details"] = "Unable to verify seeding - API endpoints not responding"
                return False
                
        except Exception as e:
            self.test_results["database_seeding"]["details"] = f"Exception: {str(e)}"
            return False
            
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all backend API tests"""
        self.log("Starting Sweet Home Bakery Backend API Tests")
        self.log(f"Testing against: {self.base_url}")
        self.log("=" * 60)
        
        # Test order matters - some tests depend on others
        test_methods = [
            ("Products API", self.test_products_api),
            ("Products Category Filter", self.test_products_category_filter),
            ("Reviews API", self.test_reviews_api),
            ("Database Seeding", self.test_database_seeding),
            ("Orders Create", self.test_orders_create),
            ("Orders Get", self.test_orders_get),
        ]
        
        passed_count = 0
        total_count = len(test_methods)
        
        for test_name, test_method in test_methods:
            self.log(f"\n--- {test_name} ---")
            try:
                if test_method():
                    self.log(f"✅ {test_name} PASSED")
                    passed_count += 1
                else:
                    self.log(f"❌ {test_name} FAILED")
            except Exception as e:
                self.log(f"❌ {test_name} ERROR: {str(e)}")
                
        self.log("\n" + "=" * 60)
        self.log(f"SUMMARY: {passed_count}/{total_count} tests passed")
        
        # Return detailed results
        return {
            "summary": {
                "total_tests": total_count,
                "passed_tests": passed_count,
                "success_rate": f"{(passed_count/total_count)*100:.1f}%"
            },
            "details": self.test_results
        }

def main():
    """Main test execution"""
    tester = BakeryAPITester()
    results = tester.run_all_tests()
    
    # Print detailed results
    print("\n" + "=" * 60)
    print("DETAILED TEST RESULTS")
    print("=" * 60)
    
    for test_name, result in results["details"].items():
        status = "✅ PASSED" if result["passed"] else "❌ FAILED"
        print(f"\n{test_name.upper().replace('_', ' ')}: {status}")
        print(f"Details: {result['details']}")
    
    print(f"\nOVERALL SUMMARY:")
    print(f"Tests Passed: {results['summary']['passed_tests']}/{results['summary']['total_tests']}")
    print(f"Success Rate: {results['summary']['success_rate']}")
    
    # Exit with appropriate code
    if results["summary"]["passed_tests"] == results["summary"]["total_tests"]:
        print("\n🎉 All tests passed! Backend API is working correctly.")
        sys.exit(0)
    else:
        print(f"\n⚠️  {results['summary']['total_tests'] - results['summary']['passed_tests']} test(s) failed. Check details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()