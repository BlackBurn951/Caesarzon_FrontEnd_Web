import {Routes} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ProductPageComponent} from "./product-page/product-page.component";
import {NgModule} from "@angular/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductsListComponent} from "./products-list/products-list.component";
import {ProductManagementComponent} from "./product-management/product-management.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {PersonalDataComponent} from "./personal-data/personal-data.component";
import {FooterComponent} from "./footer/footer.component";
import {UserPaymentDataComponent} from "./user-payment-data/user-payment-data.component";
import {PaymentFirstPageComponent} from "./payment-first-page/payment-first-page.component";
import {HelpRequestComponent} from "./help-request/help-request.component";
import {UserManagementContainerComponent} from "./user-management-container/user-management-container.component";
import {UserAddressDataComponent} from "./user-address-data/user-address-data.component";
import {WishListComponent} from "./wish-list/wish-list.component";
import {PaymentSecondPageComponent} from "./payment-second-page/payment-second-page.component";
import {AdminAreaComponent} from "./admin-area/admin-area.component";
import {AllPopupComponent} from "./all-popup/all-popup.component";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'product-page', component: ProductPageComponent},
  {path: 'products-list', component: ProductsListComponent},
  {path: 'product-management', component: ProductManagementComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'personal-data', component: PersonalDataComponent},
  {path: 'payment-data', component: UserPaymentDataComponent},
  {path: 'payment-first-page', component: PaymentFirstPageComponent},
  {path: 'payment-second-page', component: PaymentSecondPageComponent},
  {path: 'help-request', component: HelpRequestComponent},
  {path: 'address-data', component: UserAddressDataComponent},
  {path: 'wish-list', component: WishListComponent},
  {path: 'admin-area', component: AdminAreaComponent}
];

@NgModule({
  declarations: [
    HomepageComponent,
    RegistrationComponent,
    ProductPageComponent,
    ProductsListComponent,
    ProductManagementComponent,
    ShoppingCartComponent,
    AllPopupComponent,
    PaymentFirstPageComponent,
    PaymentSecondPageComponent,
    AdminAreaComponent
  ],
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    FooterComponent,
    PersonalDataComponent,
    UserManagementContainerComponent
  ],
  providers: [],
  exports: [
  ]
})
export class AppModule { }
