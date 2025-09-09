from models.warranty_model import Warranty
from repository.warranty_repo import WarrantyRepo
from bson import ObjectId
from datetime import date, datetime
from loguru import logger

class WarrantyService:
    def __init__(self):
        self.repo = WarrantyRepo()

    def add_warranty(self, warranty: Warranty, document=None):
        if document:
            file_id = self.repo.save_document(document.file, document.filename)
            warranty.document_id = file_id

        self.repo.create_warranty(warranty.dict())
        logger.info(f"Warranty created: {warranty.product_id}")
        return warranty

    def serialize_warranty(self, warranty: dict):
        warranty_copy = warranty.copy()

        if "_id" in warranty_copy and isinstance(warranty_copy["_id"], ObjectId):
            warranty_copy["_id"] = str(warranty_copy["_id"])
        if "document_id" in warranty_copy and isinstance(warranty_copy["document_id"], ObjectId):
            warranty_copy["document_id"] = str(warranty_copy["document_id"])

        if "purchase_date" in warranty_copy and isinstance(warranty_copy["purchase_date"], (datetime, date)):
            warranty_copy["purchase_date"] = warranty_copy["purchase_date"].isoformat()

        return warranty_copy

    def get_all_warranties(self):
        warranties = self.repo.get_all_warranties()
        return [self.serialize_warranty(w) for w in warranties]

    def get_warranty(self, product_id: str):
        return self.repo.get_warranty_by_product_id(product_id)

    def update_warranty(self, product_id: str, updates: dict, document=None):
        if document:
            file_id = self.repo.save_document(document.file, document.filename)
            updates["document_id"] = file_id
        result =  self.repo.update_warranty(product_id, updates)
        return {
        "matched_count": result.matched_count,
        "modified_count": result.modified_count,
        "acknowledged": result.acknowledged,
    }

    def delete_warranty(self, product_id: str):
        warranty = self.repo.get_warranty_by_product_id(product_id)
        if warranty and "document_id" in warranty and warranty["document_id"]:
            self.repo.delete_document(warranty["document_id"])
        return self.repo.delete_warranty(product_id)

    def download_document(self, file_id: str):
        return self.repo.get_document(file_id)
