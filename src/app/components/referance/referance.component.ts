import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { ReferenceModel } from '../../models/reference.model';

@Component({
  selector: 'app-referance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './referance.component.html',
  styleUrl: './referance.component.css'
})
export class ReferanceComponent {
  referenceModel: ReferenceModel = new ReferenceModel();
  references: ReferenceModel[] = [];

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
    this.getAllReference();
  }

  getAllReference() {
    this.http.get("Referances/GetAll", (res) => {
      this.references = res.data;
    })
  }

  createReferance(form: NgForm) {
    const formData: FormData = new FormData();
    formData.append("logo", this.fileInput.nativeElement.files[0]);
    if (this.referenceModel.websiteUrl != null)
      formData.append("websiteUrl", this.referenceModel.websiteUrl);
    this.http.post("Referances/Create", formData, (res) => {
      this.referenceModel = new ReferenceModel();
      this.imageSrc = "";
      this.addCardDiv = !this.addCardDiv;
      this.getAllReference();
    })
  }

  updateReference(form: NgForm, reference: ReferenceModel) {
    const formData: FormData = new FormData();
    formData.append("id", reference.id);
    const file = this.fileInput.nativeElement.files[0];
    if (file) {
      // Eğer dosya seçilmişse formData'ya ekle
      formData.append("logo", file);
    }
    if (reference.websiteUrl != null)
      formData.append("websiteUrl", reference.websiteUrl);
    this.http.post("Referances/Update", formData, (res) => {
      this.fileInput.nativeElement.value = "";
      this.getAllReference();
    })
  }

  deletereference(id:string){
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Referances/DeleteById?Id=${id}`, (res) => {
        console.log(res);
        this.getAllReference();
      });
    });
  }

  setImage(event: any, referenceImage: ReferenceModel) {
    const file = event.target.files[0];
    if (file) {
      referenceImage.logo = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        referenceImage.previewLogo = e.target.result;
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
