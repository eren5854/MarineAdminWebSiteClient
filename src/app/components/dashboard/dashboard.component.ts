import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LayoutModel } from '../../models/layout.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  layoutModel: LayoutModel = new LayoutModel();
  layouts: LayoutModel[] = [];

  selectedImageUrl: string | null = null;
  addCardDiv = false;
  emptyLayout = true;
  imageSrc: string | ArrayBuffer | null = null;
  imageUrl?: string;
  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getAll();
    this.imageUrl = this.http.getImageUrl();
    console.log(this.imageUrl);
   }

  // getAll(){
  //   this.http.get("Layouts/GetAll", (res) => {
  //     this.layoutModel = res.data[0];
  //     console.log(this.layoutModel);
  //     if(this.layoutModel !== null){
  //       this.emptyLayout = false;
  //       console.log(this.emptyLayout);
        
  //     }
  //   })
  // }

  getAll(){
    this.http.get("Layouts/GetAll", (res) => {
      this.layouts = res.data;
      console.log(this.layouts);
      if(this.layouts !== null){
        this.emptyLayout = false;
        console.log(this.emptyLayout);
        
      }
    })
  }

  create(form:NgForm){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", this.layoutModel.id!);
      // formData.append("slogan", this.layoutModel.slogan!);
      formData.append("shortAboutText", this.layoutModel.shortAboutText!);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Layouts/Update", formData, (res) => {
        console.log(res);
        
      })
    }
  }

  // update(form:NgForm){
  //   const formData: FormData = new FormData();
  //   if (form.valid) {
  //     formData.append("id", this.layoutModel.id!);
  //     formData.append("slogan", this.layoutModel.slogan);
  //     formData.append("shortAboutText", this.layoutModel.shortAboutText);
  //     formData.append("image", this.fileInput.nativeElement.files[0]);
  //     this.http.post("Layouts/Update", formData, (res) => {
  //       console.log(res);
        
  //     })
  //   }
  // }

  update(form:NgForm, layout:LayoutModel){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", layout.id!);
      formData.append("slogan", layout.slogan! || undefined!);
      formData.append("shortAboutText", layout.shortAboutText || null!);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Layouts/Update", formData, (res) => {
        console.log(res);
        
      });
    }
  }

  deleteLayoutById(id:string){
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Layouts/DeleteById?Id=${id}`, (res) => {
        console.log(res);
        this.getAll();
      });
    });
  }

  setImage(event: any, layout: LayoutModel) {
      const file = event.target.files[0];
      if (file) {
        layout.image = file.name;
    
        const reader = new FileReader();
        reader.onload = (e: any) => {
          layout.previewImage = e.target.result; // Sadece ilgili homeImage için önizleme URL'si atanıyor
        };
        reader.readAsDataURL(file);
      }
    }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard(){
    this.addCardDiv = !this.addCardDiv;
  }
}
