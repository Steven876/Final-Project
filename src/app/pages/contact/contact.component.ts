import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  ownerContact = {
    name: 'Steve Armstrong',
    email: 'stevegas956@gmail.com',
    phone: '876-331-1459',
    phone2: '876-455-6932'
  };

  constructor() { }
  ngOnInit(): void {
  }
}
