from pymongo import MongoClient
import gridfs
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
from datetime import date, datetime
from bson.errors import InvalidId

load_dotenv()

class WarrantyRepo:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client[os.getenv("MONGO_DB")]
        self.collection = self.db["warranties"]
        self.fs = gridfs.GridFS(self.db)

    def create_warranty(self, warranty: dict):
        if isinstance(warranty.get("purchase_date"), date):
            warranty["purchase_date"] = datetime.combine(warranty["purchase_date"], datetime.min.time())
        return self.collection.insert_one(warranty)

    def get_warranty_by_product_id(self, product_id: str):
        product_id = product_id.strip('"')  
        warranty = self.collection.find_one({"product_id": product_id})
        if warranty:
            warranty["_id"] = str(warranty["_id"])
            if "document_id" in warranty and warranty["document_id"]:
                warranty["document_id"] = str(warranty["document_id"])
        return warranty

    def get_all_warranties(self):
        warranties = list(self.collection.find())
        for w in warranties:
            w["_id"] = str(w["_id"])
            if "document_id" in w and w["document_id"]:
                w["document_id"] = str(w["document_id"])
        return warranties

    def update_warranty(self, product_id: str, updates: dict):
        product_id = product_id.strip('"')
        return self.collection.update_one({"product_id": product_id}, {"$set": updates})

    def delete_warranty(self, product_id: str):
        product_id = product_id.strip('"')
        return self.collection.delete_one({"product_id": product_id})

    def save_document(self, file, filename: str):
        file_id = self.fs.put(file, filename=filename)
        return str(file_id)

    def get_document(self, file_id: str):
        file_id = file_id.strip('"')
        try:
            obj_id = ObjectId(file_id)
        except InvalidId:
            raise ValueError("Invalid ObjectId")
        
        grid_out = self.fs.get(obj_id)
        return grid_out.read(), grid_out.filename

    def delete_document(self, file_id: str):
        file_id = file_id.strip('"')
        try:
            obj_id = ObjectId(file_id)
        except InvalidId:
            raise ValueError("Invalid ObjectId")
        
        self.fs.delete(obj_id)
