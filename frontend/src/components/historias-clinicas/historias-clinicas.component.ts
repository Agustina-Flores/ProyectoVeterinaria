import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service'; 
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-historias-clinicas',
  imports: [CommonModule,FormsModule],
  templateUrl: './historias-clinicas.component.html',
  standalone:true,
  styleUrl: './historias-clinicas.component.scss'
})
export class HistoriasClinicasComponent {
  isAdmin = false;
  isRecepcionista = false;
  isVeterinario = false;
  pacienteId!: number;
  historialClinico: any[] = []; 
  historialClinicoSeleccionado: any = null;  
  pacientes: any[] = [];
  paciente: any;
  constructor(public auth: AuthService,private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
      console.log("paciente id" , this.pacienteId);
      this.isAdmin = true;
      this.isRecepcionista = true;
      this.isVeterinario = true;
      this.obtenerHistorial();
      this.obtenerPaciente();
    } 

    obtenerHistorial(): void {
      this.auth.getHistorialPorPaciente(this.pacienteId).subscribe({ 
        next: (res) => {
        this.historialClinico = res;
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
      }
    });}

    crearNuevoHistorial(): void {

      const fechaActual = new Date();
      const fechaLocal = fechaActual.toISOString().slice(0, 16);
      this.historialClinicoSeleccionado = {
      fecha: fechaLocal,
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      pacienteId: this.pacienteId 
    };
    console.log("historial clinico a crear", this.historialClinicoSeleccionado);
    }
    agregarHistorial(): void {
      if (!this.historialClinicoSeleccionado || !this.historialClinicoSeleccionado.fecha) {
    console.error('Falta la fecha');
    return;
    }

    const historialClinico = {
      ...this.historialClinicoSeleccionado,
      pacienteId: +this.historialClinicoSeleccionado.pacienteId  
    };

    console.log('Historial clinico que se va a enviar:', historialClinico);

    this.auth.agregarHistorial(historialClinico).subscribe({
    next: res => {
      console.log('Historial clinico registrado:', res);
      this.obtenerHistorial();
      this.historialClinicoSeleccionado = null; 
    },
    error: err => {
      console.error('Error al agregar el historial clinico:', err);
      if (err.error?.errors) {
        console.log('Errores de validación:', err.error.errors);
      }
    }
  });
    } 

      obtenerPaciente(): void {
      this.auth.getPacientesPorCliente(this.pacienteId).subscribe(res => {
        this.paciente = res;
      });
    }
    cancelarEdicion() {
      this.historialClinicoSeleccionado = null;}
}