import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AboutModel } from '../../models/about.model';
import { HttpService } from '../../services/http.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { SwalService } from '../../services/swal.service';

declare var $: any;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  aboutModel: AboutModel = new AboutModel();
  abouts: AboutModel[] = [];

  addCardDiv = false;
  imageSrc: string | ArrayBuffer | null = null;

  imageUrl?: string;
  selectedImageUrl: string | null = null;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getAll();
    this.imageUrl = this.http.getImageUrl();
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      $('#summernote').summernote({
        tabsize: 1,
        height: 500,
        callbacks: {
          onChange: (contents: string) => {
            this.aboutModel.text = contents; // Summernote içeriğini Angular modeline atama
          }
        }
      });
    });
  }

  getAll() {
    this.http.get("Abouts/GetAll", (res) => {
      this.abouts = res.data
      console.log(this.abouts);
    });
  }

  create(form: NgForm) {
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("title", this.aboutModel.title!);
      formData.append("text", this.aboutModel.text!);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Abouts/Create", formData, (res) => {
        console.log(res);
        this.aboutModel = new AboutModel();
        this.imageSrc = "";
        this.addCardDiv = false;
        this.getAll();
      })
    }
  }

  update(form: NgForm, about: AboutModel) {
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", about.id!);
      formData.append("title", about.title!);
      formData.append("text", about.text!);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Abouts/Update", formData, (res) => {
        console.log(res);
        this.getAll();
      })
    }
  }

  deleteById(id: string) {
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Abouts/DeleteById?Id=${id}`, (res) => {
        console.log(res);
        this.getAll();
      });
    });
  }

  deleteImageById(id: string){
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Abouts/DeleteImageById?Id=${id}`, (res) => {
        console.log(res);
        this.getAll();
      });
    });
  }

  setImage(event: any, about: AboutModel) {
    const file = event.target.files[0];
    if (file) {
      about.image = file.name;
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        about.previewImage = e.target.result;
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
