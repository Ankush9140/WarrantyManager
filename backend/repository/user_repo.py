from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

class UserRepo:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client[os.getenv("MONGO_DB")]
        self.collection = self.db["users"]

    def create_user(self, user: dict):
        return self.collection.insert_one(user)

    def find_by_email(self, email: str):
        return self.collection.find_one({"email": email})
