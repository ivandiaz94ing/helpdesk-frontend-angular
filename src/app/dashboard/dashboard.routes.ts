import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./pages/user-dashboard/user-dashboard.component";
import { AdminTickets } from './pages/admin-tickets/admin-tickets';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';
import { AdminUsersComponent } from "./pages/admin-users/admin-users.component";

export const dashboardRoutes: Routes = [

  {
    path: 'app-user-dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'app-admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'tickets', //Esta es la ruta para la tabla de incidencias
        component: AdminTickets,
      },
      {
        path: 'usuarios',
        component: AdminUsersComponent,
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tickets',
      }
  ]
  },
  {
    path: 'ticket/:id', // Ruta para ver los detalles de un ticket específico
    component: TicketDetailComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app-user-dashboard'
  }
];

export default dashboardRoutes;
