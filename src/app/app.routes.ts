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
import {ReviewComponent} from "./review/review.component";
import {PersonalDataComponent} from "./personal-data/personal-data.component";
import {ReportsComponent} from "./reports/reports.component";
import {FooterComponent} from "./footer/footer.component";
import {UserPaymentDataComponent} from "./user-payment-data/user-payment-data.component";
import {PaymentFirstPageComponent} from "./payment-first-page/payment-first-page.component";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'product-page', component: ProductPageComponent},
  {path: 'products_list', component: ProductsListComponent},
  {path: 'product-management', component: ProductManagementComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'personal-data', component: PersonalDataComponent},
  {path: 'payment-data', component: UserPaymentDataComponent},
  {path: 'payment-first-page', component: PaymentFirstPageComponent},
];

@NgModule({
  declarations: [
    HomepageComponent,
    RegistrationComponent,
    ProductPageComponent,
    ProductsListComponent,
    ProductManagementComponent,
    ShoppingCartComponent,
    ReviewComponent,
    ReportsComponent
  ],
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    FooterComponent,
    PersonalDataComponent,
    PaymentFirstPageComponent,
    PersonalDataComponent,
    PaymentFirstPageComponent,
  ],
  providers: [],
  exports: [
  ]
})
export class AppModule { }
