import { Component } from '@angular/core';
import { FlexiGridModule } from 'flexi-grid';
import { MessageModel } from '../../models/message.model';
import { HttpService } from '../../services/http.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FlexiGridModule, FormsModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  messageModel: MessageModel = new MessageModel();
  messages: MessageModel[] = [];

  showModal: boolean = false;
  selectedMessage: MessageModel | null = null; // Seçilen mesajı saklayacak

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getAll();
  }

  getAll() {
    this.http.get("Contacts/GetAll", (res) => {
      this.messageModel = res.data;
      this.messages = res.data;
      console.log(this.messageModel);
    });
  }

  deleteById(id: string) {
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Contacts/DeleteById?Id=${id}`, (res) => {
        console.log('Deleted:', res);
        this.swal.callToast('The record was deleted successfully.', 'success');
        this.getAll();
      });
    });
  }

  openModal(item: MessageModel) {
    this.selectedMessage = item;
    this.showModal = true;
    item.isRead = true;
    this.http.post("Contacts/Update", {id: item.id, isRead: item.isRead}, (res) => {
      console.log(res);
    })
  }

  closeModal() {
    this.showModal = false;
    this.selectedMessage = null;
  }

}
