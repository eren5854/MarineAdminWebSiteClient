import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HomeModel } from '../../models/home.model';
import { HttpService } from '../../services/http.service';
import { HomeImageModel } from '../../models/homeImage.model';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  homeModel: HomeModel = new HomeModel();
  homeImageModel: HomeImageModel = new HomeImageModel();
  homeImages: HomeImageModel[] = [];

  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  addCardDiv = false;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ){
    this.getAllHome();
    this.getAllHomeImage();
  }

  getAllHome(){
    this.http.get("Homes/GetAll", (res) => {
      this.homeModel = res.data[0];
      console.log(this.homeModel);
    })
  }

  updateHome(form:NgForm){
    if (form.valid) {
      this.http.post("Homes/Update", this.homeModel, (res) => {
        console.log(res);
        this.getAllHome();
      });
    }
  }

  getAllHomeImage(){
    this.http.get("HomeImages/GetAll", (res) => {
      this.homeImages = res.data;
      console.log(this.homeImages);
      
    })
  }

  createHomeImage(form:NgForm){
    this.homeImageModel.homeId = this.homeModel.id;
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("title", this.homeImageModel.title);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      formData.append("homeId", this.homeImageModel.homeId!);
      this.http.post("HomeImages/Create", formData, (res) => {
        console.log(res);
        this.homeImageModel = new HomeImageModel();
        this.imageSrc = "";
        this.addCardDiv = !this.addCardDiv;
        this.getAllHomeImage();
      })
    }
  }

  updateHomeImage(form:NgForm, homeImage: HomeImageModel){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", homeImage.id!)
      formData.append("title", homeImage.title);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      formData.append("homeId", homeImage.homeId!);
      this.http.post("HomeImages/Update", formData, (res) => {
        console.log(res);
        console.log(formData);
        
        this.getAllHomeImage();
      });
    }
  }

  deleteHomeImageById(id:string){
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`HomeImages/DeleteById?Id=${id}`, (res) => {
        console.log(res);
        this.getAllHomeImage();
      });
    });
  }

  setImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file); // Dosyayı base64 formatına çevir ve önizle
      this.homeImageModel.image = file.name;
      console.log(this.homeImageModel.image);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard(){
    this.addCardDiv = !this.addCardDiv;
  }
}
