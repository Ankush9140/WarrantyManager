import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://127.0.0.1:8000/v1/api/warranty';

  constructor(private http: HttpClient) {}

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
}
