import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { ChangePasswordModel } from '../../models/change-password.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  userModel: UserModel = new UserModel();
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();

  isShowPassword: boolean = false;
  isPasswordFocus :boolean = false;

  constructor(
    private http: HttpService,
    public auth: AuthService
  ){
    this.getAllUser(auth.user.id);
  }

  getAllUser(id:any){
    this.http.get(`Users/GetById?Id=${id}`, (res) => {
      this.userModel = res.data;
      console.log(this.userModel);
      
    })
  }

  updateUser(form:NgForm){
    if(form.valid){
      this.http.post("Users/Update", this.userModel, (res) => {
        console.log(res);
        this.getAllUser(this.userModel.id);
      })
    }
  }

  changePassword(form:NgForm){
    this.changePasswordModel.id = this.userModel.id!;
    if (form.valid) {
      this.http.post("Auth/ChangePassword", this.changePasswordModel, (res) => {
        console.log(res);
      })
    }
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
