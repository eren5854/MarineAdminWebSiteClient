import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class EmailJsService {

  constructor(
    private swal: SwalService
  ) { }
  sendEmail(form: any) {
    return emailjs
    .send('service_ap2rdj4', 'template_pmi5ynu', form, {
      publicKey: 'w6mRiXwXx8zcAn-EZ',
    })
    .then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        this.swal.callToast("Mail gönderildi", 'success');
      },
      (err) => {
        console.log('FAILED...', err.text);
        this.swal.callToast(err.text, 'error');
      },
    );
  }
}
