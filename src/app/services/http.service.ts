import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  imageUrl:string = "https://marqex.webapi.marqexmarine.com/Images/"
  // url:string = "https://localhost:7157/api/";
  url:string = "https://marqex.webapi.marqexmarine.com/api/"
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private swal: SwalService
  ){}

  getImageUrl(){
    return this.imageUrl;
  }

  get(api: string, callBack: (res:any) => void){
    this.http.get(`${this.url}${api}`, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    }).subscribe({
      next: (res: any) => {
        callBack(res);
      },
      error: (err: HttpErrorResponse) => {
        if (!err.error.isSuccess) {
          console.log(err.error.errorMessages);
        }
        else{
          console.log(err);
        }
      }
    });
  }
  
  post(api: string, body:any,callBack: (res:any)=> void) {
    this.http.post(`${this.url}${api}`,body, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    }).subscribe({
      next: (res: any) => {
        callBack(res);
        this.swal.callToast(res.data, 'success');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      let errorMessage = "Bir hata oluştu!";

      if (err.status === 400) {
        // 1. Durum: API'den gelen 'errors' objesi (Validasyon Hataları)
        if (err.error.errors) {
          const errors = err.error.errors;
          // Objeyi diziye çevirip ilk hatayı alıyoruz
          const firstKey = Object.keys(errors)[0];
          errorMessage = errors[firstKey][0];
        } 
        // 2. Durum: Senin daha önceki yapındaki 'errorMessages' dizisi
        else if (err.error.errorMessages) {
          errorMessage = err.error.errorMessages[0];
        }
        // 3. Durum: Direkt 'title' veya 'message' gelmesi
        else if (err.error.title) {
          errorMessage = err.error.title;
        }
      }

      this.swal.callToast(errorMessage, 'error');
      }
    });
  }
}
