import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Topbar } from '../top-bar/top-bar';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule, Topbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [DatePipe]
})
export class Dashboard implements OnInit {
  service = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);
  constructor(private router: Router) { }
  goToTables() {
    this.router.navigate(['/tables']);
  }
  chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
    axisY: { includeZero: true, interval: 1 },
    data: [{
      type: "splineArea",
      showInLegend: true,
      name: "Warranty Registered",
      dataPoints: [
        { label: "Jan", y: 0 },
        { label: "Feb", y: 0 },
        { label: "Mar", y: 0 },
        { label: "Apr", y: 0 },
        { label: "May", y: 0 },
        { label: "Jun", y: 0 },
      ]
    }]
  };
  chartOptions2: any = {
    animationEnabled: true,
    data: [{
      type: "doughnut",
      indexLabel: "{name}",
      dataPoints: [
        { y: 0, name: "Document Attached", color: "#8aaa16ff" },
        { y: 0, name: "Document Not Attached", color: "#dd7eb7ff" },
      ]
    }]
  };
  chartOptions3: any = {
    animationEnabled: true,
    data: [{
      type: "doughnut",
      indexLabel: "{name}",
      dataPoints: [
        { y: 0, name: "Active", color: "#0af030cb" },
        { y: 0, name: "Expired", color: "#f00c00c5" },
        { y: 0, name: "Claimed", color: "#0677f980" },
      ]
    }]
  };
  data: any[] = [];
  keys: string[] = [
    'customer_name',
    'product_name',
    'govt_id',
    'purchase_date',
    'warranty_period',
    'status',
    'contact_info'
  ];
  heading: string[] = [
    "Customer Name",
    "Product Name",
    "Govt ID",
    "Purchase Date",
    "Warranty Period",
    "Status",
    "Contact Info"
  ];
  ngOnInit(): void {
    // Document Status
    this.service.getDocumentStatus().subscribe(docRes => {
      this.chartOptions2 = {
        animationEnabled: true,
        legend: {
          fontSize: 18,
          fontFamily: "Arial",
          fontWeight: "bold"
        },
        data: [{
          type: "doughnut",
          indexLabel: "{name}",
          dataPoints: [
            { y: docRes.with_document, name: "Document Attached", color: "#63dd86ff" },
            { y: docRes.without_document, name: "Document Not Attached", color: "#7e94ddff" },
          ]
        }],
      };
      this.cdr.detectChanges();
    });

    // Warranty Status
    this.service.getWarrantyStatus().subscribe(statusRes => {
      this.chartOptions3 = {
        animationEnabled: true,
        data: [{
          type: "doughnut",
          indexLabel: "{name}",
          dataPoints: [
            { y: statusRes.Active, name: "Active", color: "#ddd269cb" },
            { y: statusRes.Expired, name: "Expired", color: "#d3625cc5" },
            { y: statusRes.Claimed, name: "Claimed", color: "#69a2e380" },
          ]
        }]
      };
      this.cdr.detectChanges();
    });

    // Monthly Status
    this.service.getMonthlyStatus().subscribe(monthRes => {
      this.chartOptions = {
        animationEnabled: true,
        theme: "light2",
        axisY: { includeZero: true, interval: 1 },
        data: [{
          type: "splineArea",
          showInLegend: true,
          name: "Warranty Registered",
          dataPoints: [
            { label: "Jan", y: monthRes.Jan },
            { label: "Feb", y: monthRes.Feb },
            { label: "Mar", y: monthRes.Mar },
            { label: "Apr", y: monthRes.Apr },
            { label: "May", y: monthRes.May },
            { label: "Jun", y: monthRes.Jun },
          ]
        }]
      };
      this.cdr.detectChanges();
    });

    //table data
    this.service.getAllWarranties().subscribe(warranties => {
      this.data = warranties;
      console.log(this.data)
      this.data.forEach(item => {
        if (item.purchase_date) {
          item.purchase_date = this.datePipe.transform(item.purchase_date, 'dd-MM-yyyy');
        }
      });
      this.cdr.detectChanges();
    })
  }
}
