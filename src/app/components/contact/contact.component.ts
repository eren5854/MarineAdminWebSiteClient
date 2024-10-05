import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactModel } from '../../models/contact.model';
import { HttpService } from '../../services/http.service';
import { LinkModel } from '../../models/link.model';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactModel: ContactModel = new ContactModel();
  linkModel: LinkModel = new LinkModel();
  links: LinkModel[] = [];

  addCardDiv = false;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getAllInformation();
    this.getAllLink();
  }

  getAllInformation() {
    this.http.get("Informations/GetAll", (res) => {
      this.contactModel = res.data[0];
      console.log(this.contactModel);
    })
  }

  getAllLink() {
    this.http.get("Links/GetAll", (res) => {
      this.links = res.data;
      console.log(this.links);

    })
  }

  updateInformation(form: NgForm) {
    if (form.valid) {
      this.http.post("Informations/Update", this.contactModel, (res) => {
        console.log(res);
        this.getAllInformation();
      })
    }
  }

  createLink(form: NgForm) {
    this.linkModel.informationId = this.contactModel.id;
    if (form.valid) {
      this.http.post("Links/Create", this.linkModel, (res) => {
        console.log(res);
        this.linkModel = new LinkModel();
        this.addCardDiv = false;
        this.getAllLink();
        this.getAllInformation();
      })
    }
  }

  updateLink(form: NgForm, link: LinkModel) {
    link.informationId = this.contactModel.id;
    if (form.valid) {
      this.http.post("Links/Update", link, (res) => {
        console.log(res);
        this.getAllLink();
      });
    }
  }


  deleteLinkById(id: string) {
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Links/DeleteById?Id=${id}`, (res) => {
        console.log(res);
        this.getAllLink();
        this.getAllInformation();
      });
    });
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }
}
