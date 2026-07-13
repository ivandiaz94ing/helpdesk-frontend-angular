import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./pages/user-dashboard/user-dashboard.component";

export const dashboardRoutes: Routes = [
  {
    path: 'app-user-dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'app-admin-dashboard',
    component: AdminDashboardComponent,
  }
];

export default dashboardRoutes;
