import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { ConfirmPageComponent } from './pages/confirm-page/confirm-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AllGasComponent } from './pages/all-gas/all-gas.component';
import { ViewGasComponent } from './pages/view-gas/view-gas.component';
import { AddGasComponent } from './pages/add-gas/add-gas.component';
import { DeleteGasComponent } from './pages/delete-gas/delete-gas.component';
// import { FormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { AllUsersComponent } from './pages/all-users/all-users.component';
import { AuthInterceptorInterceptor } from './interceptors/auth-interceptor.interceptor';
import { UpdateGasComponent } from './pages/update-gas/update-gas.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { UpdateOrderComponent } from './pages/update-order/update-order.component';
import { ViewOrderComponent } from './pages/view-order/view-order.component';
import { DeleteOrderComponent } from './pages/delete-order/delete-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MyOrderComponent } from './pages/my-order/my-order.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './pages/register/register.component';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { DeleteUserComponent } from './pages/delete-user/delete-user.component';
// import { MyOrdersComponent } from './pages/my-orders/my-orders.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrderPageComponent,
    ConfirmPageComponent,
    AllGasComponent,
    ViewGasComponent,
    AddGasComponent,
    DeleteGasComponent,
    HeaderComponent,
    FooterComponent,
    AuthLoginComponent,
    AllUsersComponent,
    UpdateGasComponent,
    DeliveriesComponent,
    UpdateOrderComponent,
    ViewOrderComponent,
    DeleteOrderComponent,
    MyOrderComponent,
    ContactComponent,
    RegisterComponent,
    ViewUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    // MyOrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
