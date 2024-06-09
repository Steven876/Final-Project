import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmPageComponent } from './pages/confirm-page/confirm-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { AllGasComponent } from './pages/all-gas/all-gas.component';
import { AddGasComponent } from './pages/add-gas/add-gas.component';
import { ViewGasComponent } from './pages/view-gas/view-gas.component';
import { DeleteGasComponent } from './pages/delete-gas/delete-gas.component';
import { AuthGuardGuard } from './guard/auth-guard.guard';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { AllUsersComponent } from './pages/all-users/all-users.component';
import { UpdateGasComponent } from './pages/update-gas/update-gas.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { ViewOrderComponent } from './pages/view-order/view-order.component';
import { UpdateOrderComponent } from './pages/update-order/update-order.component';
import { DeleteOrderComponent } from './pages/delete-order/delete-order.component';
import { MyOrderComponent } from './pages/my-order/my-order.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './pages/register/register.component';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { DeleteUserComponent } from './pages/delete-user/delete-user.component';

const routes: Routes = [
  { path: 'login', title: 'User Login', component: AuthLoginComponent },
  { path: 'home', title: 'Home Page', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuardGuard] },
  { path: 'order', title: 'Order Page', component: OrderPageComponent, canActivate: [AuthGuardGuard] },
  { path: 'all-gas', title: 'All Gas', component: AllGasComponent, canActivate: [AuthGuardGuard],  data: { expectedRole: 'ADMIN' } },
  { path: 'view-gas/:id', title: 'View Gas', component: ViewGasComponent, canActivate: [AuthGuardGuard] },
  { path: 'add-gas', title: 'Add Gas', component: AddGasComponent, canActivate: [AuthGuardGuard],  data: { expectedRole: 'ADMIN' } },
  { path: 'update-gas/:id', title: 'Update Gas', component: UpdateGasComponent, canActivate: [AuthGuardGuard] },
  { path: 'delete-gas/:id', title: 'Delete Gas', component: DeleteGasComponent, canActivate: [AuthGuardGuard] },
  { path: 'all-users', title: 'Users List', component: AllUsersComponent, canActivate: [AuthGuardGuard],  data: { expectedRole: 'ADMIN' } },
  {path: 'confirmation', title: 'Confirm Page', component: ConfirmPageComponent, canActivate: [AuthGuardGuard]},
  {path: 'deliveries', title: 'Delivery Page', component: DeliveriesComponent, canActivate: [AuthGuardGuard],  data: { expectedRole: 'ADMIN' } },
  {path: 'view-order/:id', title: 'View Order', component: ViewOrderComponent, canActivate: [AuthGuardGuard] },
  {path: 'update-order/:id', title: 'Update Order', component: UpdateOrderComponent, canActivate: [AuthGuardGuard]},
  {path: 'delete-order/:id', title: 'Delete Order', component: DeleteOrderComponent, canActivate: [AuthGuardGuard] },
  {path: 'my-order', title: 'My Order', component: MyOrderComponent, canActivate: [AuthGuardGuard], data: { expectedRole: 'USER' } },
  {path: 'contact', title: 'Contact Page', component: ContactComponent, canActivate: [AuthGuardGuard]},
  {path: 'register', title: 'Register Page', component: RegisterComponent},
  {path: 'view-user/:id', title: 'View User', component: ViewUserComponent},
  {path: 'edit-user/:id', title: 'Edit User', component: EditUserComponent},
  {path: 'delete-user/:id', title: 'Delete User', component: DeleteUserComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
