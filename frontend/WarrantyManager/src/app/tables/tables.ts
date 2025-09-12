import { Component, inject} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import axios from 'axios';
import { Topbar } from '../top-bar/top-bar';
import { DashboardService } from '../dashboard/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tables',
  imports: [RouterOutlet, RouterModule, Topbar, FormsModule, CommonModule],
  templateUrl: './tables.html',
  styleUrl: './tables.scss'
})
export class Tables {
  service = inject(DashboardService);
  val: number = 1;
  setval(vale: number) {
    this.val = vale;
  }
  private baseUrl = 'http://127.0.0.1:8000/v1/api/warranty';
  async uploadDocs(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Create hidden file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.style.display = 'none';

      // Trigger file picker
      input.click();

      // Handle file selection
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          reject('❌ No file selected');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token') || '';

        try {
          const response = await axios.post(
            `${this.baseUrl}/bulk_create_warranty`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          resolve(response.data);
          alert('✅ Bulk upload successful');
        } catch (error) {
          alert('❌ Bulk upload failed');
          reject(error);
        }
      };
    });
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
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onFileChange(event: any) {
    this.formData.document = event.target.files[0];
  }

  async saveWarranty() {
    try {
      const response = await this.service.createWarranty(this.formData);
      alert('✅ Warranty created successfully');
      this.closeModal();
    } catch (err) {
      alert('❌ Failed to create warranty');
    }
  }
}
