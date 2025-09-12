import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private baseUrl = 'http://127.0.0.1:8000/v1/api/warranty';

    constructor(private http: HttpClient) { }

    private getHeaders(): { headers: HttpHeaders } {
        const token = localStorage.getItem('token') || '';
        return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }

    getDocumentStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/documentStatus`, this.getHeaders());
    }

    getWarrantyStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/warrantyStatus`, this.getHeaders());
    }

    getMonthlyStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/monthlyStatus`, this.getHeaders());
    }

    getAllWarranties(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/get_all_warranty`, this.getHeaders());
    }

    async createWarranty(data: any): Promise<any> {
        const formData = new FormData();
        formData.append('product_name', data.product_name);
        formData.append('customer_name', data.customer_name);
        formData.append('govt_id', data.govt_id);
        formData.append('purchase_date', data.purchase_date);
        formData.append('warranty_period', String(data.warranty_period));
        formData.append('status', data.status);
        formData.append('contact_info', data.contact_info);

        if (data.document instanceof File) {
            formData.append('document', data.document);
        }
        const request$ = this.http.post(
            `${this.baseUrl}/create_warranty`,
            formData,
            this.getHeaders()
        );
        return await lastValueFrom(request$);
    }

    async updateWarranty(product_id: string, data: any): Promise<any> {
        const formData = new FormData();
        if (data.product_name) formData.append('product_name', data.product_name);
        if (data.customer_name) formData.append('customer_name', data.customer_name);
        if (data.govt_id) formData.append('govt_id', data.govt_id);
        if (data.purchase_date) formData.append('purchase_date', data.purchase_date);
        if (data.warranty_period !== null && data.warranty_period !== undefined) {
            formData.append('warranty_period', String(data.warranty_period));
        }
        if (data.status) formData.append('status', data.status);
        if (data.contact_info) formData.append('contact_info', data.contact_info);

        if (data.document instanceof File) {
            formData.append('document', data.document);
        }

        const request$ = this.http.put(
            `${this.baseUrl}/update_warranty/${product_id}`,
            formData,
            this.getHeaders()
        );
        return await lastValueFrom(request$);
    }

    async deleteWarranty(product_id: string): Promise<any> {
        const request$ = this.http.delete(
            `${this.baseUrl}/delete_warranty/${product_id}`,
            this.getHeaders()
        );
        return await lastValueFrom(request$);
    }
}
