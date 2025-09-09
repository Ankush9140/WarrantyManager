from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import date

class WarrantyUpdate(BaseModel):
    product_name: Optional[str] = None
    customer_name: Optional[str] = None
    govt_id: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_period: Optional[int] = None
    status: Optional[Literal["Active", "Expired", "Claimed"]] = None
    contact_info: Optional[str] = None
    document_id: Optional[str] = None
