import { Component, ElementRef, ViewChild } from '@angular/core';
import { PortfolioModel } from '../../models/portfolio.model';
import { HttpService } from '../../services/http.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../services/swal.service';

declare var $: any;

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  portfolioModel: PortfolioModel = new PortfolioModel();
  portfolios: PortfolioModel[] = [];

  imageSrc: string | ArrayBuffer | null = null;

  addCardDiv = false;
  imageUrl?: string;
  selectedImageUrl: string | null = null;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getAll();
    this.imageUrl = this.http.getImageUrl();
  }

  ngAfterViewInit(){
    $(document).ready(() => {
      $('#summernote').summernote({
        tabsize: 1,
        height: 500,
        callbacks: {
          onChange: (contents: string) => {
            this.portfolioModel.description = contents; // Summernote içeriğini Angular modeline atama
          }
        }
      });
    });
   }

  getAll() {
    this.http.get("Portfolios/GetAll", (res) => {
      this.portfolios = res.data
      console.log(this.portfolios);
      this.selectedImageUrl = null;
    });
  }

  create(form: NgForm) {
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("title", this.portfolioModel.title!);
      formData.append("description", this.portfolioModel.description);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Portfolios/Create", formData, (res) => {
        console.log(res);
        this.portfolioModel = new PortfolioModel();
        this.imageSrc = "";
        this.addCardDiv = false;
        this.getAll();
      })
    }
  }

  update(form: NgForm, portfolio: PortfolioModel) {
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", portfolio.id!);
      formData.append("title", portfolio.title!);
      formData.append("description", portfolio.description);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Portfolios/Update", formData, (res) => {
        console.log(res);
        this.getAll();
      })
    }
  }

  deleteById(id: string) {
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Portfolios/DeleteById?Id=${id}`, (res) => {
        console.log(res);
        this.getAll();
      });
    });
  }

  setImage(event: any, portfolio: PortfolioModel) {
    const file = event.target.files[0];
    if (file) {
      portfolio.image = file.name;
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        portfolio.previewImage = e.target.result; // Sadece ilgili homeImage için önizleme URL'si atanıyor
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
