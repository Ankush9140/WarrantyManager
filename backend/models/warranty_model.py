from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import date
import uuid

class Warranty(BaseModel):
    product_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_name: str
    customer_name: str
    govt_id: str
    purchase_date: date
    warranty_period: int  
    status: Literal["Active", "Expired", "Claimed"]
    contact_info: str
    document_id: Optional[str] = None 
