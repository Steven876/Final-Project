// src/app/pages/view-order/view-order.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    private gasService: gasService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gasService.getOrder(+id).subscribe(response => {
        this.order = response.data.order;
      });
    }
  }
}
