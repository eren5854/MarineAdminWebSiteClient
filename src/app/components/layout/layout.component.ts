import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { MessageModel } from '../../models/message.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  @ViewChild('sideMenu') sideMenu: ElementRef | undefined;
  userModel: UserModel = new UserModel();

  messages: MessageModel[] = [];

  messageCount: number = 0;

  userId: string = "";
  isDarkTheme = false;
  isSideBarOpen = false;


  constructor(
    private renderer: Renderer2,
    private http: HttpService,
    public auth: AuthService,
  ) {
    this.getAllMessage();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme-variables');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme-variables');
    }
  }

  toggleSideBar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
    const sideMenuElement = this.sideMenu?.nativeElement as HTMLElement;

    if (this.isSideBarOpen) {
      sideMenuElement.style.display = 'block';
    } else {
      sideMenuElement.style.display = 'none';
    }
  }

  getAllMessage(){
    this.http.get("Contacts/GetAll", (res) => {
      // İlk önce isRead = false olan mesajları al
      let unreadMessages = res.data.filter((message: MessageModel) => !message.isRead);
      this.messageCount = unreadMessages.length;
      // Eğer isRead = false olan mesaj yoksa, isRead = true olanlardan 4 mesaj al
      if (unreadMessages.length === 0) {
        this.messages = res.data.filter((message: MessageModel) => message.isRead).slice(0, 4);
      } else {
        // Aksi halde isRead = false olan mesajlardan ilk 4'ü al
        this.messages = unreadMessages.slice(0, 4);
      }
    });
  }

  logout() {
    // localStorage.setItem("token", this.token);
    localStorage.clear();
    // this.router.navigateByUrl("/");
  }
}
