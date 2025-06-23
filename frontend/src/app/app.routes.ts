import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { HomeComponent } from '../components/home/home.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ClienteComponent } from '../components/cliente/cliente.component';
import { TurnoComponent } from '../components/turno/turno.component';
import { HistoriasClinicasComponent } from '../components/historias-clinicas/historias-clinicas.component';
     
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clientes', component: ClienteComponent },
  { path: 'turnos', component: TurnoComponent },
  { path: 'historial/:id', component: HistoriasClinicasComponent }
];