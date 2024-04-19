import { Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css', '../../styles.css']
})
export class ProductManagementComponent{
  primaryTone: string = 'NON SELEZIONATA';
  secondaryTone: string = 'NON SELEZIONATA';

  protected formCaesarzon!: FormGroup;
  imageUrls: (string | null)[] = [null, null, null, null];


  constructor(private fb: FormBuilder, private popUpService: PopupService) {
    this.createForm();
  }

  createForm() {
    this.formCaesarzon = this.fb.group({
      formDeiProdotti: this.buildFormProdotti()
    })

  }
  updatePrimaryTone(event: any) {
    const selectedColor = event.target.value;
    const colorName = this.convertColorToPrimaryTone(selectedColor);
    this.primaryTone = colorName;
    this.formCaesarzon.get('coloreP')?.setValue(colorName);
  }

  updateSecondaryTone(event: any) {
    const selectedColor = event.target.value;
    const colorName = this.convertColorToPrimaryTone(selectedColor);
    this.secondaryTone = colorName;
    this.formCaesarzon.get('coloreS')?.setValue(colorName);
  }

  private buildFormProdotti():FormGroup{
    return this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      descrizione: ['', Validators.required],
      sconto: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      quantita: ['', [Validators.required, Validators.min(0), Validators.max(200)]],
      prezzo: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      coloreP: ['', Validators.required],
      coloreS: ['', Validators.required],
      taglia: ['none', Validators.required],
      sport: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }
  printFormValues() {
    console.log('Valori del form:', this.formCaesarzon.value);
  }
  aggiungiProdotto() {
    this.popUpService.updateStringa("FUN-ZIO-NOOOOOOOOOOOO!");
    this.popUpService.apriPopUp()
    this.printFormValues()
  }
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

  get form() {
    return this.formCaesarzon.controls;
  }

  handleFileInput(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        if (!this.imageUrls.includes(imageUrl)) {
          this.imageUrls[index] = imageUrl;
        } else {
          this.popUpService.updateStringa("Immagine già caricata!");
          this.popUpService.apriPopUp();
        }
      };
      reader.readAsDataURL(file);
    }
  }


  openFileInput(event: MouseEvent, index: number) {
    const input = document.getElementById('file-input' + index) as HTMLInputElement;
    if (input) {
      input.click();
    }
    event.preventDefault();
  }

  deleteImage(index: number) {
    this.imageUrls[index] = null;
  }


  campoNonCorretto(fieldName: string) {
    const fieldControl = this.formCaesarzon.get(fieldName);
    return fieldControl?.invalid && (fieldControl?.dirty || fieldControl?.touched);
  }


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
