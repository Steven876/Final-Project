
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-gas',
  templateUrl: './view-gas.component.html',
  styleUrls: ['./view-gas.component.css']
})
export class ViewGasComponent implements OnInit {
  gas: any;

  constructor(
    private gasService: gasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.gasService.getSingleGas(id).subscribe((res) => {
      this.gas = res.data.gas[0];
      console.log(this.gas);
      if (this.gas && this.gas.img) {
        // Assuming 'img' property contains the image filename
        this.gas.img = `http://localhost:8888/uploads/${this.gas.img}`;
      } else {
        // Handle scenario where image data is missing
        this.gas.img = 'assets/images/default.jpg'; // Path to default image
      }
    });
  }
}
