import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
})
export class Login {
  private router = inject(Router);

  onLogin(){
    this.router.navigate(['/dashboard/app-user-dashboard']);

  }

}
