import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data-service.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  customer = { id: null, name: '', email: '' };

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.dataService.getCustomerById(id).subscribe(data => {
        this.customer = data;
      });
    } else {
      // Handle the case where id is null, e.g., navigate to a different page or show an error
      console.error('Customer ID is null');
      this.router.navigate(['/']); // Redirect to home or another appropriate page
    }
  }

  updateCustomer() {
    if (this.customer.id !== null) {
      this.dataService.updateCustomer(this.customer.id, this.customer).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
