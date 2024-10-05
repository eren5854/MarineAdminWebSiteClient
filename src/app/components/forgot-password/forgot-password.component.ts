import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm} from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = "";
  token: string = "";
  newPassword:string = "";

  isShowPassword: boolean = false;
  isPasswordFocus :boolean = false;

  constructor(
    private http: HttpService,
    private activated: ActivatedRoute,
    private router: Router
  ){
    this.activated.params.subscribe((res:any) => {
      this.email = res.email;
      console.log(this.email);
      this.forgotPasswordToken();
    });
  }

  forgotPasswordToken(){
    this.http.post("Auth/ForgotPassword", {email: this.email}, (res) => {
      this.token = res.data;
      console.log(this.token);
      
    });
  }

  changePasswordUsingToken(form:NgForm){
    this.http.post("Auth/ChangePasswordUsingToken",
      {
        email: this.email,
        newPassword: this.newPassword,
        token: this.token
      }, (res) => {
        console.log(res);
        this.router.navigateByUrl("/")
      })
  }

  showOrHidePassword(password: HTMLInputElement){
    if(this.isShowPassword){
      this.isShowPassword = false;
      password.type = "password";
    }
    else{
      this.isShowPassword = true;
      password.type = "text";
    }
  }
  
  checkRegexPatternForPassword(el: HTMLInputElement){
    const text = el.value;

    const upperCaseRegex = /[A-Z]/;
    const upperCaseResult = upperCaseRegex.test(text);
    const upperLetterEl = document.getElementById("upperLetter");
    upperLetterEl?.classList.add(upperCaseResult ? 'pw-succes' : 'pw-error');
    upperLetterEl?.classList.remove(!upperCaseResult ? 'pw-succes' : 'pw-error');

    const lowerCaseRegex = /[a-z]/;
    const lowerCaseResult = lowerCaseRegex.test(text);
    const lowerLetterEl = document.getElementById("lowerLetter");
    lowerLetterEl?.classList.add(lowerCaseResult ? 'pw-succes' : 'pw-error');
    lowerLetterEl?.classList.remove(!lowerCaseResult ? 'pw-succes' : 'pw-error');

    const specialCaseRegex = /[!@#$%^&*()_+\[\]{};:'\\|,.<>\/?]/;
    const specialCaseResult = specialCaseRegex.test(text);
    const specialLetterEl = document.getElementById("specialLetter");
    specialLetterEl?.classList.add(specialCaseResult ? 'pw-succes' : 'pw-error');
    specialLetterEl?.classList.remove(!specialCaseResult ? 'pw-succes' : 'pw-error');

    const numCaseRegex = /[0-9]/;
    const numCaseResult = numCaseRegex.test(text);
    const numLetterEl = document.getElementById("numLetter");
    numLetterEl?.classList.add(numCaseResult ? 'pw-succes' : 'pw-error');
    numLetterEl?.classList.remove(!numCaseResult ? 'pw-succes' : 'pw-error');

    const minCharacterEl = document.getElementById("minCharacter");
    if(text.length < 8){
      minCharacterEl?.classList.add("pw-error");
      minCharacterEl?.classList.remove("pw-succes");
    }
    else{
      minCharacterEl?.classList.add("pw-succes");
      minCharacterEl?.classList.remove("pw-error");
    }
  }
}
