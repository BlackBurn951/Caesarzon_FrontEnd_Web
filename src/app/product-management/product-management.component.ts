import {Component, input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {PopupService} from "../services/popUpService";
import {FormService} from "../services/formService";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {AdminService} from "../services/adminService";


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css', '../../styles.css']
})
export class ProductManagementComponent implements OnInit{

  protected formCaesarzon!: FormGroup;

  constructor(protected adminService: AdminService, private keyCloak:KeyCloakService, public formService: FormService, private popUpService: PopupService, protected productService: ProductService) {
    this.formCaesarzon = formService.getForm();
  }

  //Metodo per caricare le immagini del prodotto limitanto la dimensione a 6MB
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.productService.selectedFile = event.target.files[0];
    this.productService.immagineCaricataModifica = true
    const reader = new FileReader();
    const maxSize = 3 * 1024 * 1024; // 6 MB

    if (file) {
      if (file.size > maxSize) {
        this.popUpService.updateStringa("La dimensione massima del file è di 6 MB.");
        this.popUpService.openPopups(104, true)
      }else {
        reader.onload = (e: any) => {
          const preview = document.getElementById('preview');
          if (preview) {
            preview.style.display = 'block';
            preview.setAttribute('src', e.target.result);
          } else {
            console.error("Elemento 'preview' non trovato nel DOM.");
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }


  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }


}
