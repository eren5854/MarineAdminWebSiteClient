import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { ContactComponent } from './components/contact/contact.component';
import { MessageComponent } from './components/message/message.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
      path: "forgot-password/:email",
      component: ForgotPasswordComponent  
    },
    {
        path: "",
        component: LayoutComponent,
        canActivateChild: [() => inject(AuthService).isAuthenticated()],
        children:[
            {
                path: "",
                component: DashboardComponent
            },
            {
                path: "home",
                component: HomeComponent
            },
            {
                path: "about",
                component: AboutComponent
            },
            {
                path: "portfolio",
                component: PortfolioComponent
            },
            {
                path: "contact",
                component: ContactComponent
            },
            {
                path: "message",
                component: MessageComponent
            },
            {
                path: "settings",
                component: SettingsComponent
            }
        ]
    }
];
