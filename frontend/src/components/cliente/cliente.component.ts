import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-cliente',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {
isAdmin = false;
isRecepcionista = false;
isVeterinario= false;
isLoggedIn= false;
role = "";
clientes: any[] = [];
clienteSeleccionado: any = null;  
pacienteSeleccionado: any = null; 
formAddEdit: boolean = false;
cliente: any[] = [];
pacientesDelCliente: any[] = [];
clienteIdSeleccionado: number | null = null;
clienteParaPaciente: any = null;

 constructor(public auth: AuthService, private router: Router) {}

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
    this.auth.obtenerClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al obtener clientes:', err)
    });
    }

    crearNuevoCliente(): void {
      console.log("Creando antes cliente nuevo " , this.clienteSeleccionado)
      this.clienteSeleccionado = { nombre: '', email: '', telefono: '' };
      console.log("Creando cliente nuevo " , this.clienteSeleccionado)
      this.formAddEdit = false;
    }
   

    agregarCliente(): void {
    if (!this.clienteSeleccionado) return;
    const nuevoCliente = this.clienteSeleccionado;

    this.auth.agregarClientes(nuevoCliente.nombre, nuevoCliente.email, nuevoCliente.telefono).subscribe({
      next: (res) => {
        console.log('Cliente registrado:', res);  
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
      console.log("cliente a editar" , this.clienteSeleccionado);
    } 
   
    eliminarCliente(id: number){
      if (confirm('¿Estás segura de que querés eliminar este cliente?')) {
      this.auth.eliminarCliente(id).subscribe({
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
      console.log("mascota a editar" , this.pacienteSeleccionado);
    } 
    eliminarPaciente(paciente: any) {
    if (confirm('¿Estás segura de que querés eliminar este paciente?')) {
      console.log("paciente a eliminar" , paciente);
      this.auth.eliminarPaciente(paciente.id).subscribe({
        next: (res) => {
          console.log("Paciente eliminado", res);
          this.pacienteSeleccionado = res;
          this.verPacientes({ id: this.clienteIdSeleccionado }); 
          this.pacienteSeleccionado = null; 
        },
        error: (err) => console.error('Error al eliminar cliente:', err)
      });
    }
    }
    guardarPaciente() {
      console.log('Datos a enviar:', this.pacienteSeleccionado); 
      this.auth.editarPaciente(this.pacienteSeleccionado.id, this.pacienteSeleccionado).subscribe({
      next: (res) => {
        console.log('Cliente actualizado:', res);
        this.pacienteSeleccionado = res;
        this.verPacientes(this.pacienteSeleccionado);  
        console.log('Cer PacientesCliente actualizado:', this.pacienteSeleccionado);
        this.pacienteSeleccionado = null;
      },
      error: (err) => console.error('Error al editar cliente:', err)
      });
    }

    agregarPaciente(): void {
    if (!this.pacienteSeleccionado || !this.clienteIdSeleccionado) return;

    const nuevoPaciente = {
      ...this.pacienteSeleccionado,
      clienteId: this.clienteIdSeleccionado 
    };

    this.auth.agregarPacientes(nuevoPaciente).subscribe({
      next: (res) => {
        console.log('Paciente registrado:', res);  
        this.verPacientes({ id: this.clienteIdSeleccionado });  
        console.log('Paciente registrado nuevo:', nuevoPaciente);  
        this.pacienteSeleccionado = null; 
        this.formAddEdit = false;
      },
      error: (err) => console.error('Error al agregar el paciente:', err)
    });
    } 
    guardarCliente() {
      console.log('Datos a enviar:', this.clienteSeleccionado); 
      this.auth.editarCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
      next: (res) => {
        console.log('Cliente actualizado:', res);
        this.obtenerClientes();  
        this.clienteSeleccionado = null;
      },
      error: (err) => console.error('Error al editar cliente:', err)
      });
    }

    verPacientes(cliente: any) {
    this.clienteIdSeleccionado = cliente.id;
    this.clienteParaPaciente = cliente;
    this.auth.getPacientesPorCliente(cliente.id).subscribe({
      next: (pacientes) =>  {
      console.log("pacientes de clientes" ,pacientes);
      this.pacientesDelCliente = pacientes;
      console.log("Mascotas" ,cliente);
      },
      error: (err) => console.error('Error cargando pacientes', err)
    });
    }
    crearNuevoPaciente(): void {
      if (!this.clienteParaPaciente) return;
      console.log("Creando antes paciente nuevo " , this.pacienteSeleccionado)
      this.pacienteSeleccionado = { nombre: '', edad: '', raza: '', especie: '',clienteId: this.clienteParaPaciente.id };
      console.log("Creando paciente nuevo " , this.clienteSeleccionado)
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
