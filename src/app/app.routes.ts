
import { AppComponent } from './app.component';
import {Routes} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {NgModule} from "@angular/core";
import {NgIf} from "@angular/common";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent}
];

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    NgIf
  ],
  providers: [],
})
export class AppModule { }
