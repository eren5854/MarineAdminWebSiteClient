import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: UserModel = new UserModel();
  token: string = "";
  fullName: string = "";

  constructor(private router: Router) { }

  isAuthenticated(){
    const responseString: string | null = localStorage.getItem("token");
    if (responseString != null) {
      try{
        this.token = responseString;
        const decode: JwtPayload | any = jwtDecode(this.token);
        const now: number = new Date().getTime()/1000;
        const exp: number | undefined = decode.exp;

        if (exp == undefined) {
          this.router.navigateByUrl("/login");
          return false;
        }

        if (exp < now) {
          this.router.navigateByUrl("/login");
          return false;
        }
        
        this.user.id = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"][0];
        this.user.fullName = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"][1];
        this.user.email = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"][2];
        this.user.userName = decode["UserName"];
        return true;
      }catch(error){
        console.warn(error);
        this.router.navigateByUrl("/login");
        return false;
      }
    }
    else{
      this.router.navigateByUrl("/login");
      return false;
    }
  }
}
