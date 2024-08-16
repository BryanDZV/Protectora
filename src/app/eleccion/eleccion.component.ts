import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-eleccion',
  standalone: true,
  imports: [],
  templateUrl: './eleccion.component.html',
  styleUrl: './eleccion.component.scss'
})
export class EleccionComponent {
  constructor(private router:Router){}

  login(){
    this.router.navigate(['/login']);
  }
  refugio(){
    this.router.navigate(['/']);
  }

}
