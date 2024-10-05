import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LayoutModel } from '../../models/layout.model';
import { HttpService } from '../../services/http.service';

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

  selectedImageUrl: string | null = null;

  constructor(
    private http: HttpService
  ) {
    this.getAll();
   }

  getAll(){
    this.http.get("Layouts/GetAll", (res) => {
      this.layoutModel = res.data[0];
      console.log(this.layoutModel);
      
    })
  }

  update(form:NgForm){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", this.layoutModel.id!);
      formData.append("slogan", this.layoutModel.slogan);
      formData.append("shortAboutText", this.layoutModel.shortAboutText);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Layouts/Update", formData, (res) => {
        console.log(res);
        
      })
    }
  }

  setImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.layoutModel.image = file.name;
      console.log(this.layoutModel.image);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}
