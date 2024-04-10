
import { AppComponent } from './app.component';
import {Routes} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {NgModule} from "@angular/core";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent}
];

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
  ],
  providers: [],
})
export class AppModule { }
