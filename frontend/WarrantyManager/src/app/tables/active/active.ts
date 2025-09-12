import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../dashboard/dashboard.service';
import axios from 'axios';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-active',
  imports: [CommonModule, FormsModule],
  templateUrl: './active.html',
  styleUrl: './active.scss',
  providers: [DatePipe]
})

export class Active implements OnInit {
  service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  constructor(private datePipe: DatePipe) { }
  data: any[] = [];
  keys: string[] = [
    'customer_name',
    'product_name',
    'govt_id',
    'purchase_date',
    'warranty_period',
    'status',
    'contact_info',
    'document',
    'edit',
    'delete'
  ];
  heading: string[] = [
    "Customer Name",
    "Product Name",
    "Govt ID",
    "Purchase Date",
    "Warranty Period",
    "Status",
    "Contact Info",
    "Document",
    "Edit",
    "Delete"
  ];
  ngOnInit(): void {
    this.service.getAllWarranties().subscribe(warranties => {
      this.data = warranties.filter(item => item.status === 'Active');
      this.data.forEach(item => {
        if (item.purchase_date) {
          item.purchase_date = this.datePipe.transform(item.purchase_date, 'dd-MM-yyyy');
        }
      });
      this.cdr.detectChanges();
    });
  }
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-completed';
      case 'expired':
        return 'status-failed';
      case 'claimed':
        return 'status-closed';
      default:
        return '';
    }
  }
  async onDownload(item: any): Promise<void> {
    if (!item.document_id) {
      console.warn("No document available for this item");
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      const url = `http://127.0.0.1:8000/v1/api/warranty/download_document/${item.document_id}`;
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let filename = 'downloaded_file';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      link.href = href;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(href);

      alert(`✅ File downloaded: ${filename}`);
    } catch (error) {
      alert("❌ Download failed");
    }
  }

  showModal = false;
  formData: any = {
    product_name: '',
    customer_name: '',
    govt_id: '',
    purchase_date: '',
    warranty_period: '',
    status: 'Active',
    contact_info: '',
    document: null
  };
  openModal(item?: any) {
    this.showModal = true;

    if (item) {
      this.onEdit(item);
    }
  }

  onEdit(item: any) {
    this.formData = {
      product_id: item.product_id,
      product_name: item.product_name,
      customer_name: item.customer_name,
      govt_id: item.govt_id,
      purchase_date: this.formatDateForBackend(item.purchase_date),
      warranty_period: item.warranty_period,
      status: item.status,
      contact_info: item.contact_info,
      document: null
    };
  }
  closeModal() {
    this.showModal = false;
  }
  onFileChange(event: any) {
    this.formData.document = event.target.files[0];
  }
  formatDateForBackend(date: string): string {
    const parts = date.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return date;
  }
  async saveWarranty() {
    try {
      await this.service.updateWarranty(this.formData.product_id, this.formData);
      alert('✅ Warranty updated successfully');
      this.closeModal();
      this.ngOnInit?.();
    } catch (err) {
      alert('❌ Failed to save warranty');
      console.error(err);
    }
  }

  async delete(item: any) {
    try {
      await this.service.deleteWarranty(item.product_id);
      alert('✅ Warranty deleted successfully');
      this.ngOnInit?.();
    } catch (err) {
      alert('❌ Failed to delete warranty');
      console.error(err);
    }
  }
}