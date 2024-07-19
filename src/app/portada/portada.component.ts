import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portada',
  standalone:true,
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss']
})
export class PortadaComponent {
constructor(private router:Router){}
 
irSlide1(){
  this.router.navigate(['/slide1']);
}
}
  

