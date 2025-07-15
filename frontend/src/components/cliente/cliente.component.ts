import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ClienteService } from '../../services/cliente/cliente.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { PacienteService } from '../../services/paciente/paciente.service';
import { NgForm } from '@angular/forms';
import { Cliente } from '../../model/cliente.model';
import { Paciente } from '../../model/paciente.model';

@Component({
  selector: 'app-cliente',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent {
isAdmin = false;
isRecepcionista = false;
isVeterinario= false;
isLoggedIn= false;
role = "";
clientes: Cliente[] = [];
clienteSeleccionado: Cliente | null = null;
pacienteSeleccionado: Paciente | null = null;
formAddEdit: boolean = false;
pacientesDelCliente: Paciente[] = [];
clienteIdSeleccionado: number | null = null;
clienteParaPaciente: Cliente | null = null;
mensajeExitoPaciente: string = '';
mensajeExitoCliente: string = '';

 constructor(public clienteService: ClienteService, 
  public pacienteService: PacienteService,
  public usuarioService:UsuarioService,
  public auth: AuthService,
  private router: Router) {}

  ngOnInit(): void {
    
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/login']);
        return;
      }
      this.isLoggedIn = this.auth.isLoggedIn();
      this.role = this.auth.getUserRole() || '';
      this.isAdmin = this.role === 'Admin';
      this.isRecepcionista = this.role === 'Recepcionista';
      this.isVeterinario = this.role === 'Veterinario';

      if (this.isAdmin || this.isRecepcionista ||this.isVeterinario) { 
          this.obtenerClientes();
      }  
    } 

    obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al obtener clientes:', err)
    });
    }

    crearNuevoCliente(): void {
      this.clienteSeleccionado = { nombre: '', email: '', telefono: '' } as Cliente;
      //console.log("Creando cliente nuevo " , this.clienteSeleccionado)
      this.formAddEdit = false;
    } 

    agregarCliente(form:NgForm): void {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        return;
      }

      if (!this.clienteSeleccionado) return;
      const nuevoCliente = this.clienteSeleccionado;

      this.clienteService.agregarClientes(nuevoCliente.nombre, nuevoCliente.email, nuevoCliente.telefono).subscribe({
        next: (res) => {
          //console.log('Cliente registrado:', res);  
          this.mensajeExitoCliente = 'Cliente registrado correctamente.'; 
          setTimeout(() => {
            this.clienteSeleccionado = null;
            this.mensajeExitoCliente = '';
          }, 1500);
          this.obtenerClientes();  
          this.clienteSeleccionado = null; 
          this.formAddEdit = false;
        },
        error: (err) => console.error('Error al agregar el cliente:', err)
      });
    } 

    editarCliente(cliente: any) {
      this.clienteSeleccionado = { ...cliente }; 
      this.formAddEdit = true;
      //console.log("cliente a editar" , this.clienteSeleccionado);
    } 
   
    eliminarCliente(id: number){
      if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: (res) => {
          this.obtenerClientes();
        },
        error: (err) => console.error('Error al eliminar cliente:', err)
      });
      }
    }

    editarPaciente(paciente: any) {
      this.pacienteSeleccionado = { ...paciente }; 
      this.formAddEdit = true;
      //console.log("paciente a editar" , this.pacienteSeleccionado);
    } 

    eliminarPaciente(paciente: any) {
      if (confirm('¿Estás seguro de eliminar este paciente?')) {
        this.pacienteService.eliminarPaciente(paciente.id).subscribe({
          next: (res) => {
            //console.log("Paciente eliminado", res);
            this.pacienteSeleccionado = res;
            this.verPacientesDeUnCliente({ id: this.clienteIdSeleccionado }); 
            this.pacienteSeleccionado = null; 
          },
          error: (err) => console.error('Error al eliminar cliente:', err)
        });
      }
    }

    guardarPaciente(form:NgForm) {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        return;
      }
  
      if(!this.pacienteSeleccionado) return;

      this.pacienteService.editarPaciente(this.pacienteSeleccionado.id, this.pacienteSeleccionado).subscribe({
      next: (res) => { 
        //console.log('Paciente actualizado:', res);
        this.mensajeExitoPaciente = 'Paciente actualizado correctamente.'; 
        if (this.clienteParaPaciente?.id) {
        this.verPacientesDeUnCliente(this.clienteParaPaciente);
        } else {
          console.warn('No hay cliente seleccionado para refrescar mascotas');
        }
          setTimeout(() => {
          this.pacienteSeleccionado = null;
          this.mensajeExitoPaciente = '';
        }, 1500);
      },
      error: (err) => console.error('Error al editar cliente:', err)
      });
    }

    agregarPaciente(form:NgForm): void {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        return;
      }
      if (!this.pacienteSeleccionado || !this.clienteIdSeleccionado) return;

      const nuevoPaciente = {
        ...this.pacienteSeleccionado,
        clienteId: this.clienteIdSeleccionado 
      };

      this.pacienteService.agregarPacientes(nuevoPaciente).subscribe({
        next: (res) => {
          //console.log('Paciente registrado:', res);  
          this.verPacientesDeUnCliente({ id: this.clienteIdSeleccionado });  
          this.mensajeExitoPaciente = 'Paciente registrado correctamente.'; 
            setTimeout(() => {
            this.pacienteSeleccionado = null;
            this.mensajeExitoPaciente = '';
          }, 1500); 
          this.pacienteSeleccionado = null; 
          this.formAddEdit = false;
        },
        error: (err) => console.error('Error al agregar el paciente:', err)
      });
    } 

    guardarCliente(form:NgForm) {     
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        return;
      }

      if (!this.clienteSeleccionado) return;

      this.clienteService.editarCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
      next: (res) => {
        console.log('Cliente actualizado:', res);
         this.mensajeExitoCliente = 'Cliente actualizado correctamente.'; 
          setTimeout(() => {
          this.clienteSeleccionado = null;
          this.mensajeExitoCliente = '';
        }, 1500);
        this.obtenerClientes();  
        this.clienteSeleccionado = null;
      },
      error: (err) => console.error('Error al editar cliente:', err)
      });
    }

    toggleMascotas(cliente: any) {
      if (this.clienteIdSeleccionado === cliente.id) {
        // Ya estaba abierto → lo cerrás
        this.clienteIdSeleccionado = null;
        this.pacientesDelCliente = [];
        this.pacienteSeleccionado = null;
      } else {
        // Se va a mostrar ese cliente → guarda el ID en:
        this.verPacientesDeUnCliente(cliente);
      }
    }

    verPacientesDeUnCliente(cliente: any) {
      this.clienteIdSeleccionado = cliente.id;// se guarda
      this.clienteParaPaciente = cliente;
      this.pacienteService.getPacientesPorCliente(cliente.id).subscribe({
        next: (pacientes) =>  {
        this.pacientesDelCliente = pacientes;
        },
        error: (err) => console.error('Error cargando pacientes', err)
      });
    }

    crearNuevoPaciente(): void {
      if (!this.clienteParaPaciente) return;
      this.pacienteSeleccionado = { nombre: '', edad: '', raza: '', especie: '',clienteId: this.clienteParaPaciente.id } as Paciente;
      //console.log("Creando paciente nuevo " , this.clienteSeleccionado)
      this.formAddEdit = false;
    }
    
    verHistorial(pacienteId: number): void {
      this.router.navigate(['/historial', pacienteId]);
    }

    cancelarEdicion() {
      this.pacienteSeleccionado = null;
      this.clienteSeleccionado = null;
      this.formAddEdit = false;
    }

    logout(): void {
      this.auth.logout();
      this.router.navigate(['/login']); 
    }
}
