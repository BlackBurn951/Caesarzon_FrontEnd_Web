import {Component, input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {PopupService} from "../services/popUpService";
import {FormService} from "../services/formService";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {ProductDTO} from "../entities/ProductDTO";
import {AdminService} from "../services/adminService";
import {SafeUrl} from "@angular/platform-browser";


class AvailabilitiesSingle{
  amount!: number;
  size!: string
}
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css', '../../styles.css']
})
export class ProductManagementComponent implements OnInit{
  tone: string = 'NON SELEZIONATO';

  protected formCaesarzon!: FormGroup;



  constructor(protected adminService: AdminService, private keyCloak:KeyCloakService, public formService: FormService, private popUpService: PopupService, protected productService: ProductService) {
    this.formCaesarzon = formService.getForm();
  }



  // Metodo per aggiungere il prodotto
  aggiungiProdotto() {
    this.formService.setFormData(this.formCaesarzon.value);

    const nome = this.formCaesarzon.get('formDeiProdotti.nome')?.value;
    const marca = this.formCaesarzon.get('formDeiProdotti.marca')?.value;
    const descrizione = this.formCaesarzon.get('formDeiProdotti.descrizione')?.value;
    const sconto = this.formCaesarzon.get('formDeiProdotti.sconto')?.value;
    const prezzo = this.formCaesarzon.get('formDeiProdotti.prezzo')?.value;
    const coloreP = this.formCaesarzon.get('formDeiProdotti.coloreP')?.value;
    const coloreS = this.formCaesarzon.get('formDeiProdotti.coloreS')?.value;
    const sport = this.formCaesarzon.get('formDeiProdotti.sport')?.value;

    let is_clothing = false;
    const categoria = this.formCaesarzon.get('formDeiProdotti.categoria')?.value;
    if (categoria === "Abbigliamento") {
      is_clothing = true;
    }

    const quantitaXS = this.formCaesarzon.get('formDisponibilita.quantitaXS')?.value;
    const quantitaS = this.formCaesarzon.get('formDisponibilita.quantitaS')?.value;
    const quantitaM = this.formCaesarzon.get('formDisponibilita.quantitaM')?.value;
    const quantitaL = this.formCaesarzon.get('formDisponibilita.quantitaL')?.value;
    const quantitaXL = this.formCaesarzon.get('formDisponibilita.quantitaXL')?.value;

    let ava: AvailabilitiesSingle[] = [];

    if (quantitaXS != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "XS";
      singleAva.amount = quantitaXS;
      ava.push(singleAva);
    }

    if (quantitaS != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "S";
      singleAva.amount = quantitaS;
      ava.push(singleAva);
    }

    if (quantitaM != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "M";
      singleAva.amount = quantitaM;
      ava.push(singleAva);
    }

    if (quantitaL != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "L";
      singleAva.amount = quantitaL;
      ava.push(singleAva);
    }

    if (quantitaXL != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "XL";
      singleAva.amount = quantitaXL;
      ava.push(singleAva);
    }

    const sendProduct: ProductDTO = {
      id: "",
      name: nome,
      brand: marca,
      description: descrizione,
      discount: sconto,
      price: prezzo,
      primaryColor: coloreP,
      secondaryColor: coloreS,
      sport: sport,
      is_clothing: is_clothing,
      availabilities: ava,
      lastModified: ""

    };

    this.productService.sendProductDate(sendProduct)
  }



  //Metodo per caricare le immagini del prodotto limitanto la dimensione a 6MB
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.productService.selectedFile = event.target.files[0];
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
  //Metodo utilizzato nel precedente relativo al caricamento dell'immagine di profilo
  // onUpload() {
  //   if (this.productService.selectedFile) {
  //     this.productService.uploadImage(this.productService.selectedFile, ).subscribe(
  //       response => {
  //         this.popUpService.updateStringa(response)
  //         this.popUpService.openPopups(141, true)
  //
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  //   }
  // }


  //Metodo per convertire approssivamente un colore ad un macro dello stesso
  convertColorToPrimaryTone(color: string): string {
    if (!color) return "Non valido";

    let red, green, blue;

    if (color.startsWith("#") && (color.length === 4 || color.length === 7)) {
      red = parseInt(color.substring(1, 3), 16);
      green = parseInt(color.substring(3, 5), 16);
      blue = parseInt(color.substring(5, 7), 16);
    } else if (color.startsWith("rgb(") && color.endsWith(")")) {
      const rgbValues = color.substring(4, color.length - 1).split(',');
      if (rgbValues.length !== 3) return "Non valido";
      red = parseInt(rgbValues[0].trim());
      green = parseInt(rgbValues[1].trim());
      blue = parseInt(rgbValues[2].trim());
    } else {
      return "Non valido";
    }

    if (red === 0 && green === 0 && blue === 0) return "Nero";
    else if (red === 255 && green === 255 && blue === 255) return "Bianco";
    else if (red === green && red > blue) return "Giallo";
    else if (red > green && red > blue) return "Rosso";
    else if (green > red && green > blue) return "Verde";
    else if (blue > red && blue > green) return "Blu";
    else if (red === green && red === blue) return "Grigio";
    else return "Altro";
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }


}
