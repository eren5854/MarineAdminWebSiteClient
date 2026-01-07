import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CertificateModel } from '../../models/certificate.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css'
})
export class CertificateComponent {
    certificateModel: CertificateModel = new CertificateModel();
    certificates: CertificateModel[] = [];
  
    imageSrc: string | ArrayBuffer | null = null;
    @ViewChild('fileInput') fileInput!: ElementRef;
  
    addCardDiv = false;
  
    imageUrl?: string;
    selectedImageUrl: string | null = null;
  
    constructor(
      private http: HttpService,
      private swal: SwalService
    ) {
      this.imageUrl = this.http.getImageUrl();
      this.getAllCertificate();
    }
  
    getAllCertificate() {
      this.http.get("Certificates/GetAll", (res) => {
        this.certificates = res.data;
      })
    }
  
    createCertificate(form: NgForm) {
      const formData: FormData = new FormData();
      formData.append("title", this.certificateModel.title);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      if (this.certificateModel.issuer != null)
        formData.append("issuer", this.certificateModel.issuer);
      formData.append("date", this.certificateModel.date);
      this.http.post("Certificates/Create", formData, (res) => {
        this.certificateModel = new CertificateModel();
        this.imageSrc = "";
        this.addCardDiv = !this.addCardDiv;
        this.getAllCertificate();
      })
    }
  
    updateCertificate(form: NgForm, certificate: CertificateModel) {
      const formData: FormData = new FormData();
      formData.append("id", certificate.id);
      formData.append("title", certificate.title);
      const file = this.fileInput.nativeElement.files[0];
      if (file) {
        formData.append("image", file);
      }
      if (certificate.issuer != null)
        formData.append("issuer", certificate.issuer);
      formData.append("date", certificate.date);
      this.http.post("Certificates/Update", formData, (res) => {
        this.fileInput.nativeElement.value = "";
        this.getAllCertificate();
      })
    }
  
    deleteCertificate(id:string){
      this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
        this.http.get(`Certificates/DeleteById?Id=${id}`, (res) => {
          console.log(res);
          this.getAllCertificate();
        });
      });
    }
  
    setImage(event: any, certificateImage: CertificateModel) {
      const file = event.target.files[0];
      if (file) {
        certificateImage.image = file.name;
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          certificateImage.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
  
    triggerFileInput() {
      this.fileInput.nativeElement.click();
    }
  
    addCard() {
      this.addCardDiv = !this.addCardDiv;
    }
}
