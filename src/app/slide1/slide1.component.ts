import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide1',
  standalone: true,
  imports: [],
  templateUrl: './slide1.component.html',
  styleUrl: './slide1.component.scss'
})
export class Slide1Component {
  constructor(private router:Router) {}

  irSlide2(){
    this.router.navigate(['/slide2']);
  }
  eleccion(){
    this.router.navigate(['/eleccion']);
  }

}
