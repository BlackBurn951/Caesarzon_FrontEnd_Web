import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ProductPageComponent} from "./product-page/product-page.component";
import {ApplicationRef, ChangeDetectorRef, DoBootstrap, NgModule} from "@angular/core";
import {ProductsListComponent} from "./products-list/products-list.component";
import {ProductManagementComponent} from "./product-management/product-management.component";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {PersonalDataComponent} from "./personal-data/personal-data.component";
import {FooterComponent} from "./footer/footer.component";
import {UserPaymentDataComponent} from "./user-payment-data/user-payment-data.component";
import {HelpRequestComponent} from "./help-request/help-request.component";
import {UserManagementContainerComponent} from "./user-management-container/user-management-container.component";
import {UserAddressDataComponent} from "./user-address-data/user-address-data.component";
import {WishListComponent} from "./wish-list/wish-list.component";
import {PaymentSecondPageComponent} from "./payment-second-page/payment-second-page.component";
import {AdminAreaComponent} from "./admin-area/admin-area.component";
import {AllPopupComponent} from "./all-popup/all-popup.component";
import {KeyCloakService} from "./services/keyCloakService";
import {FormService} from "./services/formService";
import {AppComponent} from "./app.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatAutocompleteModule, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {AdminManagementContainerComponent} from "./admin-management-container/admin-management-container.component";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'product-page', component: ProductPageComponent},
  {path: 'products-list', component: ProductsListComponent},
  {path: 'product-management', component: ProductManagementComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'personal-data', component: PersonalDataComponent},
  {path: 'payment-data', component: UserPaymentDataComponent},
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
    UserAddressDataComponent,
    UserPaymentDataComponent,
    PaymentSecondPageComponent,
    AdminAreaComponent
  ],
    imports: [RouterModule.forRoot(routes),
        NgIf,
        NgClass,
        FormsModule,
        NgForOf,
        BrowserModule,
        MatDialogModule,
        ReactiveFormsModule,
        FooterComponent,
        PersonalDataComponent,
        BrowserModule,
        HttpClientModule,
        UserManagementContainerComponent,
        BrowserAnimationsModule,
        MatAutocompleteTrigger,
        MatAutocompleteModule,
        MatOption,
        ReactiveFormsModule,
        CommonModule,
        MatOptionModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        NgOptimizedImage, AdminManagementContainerComponent
    ],
  providers: [KeyCloakService, FormService]
})
export class AppModule implements DoBootstrap{
  constructor(private appRef: ApplicationRef) {}

  ngDoBootstrap() {
    const element = document.getElementById('app-root');
    this.appRef.bootstrap(AppComponent, element);
  }
}
