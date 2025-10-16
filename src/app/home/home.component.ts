import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  novedades = [
    {
      url: 'https://www.mundoanimalia.com/animales-consejos/chinchillas-nuestros-10-consejos-basicos.html',
      img: '../../assets/home/home1.png',
      texto: '10 Curiosidades sobre las chinchillas',
    },
    {
      url: 'https://nubika.es/noticias/que-comen-iguanas/',
      img: '../../assets/home/home2.png',
      texto: '¿Sabes qué comen las iguanas?',
    },
    {
      url: 'https://yendoplan.com/planes/madrid/parques-perros',
      img: '../../assets/home/home3.png',
      texto: '10 lugares para visitar con tu perro en Madrid',
    },
  ];
}
