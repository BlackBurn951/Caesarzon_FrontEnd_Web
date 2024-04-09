import {RouterLink, RouterModule, RouterOutlet, Routes} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {RegistrationComponent} from "./registration/registration.component";
import {NgModule} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent}
];

@NgModule({
  declarations: [RegistrationComponent, HomepageComponent],
  imports: [RouterModule.forRoot(routes),
    RouterOutlet,
    RouterLink,
    MatDialogModule
  ],
  exports: [
    RouterModule
  ],
})


export class AppRoutes{



}
