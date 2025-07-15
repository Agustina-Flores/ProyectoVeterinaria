import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { TurnoService } from '../../services/turno/turno.service'; 
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Turno } from "../../model/turno.model";
import { Paciente } from '../../model/paciente.model';
import { Usuario } from '../../model/usuario.model';
import { PacienteService } from '../../services/paciente/paciente.service';
 

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
  turnoSeleccionado: Turno | null = null;
  formAddEdit: boolean = false;
  turnos: Turno[] = [];
  pacientes: Paciente[] = [];
  veterinarios: Usuario[] = []; 
  fechaInvalida: boolean = false;
  error = "";
  mensajeExito: string = '';

 constructor(
  public turnoService: TurnoService, 
  public auth: AuthService,
  public pacienteService : PacienteService,
  public usuarioService :UsuarioService,
  private router: Router) {}

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
      this.turnoService.obtenerTurnos().subscribe({
        next: (data) => {
        this.turnos = data;
        //console.log('Turnos actualizados:', this.turnos);
      },
      error: (err) => console.error('Error al obtener turnos:', err)
      });
    }

    crearNuevoTurno(): void { 
      const fechaActual = new Date();
      const fechaLocal = fechaActual.toISOString().slice(0, 16);
      this.turnoSeleccionado = {
      id: 0,
      fechaHora: fechaLocal,
      estado: '',
      notas: '',
      paciente: {
      id: null,
      nombre: ''
      },
      veterinario: {
        id: null,
        nombre: ''
      }
    };
    //console.log("turno a crear", this.turnoSeleccionado);

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
      paciente: {
        id:turno.paciente?.id ?? null,
        nombre:turno.paciente?.nombre ?? null,
      },
      veterinario: {
        id:turno.veterinario?.id ?? null,
        nombre:turno.veterinario?.nombre ?? null,
      },
      };
      this.formAddEdit = true;   
      //console.log("turno a editar" , this.turnoSeleccionado)   
    }

    eliminarTurno(id: number){
      if (confirm('¿Estás seguro de eliminar este turno?')) {
      this.turnoService.eliminarTurno(id).subscribe({
        next: (res) => {
          this.obtenerTurnos();
        },
        error: (err) => console.error('Error al eliminar turno:', err)
      });
    }
    } 

    agregarTurno(form: NgForm): void {

      if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
      }
      if (!this.turnoSeleccionado || !this.turnoSeleccionado.fechaHora) {
      console.error('Falta la fecha del turno');
      return;
      } 
      const ahora = new Date();
      const fechaIngresada = new Date(this.turnoSeleccionado.fechaHora);
      this.fechaInvalida = fechaIngresada <= ahora;

      if (this.fechaInvalida) {
        console.warn("Fecha inválida");
        return;
      }
      const fechaAjustada = new Date(fechaIngresada.getTime() - fechaIngresada.getTimezoneOffset() * 60000).toISOString();
      const turnoAEnviar = {
        fechaHora: fechaAjustada,
        estado: this.turnoSeleccionado.estado,
        notas: this.turnoSeleccionado.notas,
        pacienteId: this.turnoSeleccionado.paciente?.id ?? 0,
        veterinarioId: this.turnoSeleccionado.veterinario?.id ?? 0
      };

      //console.log('Turno que se va a enviar:', turnoAEnviar);  

      this.turnoService.agregarTurnos(turnoAEnviar).subscribe({
        next: res => {
          //console.log('Turno registrado:', res);
          this.mensajeExito = 'Turno registrado correctamente.'; 
            setTimeout(() => {
            this.turnoSeleccionado = null;
            this.mensajeExito = '';
          }, 1500);
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

    validarFechaSeleccionada(): boolean {
       if (!this.turnoSeleccionado) return false;

      const ahora = new Date();
      const fecha = new Date(this.turnoSeleccionado.fechaHora);
      this.fechaInvalida = fecha <= ahora;
      return !this.fechaInvalida;
    }

    guardarTurno(form: NgForm) {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        return;
      }

      if (!this.turnoSeleccionado) return;

      const ahora = new Date();
      const fechaIngresada = new Date(this.turnoSeleccionado.fechaHora);
      this.fechaInvalida = fechaIngresada <= ahora;

      if (this.fechaInvalida) {
        console.warn('Fecha inválida: debe ser posterior al momento actual');
        return;
      }

      const fechaAjustada = new Date(
        fechaIngresada.getTime() - fechaIngresada.getTimezoneOffset() * 60000
      ).toISOString();

      if (!this.turnoSeleccionado || !this.turnoSeleccionado.id) return;
      
      const turnoAEnviar = {
      id: this.turnoSeleccionado.id,
      fechaHora: fechaAjustada,
      estado: this.capitalizar(this.turnoSeleccionado.estado),
      notas: this.turnoSeleccionado.notas,
      pacienteId:this.turnoSeleccionado.paciente?.id ?? null, 
      veterinarioId: this.turnoSeleccionado.veterinario?.id ?? null, 
    };

      //console.log('Turno a enviar al backend:', turnoAEnviar);
      this.turnoService.editarTurno(turnoAEnviar.id, turnoAEnviar).subscribe({
      next: (res) => {
        //console.log('Turno actualizado:', res);
         this.mensajeExito = 'Turno actualizado correctamente.'; 
          setTimeout(() => {
          this.turnoSeleccionado = null;
          this.mensajeExito = '';
        }, 1500);
        this.obtenerTurnos();  
      },
      error: (err) => console.error('Error al editar turno:', err)
      });
    }

    capitalizar(texto: string): string {
      return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    obtenerPacientes(): void {
    this.pacienteService.obtenerPacientes().subscribe({
      next: (res) => {
        this.pacientes = res;
        //console.log("Pacientes cargados:", this.pacientes);
      },
      error: (err) => console.error("Error al obtener pacientes:", err)
    });
    }

    obtenerVeterinarios(): void {
      this.usuarioService.obtenerVeterinarios().subscribe({
        next: (res) => {
          this.veterinarios = res;
          //console.log("Veterinarios cargados:", this.veterinarios);
        },
        error: (err) => console.error("Error al obtener veterinarios:", err)
      });
    }
    cancelarEdicion() { 
      this.turnoSeleccionado = null;
       this.formAddEdit = false;
      
    }
}
