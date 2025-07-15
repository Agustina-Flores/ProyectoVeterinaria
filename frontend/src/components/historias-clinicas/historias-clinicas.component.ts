import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HistorialService } from '../../services/historial/historial.service';
import { AuthService } from '../../services/auth/auth.service';
import { ClienteService } from '../../services/cliente/cliente.service';
import { PacienteService } from '../../services/paciente/paciente.service';  
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HistoriaClinica } from '../../model/historiaClinicas.model';
import { Paciente } from '../../model/paciente.model';

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
  historialClinico: HistoriaClinica[] = []; 
  nuevoHistorial: HistoriaClinica | null = null;  
  nombrePaciente :string = "";
  minFecha: string = new Date().toISOString().slice(0, 16);
  fechaInvalida: boolean = false;
  mensajeExito: string = '';

  constructor(public historialService: HistorialService,
    private route: ActivatedRoute,
    public auth:AuthService,
    public clienteService :ClienteService) {}

    ngOnInit(): void {
      this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
      if (! this.pacienteId) return;
      
      this.role = this.auth.getUserRole() || '';
      this.isAdmin = this.role === 'Admin';
      this.isRecepcionista = this.role === 'Recepcionista';
      this.isVeterinario = this.role === 'Veterinario';

      this.obtenerHistorial();
    } 

    obtenerHistorial(): void {
      this.historialService.getHistorialPorPaciente(this.pacienteId).subscribe({ 
        next: (res) => {
        this.historialClinico = res;
        //console.log("historial" , this.historialClinico)
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
      id:0,
      fecha: fechaLocal,
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      pacienteId: this.pacienteId 
    };
    //console.log("historial clinico a crear", this.nuevoHistorial);
    }
    
    agregarHistorial(form:NgForm): void { 
        if (form.invalid || !this.nuevoHistorial?.fecha) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        return;
        }
        
          const ahora = new Date();
          const fechaIngresada = new Date(this.nuevoHistorial.fecha);
          
          if (fechaIngresada <= ahora) {
          this.fechaInvalida = true;
          return;
          }
        
        this.fechaInvalida = false;
        const fechaObj = new Date(this.nuevoHistorial.fecha);
        const fechaAjustada = new Date(fechaObj.getTime() - fechaObj.getTimezoneOffset() * 60000).toISOString();   

        const historialClinico = {
          ...this.nuevoHistorial,
          pacienteId: +this.nuevoHistorial.pacienteId  ,
          fecha:fechaAjustada
        };

        this.historialService.agregarHistorial(historialClinico).subscribe({
        next: res => {
            //console.log('Historial clinico registrado:', res);
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

    cancelarEdicion() {
      this.nuevoHistorial = null;}
}