
import { AppComponent } from './app.component';
import {Routes} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {NgModule} from "@angular/core";
import {NgIf} from "@angular/common";
import {LoginService} from "./loginService";
import {ProductsListComponent} from "./products-list/products-list.component";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'products_list', component: ProductsListComponent}
];

@NgModule({
  declarations: [
    HomepageComponent,
    RegistrationComponent
  ],
  imports: [
    NgIf
  ],
  providers: [],
})
export class AppModule { }
