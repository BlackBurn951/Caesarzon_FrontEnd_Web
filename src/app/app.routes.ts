
import {Routes} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ProductPageComponent} from "./product-page/product-page.component";
import {NgModule} from "@angular/core";
import {NgClass, NgIf} from "@angular/common";
import {ProductsListComponent} from "./products-list/products-list.component";
import {ProductManagementComponent} from "./product-management/product-management.component";
import {HeaderComponent} from "./header/header.component";
import {FormsModule} from "@angular/forms";



export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'product-page', component: ProductPageComponent},
  {path: 'products_list', component: ProductsListComponent},
  {path: 'product-management', component: ProductManagementComponent}
];

@NgModule({
  declarations: [
    HomepageComponent,
    RegistrationComponent,
    ProductPageComponent,
    ProductsListComponent,
    ProductManagementComponent
  ],
    imports: [
        NgIf,
        NgClass,
        FormsModule,
    ],
  providers: [],
})
export class AppModule { }
