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
    .send('service_lndnj3h', 'template_403a0wr', form, {
      publicKey: '7wf-_6cx5Yq-L8nE1',
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
