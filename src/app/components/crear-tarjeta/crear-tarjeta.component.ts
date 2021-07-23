import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = "Crear Tarjeta";
  id : string | undefined;

  constructor(private fb : FormBuilder, private _tarjetaService: TarjetaService, private toastr: ToastrService) {
    
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required,Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required,Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(3)]]

    })

   }

  ngOnInit(): void {

    //Aquí nos suscribumos al objeto tarjeta$ para que cuanto se emita lo recibamos inmediatamente
    this._tarjetaService.getTarjetaEdit().subscribe(data => {
      this.titulo = "Actualizar tarjeta";
      this.id = data.id;
      this.form.patchValue({
        titular : data.titular,
        numeroTarjeta : data.numeroTarjeta,
        fechaExpiracion : data.fechaExpiracion,
        cvv : data.cvv
      })


    })
  }

  guardarTarjeta(){
    if(this.id === undefined){
      //Si el id no existe es porque estamos creando una nueva tarjeta
      this.crearTarjeta();

    }
    else{
      //Si el id EXISTE estamos editando una tarjeta
      this.actualizarTarjeta(this.id);

    }
  }

  crearTarjeta(){
    const TARJETA: TarjetaCredito = {
      titular : this.form.value.titular,
      numeroTarjeta : this.form.value.numeroTarjeta,
      fechaExpiracion : this.form.value.fechaExpiracion,
      cvv : this.form.value.cvv,
      fechaCreacion : new Date(),
      fechaActualizacion : new Date()
    }

    this.loading = true;
    this._tarjetaService.guardarTarjeta(TARJETA).then(()=>{
      this.toastr.success('La tarjeta fue registrada con éxito!', 'Tarjeta Registrada');
      console.log('Tarjeta Registrada');
      this.loading = false;
      this.form.reset();
    }, error=>{
      this.loading = false;
      this.toastr.error('¡Oh no! Ocurrió un error', 'Error');
      console.log(error);
    })
  }

  actualizarTarjeta(id: string){
    const TARJETA: any = {
      titular : this.form.value.titular,
      numeroTarjeta : this.form.value.numeroTarjeta,
      fechaExpiracion : this.form.value.fechaExpiracion,
      cvv : this.form.value.cvv,
      fechaActualizacion : new Date()
    }
    this.loading = true;

    this._tarjetaService.actualizarTarjeta(id, TARJETA).then(() =>{      
      this.loading = false;
      this.titulo = "Crear Tarjeta";
      this.form.reset();
      this.id = undefined;
      this.toastr.info('La tarjeta fue actualizada con éxito!', 'Tarjeta Actualizada');
    },error => {
      console.log(error);
    });


  }
}
