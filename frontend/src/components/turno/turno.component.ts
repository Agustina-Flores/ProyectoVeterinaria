import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Turno } from "../../model/turno.model"
@Component({
  selector: 'app-turno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.scss'] 
})


export class TurnoComponent {
  isAdmin = false;
  isRecepcionista = false;
  isVeterinario = false;
  role = "";
  turnoSeleccionado: any = null; 
  formAddEdit: boolean = false;
  turnos: Turno[] = [];
  pacientes: any[] = [];
  veterinarios: any[] = [];
 constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
  if (!this.auth.isLoggedIn()) {
    this.router.navigate(['/login']);
    return;
  }

  this.role = this.auth.getUserRole() || '';
  this.isAdmin = this.role === 'Admin';
  this.isRecepcionista = this.role === 'Recepcionista';
  this.isVeterinario = this.role === 'Veterinario';

  if (this.isAdmin || this.isRecepcionista || this.isVeterinario) {
    this.obtenerTurnos();
  }

  this.obtenerPacientes();
  this.obtenerVeterinarios();
  
}
    obtenerTurnos(): void {
      this.auth.obtenerTurnos().subscribe({
        next: (data) => {
        this.turnos = data;
        console.log('Turnos actualizados:', this.turnos);
      },
      error: (err) => console.error('Error al obtener turnos:', err)
      });
    }
    crearNuevoTurno(): void { 

      const fechaActual = new Date();
      const fechaLocal = fechaActual.toISOString().slice(0, 16);
      this.turnoSeleccionado = {
      fechaHora: fechaLocal,
      estado: '',
      notas: '',
      pacienteId: null,
      veterinarioId: null
    };
    console.log("turno a crear", this.turnoSeleccionado);

    this.formAddEdit = false;
    this.obtenerPacientes();
    this.obtenerVeterinarios();
  }

    editarTurno(turno: any): void {
      this.obtenerPacientes();
      this.obtenerVeterinarios();  
      const fechaLocal = turno.fechaHora?.slice(0, 16); //elimina la Z
      this.turnoSeleccionado = {
      id: turno.id,
      fechaHora: fechaLocal,
      estado: turno.estado, 
      notas: turno.notas, 
      pacienteId: turno.paciente?.id, 
      veterinarioId:turno.veterinario?.id }; 
      this.formAddEdit = true;   
      console.log("turno" , this.turnoSeleccionado)   
    }
    eliminarTurno(id: number){
      if (confirm('¿Estás segura de que querés eliminar este turno?')) {
      this.auth.eliminarTurno(id).subscribe({
        next: (res) => {
          this.obtenerTurnos();
        },
        error: (err) => console.error('Error al eliminar turno:', err)
      });
    }
    } 
    agregarTurno(): void {
      if (!this.turnoSeleccionado || !this.turnoSeleccionado.fechaHora) {
    console.error('Falta la fecha del turno');
    return;
    }

    const turnoAEnviar = {
      ...this.turnoSeleccionado,
    };

    console.log('Turno que se va a enviar:', turnoAEnviar); // <-- útil para revisar

    this.auth.agregarTurnos(turnoAEnviar).subscribe({
      next: res => {
        console.log('Turno registrado:', res);
        this.obtenerTurnos();
        this.turnoSeleccionado = null;
        this.formAddEdit = false;
      },
      error: err => {
        console.error('Error al agregar el turno:', err);
        if (err.error?.errors) {
          console.log('Errores de validación:', err.error.errors);
        }
      }
  });
    }
    guardarTurno() {
      if (!this.turnoSeleccionado || !this.turnoSeleccionado.id) return;
      console.log('Datos a enviar:', this.turnoSeleccionado); 

      const turnoAEnviar = {
      id: this.turnoSeleccionado.id,
      fechaHora: this.turnoSeleccionado.fechaHora,
      estado: this.turnoSeleccionado.estado,
      notas: this.turnoSeleccionado.notas,
      pacienteId: this.turnoSeleccionado.pacienteId,
      veterinarioId: this.turnoSeleccionado.veterinarioId
    };
     console.log('Turno a enviar al backend:', turnoAEnviar);
      this.auth.editarTurno(turnoAEnviar.id, turnoAEnviar).subscribe({
      next: (res) => {
        console.log('Turno actualizado:', res);
        this.obtenerTurnos();  
        this.turnoSeleccionado = null;
      },
      error: (err) => console.error('Error al editar turno:', err)
      });
    }

    obtenerPacientes(): void {
    this.auth.obtenerPacientes().subscribe({
      next: (res) => {
        this.pacientes = res;
        console.log("Pacientes cargados:", this.pacientes);
      },
      error: (err) => console.error("Error al obtener pacientes:", err)
    });
    }

    obtenerVeterinarios(): void {
      this.auth.obtenerUsuarios().subscribe({
        next: (res) => {
        this.veterinarios = res.filter((usuario: any) => usuario.rol === 'Veterinario');
        console.log("Veterinarios cargados:", this.veterinarios);
        },
        error: (err) => console.error("Error al obtener veterinarios:", err)
      });
    }

    cancelarEdicion() { 
      this.turnoSeleccionado = null;
       this.formAddEdit = false;
      
    }
}
