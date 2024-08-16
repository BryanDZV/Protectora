import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide2',
  standalone: true,
  imports: [],
  templateUrl: './slide2.component.html',
  styleUrl: './slide2.component.scss'
})
export class Slide2Component {
  constructor(private router:Router) { }
  irSlide1(){
    this.router.navigate(['/slide1']);
  }
  irSlide3(){
    this.router.navigate(['/slide3']);
  }

  eleccion(){
    this.router.navigate(['/eleccion']);
  }
}
