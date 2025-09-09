from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from models.warranty_model import Warranty
from service.warranty_service import WarrantyService
from typing import Optional
import io
from datetime import datetime
from controller.auth_controller import get_current_user
from fastapi import Depends

router = APIRouter()
warrantyService = WarrantyService()

@router.post("/create_warranty")
async def create_warranty(
    current_user: str = Depends(get_current_user),
    product_name: str = Form(...),
    customer_name: str = Form(...),
    govt_id: str = Form(...),
    purchase_date: str = Form(...),
    warranty_period: int = Form(...),
    status: str = Form(...),
    contact_info: str = Form(...),
    document: Optional[UploadFile] = File(None)
):
    warranty = Warranty(
        product_name=product_name,
        customer_name=customer_name,
        govt_id=govt_id,
        purchase_date=purchase_date,
        warranty_period=warranty_period,
        status=status,
        contact_info=contact_info,
    )
    return warrantyService.add_warranty(warranty, document)

@router.get("/get_all_warranty")
async def get_all_warranty(current_user: str = Depends(get_current_user)):
    return warrantyService.get_all_warranties()

@router.get("/get_warranty/{product_id}")
async def get_warranty(product_id: str,current_user: str = Depends(get_current_user)):
    return warrantyService.get_warranty(product_id)

@router.put("/update_warranty/{product_id}")
async def update_warranty(
    product_id: str,
    product_name: Optional[str] = Form(None),
    customer_name: Optional[str] = Form(None),
    govt_id: Optional[str] = Form(None),
    purchase_date: Optional[str] = Form(None),
    warranty_period: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    contact_info: Optional[str] = Form(None),
    document: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_user)
):
    updates_dict = {}

    if product_name:
        updates_dict["product_name"] = product_name
    if customer_name:
        updates_dict["customer_name"] = customer_name
    if govt_id:
        updates_dict["govt_id"] = govt_id
    if purchase_date:
        try:
            updates_dict["purchase_date"] = datetime.fromisoformat(purchase_date).date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format, expected YYYY-MM-DD")
    if warranty_period:
        try:
            updates_dict["warranty_period"] = int(warranty_period)
        except ValueError:
            raise HTTPException(status_code=400, detail="warranty_period must be an integer")
    if status:
        updates_dict["status"] = status
    if contact_info:
        updates_dict["contact_info"] = contact_info

    if not updates_dict and not document:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    return warrantyService.update_warranty(product_id, updates_dict, document)


@router.delete("/delete_warranty/{product_id}")
async def delete_warranty(product_id: str,current_user: str = Depends(get_current_user)):
    return warrantyService.delete_warranty(product_id)

@router.get("/download_document/{file_id}")
async def download_document(file_id: str,current_user: str = Depends(get_current_user)):
    try:
        content, filename = warrantyService.download_document(file_id)
        return StreamingResponse(io.BytesIO(content), media_type="application/octet-stream",
                                 headers={"Content-Disposition": f"attachment; filename={filename}"})
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
