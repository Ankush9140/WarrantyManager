from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from models.warranty_model import Warranty
from service.warranty_service import WarrantyService
from typing import Optional
import io
from datetime import date, datetime
from controller.auth_controller import get_current_user
from fastapi import Depends
from repository.warranty_repo import WarrantyRepo
from typing import Dict
from collections import Counter

router = APIRouter()
warrantyService = WarrantyService()
repo = WarrantyRepo()

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
            dt = datetime.fromisoformat(purchase_date)
            if isinstance(dt, date) and not isinstance(dt, datetime):
                dt = datetime.combine(dt, datetime.min.time())
            updates_dict["purchase_date"] = dt
        except ValueError:
            raise HTTPException(status_code=304, detail="Invalid date format, expected YYYY-MM-DD")
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


@router.get("/documentStatus")
async def warranties_documents(current_user: str = Depends(get_current_user)) -> Dict[str, int]:
    warranties = repo.get_all_warranties()
    with_doc = sum(1 for w in warranties if w.get("document_id"))
    without_doc = len(warranties) - with_doc
    return {"with_document": with_doc, "without_document": without_doc}


@router.get("/warrantyStatus")
async def warranties_status(current_user: str = Depends(get_current_user)) -> Dict[str, int]:
    warranties = repo.get_all_warranties()
    counts = Counter([w.get("status", "Unknown") for w in warranties])
    return {
        "Active": counts.get("Active", 0),
        "Expired": counts.get("Expired", 0),
        "Claimed": counts.get("Claimed", 0),
    }

@router.get("/monthlyStatus")
async def warranties_monthly(current_user: str = Depends(get_current_user)):
    warranties = repo.get_all_warranties()
    monthly_counts = {m: 0 for m in range(1, 7)}

    for w in warranties:
        if "purchase_date" in w:
            purchase_date = w["purchase_date"]
            if isinstance(purchase_date, str):
                purchase_date = datetime.fromisoformat(purchase_date)
            month = purchase_date.month
            if 1 <= month <= 6:
                monthly_counts[month] += 1

    return {
        "Jan": monthly_counts[1],
        "Feb": monthly_counts[2],
        "Mar": monthly_counts[3],
        "Apr": monthly_counts[4],
        "May": monthly_counts[5],
        "Jun": monthly_counts[6],
    }
