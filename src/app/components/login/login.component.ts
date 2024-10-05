import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../services/swal.service';
import { Router } from '@angular/router';
import { EmailJsService } from '../../services/email-js.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  url:string = "https://marqex.webapi.marqexmarine.com/api/"
  loginModel: LoginModel = new LoginModel();
  showModal = false;
  emailModel: ForgotPasswordModel = new ForgotPasswordModel();

  constructor(
    private http: HttpClient,
    private swal: SwalService,
    private router: Router,
    private emailService: EmailJsService
  ) {

  }

  login(form: NgForm) {
    if (form.valid) {
      this.http.post(`${this.url}Auth/Login`, this.loginModel)
        .subscribe({
          next: (res: any) => {
            console.log(res.data);
            localStorage.setItem("token", res.data.token);
            this.swal.callToast(res.message);
            this.router.navigateByUrl("/");
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
            this.swal.callToast(err.error.errorMessages[0], 'warning');
          }
        });
    }
  }

  sendForgotMail(form:NgForm){
    if(form.valid){
      this.emailService.sendEmail(this.emailModel);
      this.showModal = false;
    }
  }
}

export class ForgotPasswordModel{
  email: string = "";
}