import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide3',
  standalone: true,
  imports: [],
  templateUrl: './slide3.component.html',
  styleUrl: './slide3.component.scss'
})
export class Slide3Component {
  constructor(private router:Router) {}

  irSlide2(){
    this.router.navigate(['/slide2']);
  }

  eleccion(){
    this.router.navigate(['/eleccion'])
  }

}
