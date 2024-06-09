
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  gas: any[] = [];

  constructor(private gasService: gasService, private router: Router) {}

  ngOnInit(): void {
    this.gasService.getAllGas().subscribe(response => {
      this.gas = response.data.gas.map((g: any) => ({
        ...g,
        img: g.img ? `http://localhost:8888/uploads/${g.img}` : 'assets/images/default.jpg'
      }));
    });
  }

  orderGas(gas: any): void {
    this.router.navigate(['/order'], { state: { gas } });
  }
}
