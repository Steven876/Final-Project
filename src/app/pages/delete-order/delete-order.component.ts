// src/app/components/delete-order/delete-order.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.css']
})
export class DeleteOrderComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private gasService: gasService,
    
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gasService.getOrder(+id).subscribe(response => {
        this.order = response.data.order;
      });
    }
  }

  deleteOrder(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gasService.deleteOrder(+id).subscribe(() => {
        this.router.navigate(['/deliveries']);
      });
    }
  }
}
