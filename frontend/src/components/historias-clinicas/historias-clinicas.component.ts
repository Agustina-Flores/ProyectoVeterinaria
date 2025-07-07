import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HistorialService } from '../../services/historial/historial.service';
import { AuthService } from '../../services/auth/auth.service';
import { ClienteService } from '../../services/cliente/cliente.service';
import { PacienteService } from '../../services/paciente/paciente.service';  
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

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
  role = "";
  pacienteId!: number;
  historialClinico: any[] = []; 
  nuevoHistorial: any = null;  
  pacientes: any[] = [];
  paciente: any;
  nombrePaciente :string = "";
  minFecha: string = new Date().toISOString().slice(0, 16);
  fechaInvalida: boolean = false;
  mensajeExito: string = '';

  constructor(public historialService: HistorialService,
    private route: ActivatedRoute,
    public auth:AuthService,
    public clienteService :ClienteService,
    public pacienteService: PacienteService) {}

    ngOnInit(): void {
      this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
      console.log("paciente id" , this.pacienteId);
      
      this.role = this.auth.getUserRole() || '';
      this.isAdmin = this.role === 'Admin';
      this.isRecepcionista = this.role === 'Recepcionista';
      this.isVeterinario = this.role === 'Veterinario';


      this.obtenerHistorial();
      this.obtenerPaciente();
    } 

    obtenerHistorial(): void {
      this.historialService.getHistorialPorPaciente(this.pacienteId).subscribe({ 
        next: (res) => {
        this.historialClinico = res;
        console.log("historial" , this.historialClinico)
        if (this.historialClinico.length > 0 && this.historialClinico[0].paciente) {
        this.nombrePaciente = this.historialClinico[0].paciente.nombre;
        }
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
      }
    });}

    crearNuevoHistorial(): void {

      const fechaActual = new Date();
      const fechaLocal = fechaActual.toISOString().slice(0, 16);
      this.nuevoHistorial = {
      fecha: fechaLocal,
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      pacienteId: this.pacienteId 
    };
    console.log("historial clinico a crear", this.nuevoHistorial);
    }
    
    agregarHistorial(form:NgForm): void { 

      if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
      }

      console.log('Formulario válido:', this.nuevoHistorial);

      if (!this.nuevoHistorial || !this.nuevoHistorial.fecha) {
      console.error('Falta la fecha');
      return;
      }
 
        const ahora = new Date();
        const fechaIngresada = new Date(this.nuevoHistorial.fecha);
        this.fechaInvalida = fechaIngresada <= ahora;

      if (this.fechaInvalida) {
          console.warn("Fecha inválida");
          return;
        }
      
      const fechaObj = new Date(this.nuevoHistorial.fecha);
      const fechaAjustada = new Date(fechaObj.getTime() - fechaObj.getTimezoneOffset() * 60000).toISOString();
      
      const historialClinico = {
        ...this.nuevoHistorial,
        pacienteId: +this.nuevoHistorial.pacienteId  ,
        fecha:fechaAjustada
      };

      console.log('Historial clinico que se va a enviar:', historialClinico);

      this.historialService.agregarHistorial(historialClinico).subscribe({
      next: res => {
          console.log('Historial clinico registrado:', res);
          this.mensajeExito = 'Historial clinico registrado correctamente.'; 
          setTimeout(() => {
          this.crearNuevoHistorial();
          this.mensajeExito = '';
        }, 1500);
        this.obtenerHistorial();
        this.nuevoHistorial = null; 
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
      this.pacienteService.getPacientesPorCliente(this.pacienteId).subscribe(res => {
        this.paciente = res;
        console.log("paciente", this.paciente);
      });
    }
    cancelarEdicion() {
      this.nuevoHistorial = null;}
}