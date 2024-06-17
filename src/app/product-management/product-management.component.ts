import { Component} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {PopupService} from "../services/popUpService";
import {FormService} from "../services/formService";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css', '../../styles.css']
})
export class ProductManagementComponent{
  tone: string = 'NON SELEZIONATO';

  protected formCaesarzon!: FormGroup;

  imageUrls: (any | null)[] = [null, null, null, null];


  constructor(public formService: FormService, private popUpService: PopupService) {
    this.formCaesarzon = formService.getForm();
  }

  //Metodo per aggiornare il colore selezionato dall'utente
  updateTone(event: any, num: number) {
    const selectedColor = event.target.value;
    const colorName = this.convertColorToPrimaryTone(selectedColor);
    this.tone = colorName;
    if(num === 1){
      this.formCaesarzon.get('formDeiProdotti.coloreP')?.setValue(colorName);
    }else{
      this.formCaesarzon.get('formDeiProdotti.coloreS')?.setValue(colorName);
    }

  }

  //Metodo per aggiungere il prodotto
  aggiungiProdotto() {
    this.popUpService.updateStringa("FUN-ZIO-NOOOOOOOOOOOO!");
    this.popUpService.openPopups(104, true)
  }

  //Metodo per controllare se sono state caricate effettivamente N°4 immagini per il prodotto
  areImagesUploaded(): boolean {
    const category = this.formCaesarzon.get('formDeiProdotti.categoria')?.value;
    const size = this.formCaesarzon.get('formDeiProdotti.taglia')?.value;
    const imagesUploaded = this.imageUrls.every(url => url !== null);
    if (category === 'abbigliamento' && size === 'none') {
      return false;
    } else {
      return imagesUploaded;
    }
  }

  //Metodo per caricare le immagini del prodotto limitanto la dimensione a 6MB
  handleFileInput(event: any, index: number) {
    const file = event.target.files[0];
    const maxSize = 3 * 1024 * 1024; // 6 MB

    if (file) {
      if (file.size > maxSize) {
        this.popUpService.updateStringa("La dimensione massima del file è di 6 MB.");
        this.popUpService.openPopups(104, true)
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          if (!this.imageUrls.includes(imageUrl)) {
            this.imageUrls[index] = imageUrl;
          } else {
            this.popUpService.updateStringa("Immagine già caricata!");
            this.popUpService.openPopups(104, true)
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  //Metodo per visualizzare le foto
  openFileInput(event: MouseEvent, index: number) {
    const input = document.getElementById('file-input' + index) as HTMLInputElement;
    if (input) {
      input.click();
    }
    event.preventDefault();
  }


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





}
