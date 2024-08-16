import { Component } from '@angular/core';
import { ApiService } from '../servicios/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  id!:any;
  userDetalle!:any;
  constructor(private servicio: ApiService, private rutaActivada: ActivatedRoute) { }

  ngOnInit(): void {
    this.rutaActivada.paramMap.subscribe(params => {
      //console.log(params);
           this.id = params.get("id")
     console.log("Soy Id",params.get("id"));
    })

    this.servicio.getFormById(this.id).subscribe((data:any)=>{
      console.log("Soy datos",data);
      this.userDetalle=data
    })
}

}
