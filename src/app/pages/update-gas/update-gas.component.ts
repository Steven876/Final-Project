import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-update-gas',
  templateUrl: './update-gas.component.html',
  styleUrls: ['./update-gas.component.css']
})
export class UpdateGasComponent implements OnInit {
  id: number = 0;
  type: string = '';
  price: number = 0;
  img: File | null = null;
  gas: any = null;

  constructor(private gasService: gasService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadGas();
  }

  loadGas(): void {
    this.gasService.getSingleGas(this.id).subscribe((res) => {
      if (res.status === 'success') {
        this.gas = res.data.gas[0];
        this.type = this.gas.type;
        this.price = this.gas.price;
      }
    });
  }

  onFileChange(event: any): void {
    this.img = event.target.files[0];
  }

  updateGas(): void {
    const formData = new FormData();
    formData.append('type', this.type);
    formData.append('price', this.price.toString());
    if (this.img) {
      formData.append('img', this.img);
    } else {
      formData.append('currentImg', this.gas.img);
    }

    console.log('Updating gas with data:', formData);

    this.gasService.updateGas(formData, this.id).subscribe((res) => {
      console.log('Update response:', res);
      if (res.status === 'success') {
        this.router.navigateByUrl('/all-gas');
      } else {
        console.error(res.message);
      }
    }, (error) => {
      console.error('Update failed:', error);
    });
  }
}
