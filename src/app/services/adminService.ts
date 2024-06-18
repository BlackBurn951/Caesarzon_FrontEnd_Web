import { Injectable } from '@angular/core';
import {Reports} from "../entities/Report";
import {Supports} from "../entities/Supports";
import {Bans} from "../entities/Bans";
import {Returns} from "../entities/Returns";
import {UserService} from "./userService";
import {UserSearch} from "../entities/UserSearch";

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  section: number = 0;

  //Definizione degli arrays
  users!: UserSearch[]
  returns!: Returns []
  bans: Bans[] = [
    {
      motivo: "Violazione delle regole della community",
      data: "2024-06-01",
      username: "utente1",
      descrizioneban: "Ha fatto brutto ED è DEI LUZZI"
    },
    {
      motivo: "Spam eccessivo",
      data: "2024-06-02",
      username: "utente2",
      descrizioneban: "Ha fatto brutto ED è DEI LUZZI"

    },
    {
      motivo: "Comportamento offensivo",
      data: "2024-06-03",
      username: "utente3",
      descrizioneban: "Ha fatto brutto ED è DEI LUZZI"

    },
    {
      motivo: "Utilizzo di linguaggio inappropriato",
      data: "2024-06-04",
      username: "utente4",
      descrizioneban: "Ha fatto brutto ED è DEI LUZZI"

    },
    {
      motivo: "Tentativi di hacking",
      data: "2024-06-05",
      username: "utente5",
      descrizioneban: "Ha fatto brutto ED è DEI LUZZI"
    }
  ];

  supports: Supports[] = [
    {
      username: "utente1",
      codice_supporto: "SUPP001",
      motivo: "Problema tecnico",
      oggetto: "Errore nel login",
      descrizione: "Non riesco ad accedere al mio account.",
      dataRichiesta: "2024-06-01",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      username: "utente2",
      codice_supporto: "SUPP002",
      motivo: "Richiesta informazioni",
      oggetto: "Informazioni su nuove funzionalità",
      descrizione: "Vorrei sapere di più sulle nuove funzionalità introdotte nell'ultimo aggiornamento.",
      dataRichiesta: "2024-06-03",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      username: "utente3",
      codice_supporto: "SUPP003",
      motivo: "Problema tecnico",
      oggetto: "Errore di sistema",
      descrizione: "Ricevo un errore di sistema quando cerco di salvare i dati.",
      dataRichiesta: "2024-06-05",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      username: "utente4",
      codice_supporto: "SUPP004",
      motivo: "Richiesta di assistenza",
      oggetto: "Aiuto con la configurazione",
      descrizione: "Non riesco a configurare correttamente il mio profilo.",
      dataRichiesta: "2024-06-07",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      username: "utente5",
      codice_supporto: "SUPP005",
      motivo: "Problema tecnico",
      oggetto: "Impossibile caricare file",
      descrizione: "Non riesco a caricare file di grandi dimensioni.",
      dataRichiesta: "2024-06-09",
      adminResponse: {
        explain: "",
        accept: true,
      },
    }
  ];


  reports: Reports[] = [
    {
      codice_segnalazione: "RPT001",
      motivo: "Spam",
      descrizione: "L'utente ha inviato messaggi spam in vari thread.",
      dataSegnalazione: "2024-06-01",
      usernameUser2: "user123",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      codice_segnalazione: "RPT002",
      motivo: "Linguaggio offensivo",
      descrizione: "L'utente ha utilizzato linguaggio offensivo nei confronti di altri membri.",
      dataSegnalazione: "2024-06-05",
      usernameUser2: "user456",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      codice_segnalazione: "RPT003",
      motivo: "Contenuti inappropriati",
      descrizione: "L'utente ha postato immagini non appropriate per il contesto del forum.",
      dataSegnalazione: "2024-06-10",
      usernameUser2: "user789",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      codice_segnalazione: "RPT004",
      motivo: "Molestie",
      descrizione: "L'utente ha molestato un altro membro con messaggi privati.",
      dataSegnalazione: "2024-06-15",
      usernameUser2: "user321",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
    {
      codice_segnalazione: "RPT005",
      motivo: "Plagio",
      descrizione: "L'utente ha copiato contenuti da altri siti senza attribuzione.",
      dataSegnalazione: "2024-06-20",
      usernameUser2: "user654",
      adminResponse: {
        explain: "",
        accept: true,
      },
    },
  ];

  constructor(private userService: UserService) {
  }


  //Metodo per svuotare gli arrays
  clearArrays(): void {
    this.users = []
    this.reports = []
    this.supports = []
    this.bans = []
    this.returns = []
  }

  //Al campio della selection vengono svuotate e popolate le rispettive liste con un numero di elementi inziale di 20
  changeSection(num: number) {
    this.section = num;
    //Chiamata al metodo per svuotare gli arrays+
    // this.clearArrays()
    //
    if (num == 0) {
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      })
      // }else if(num == 1){
      //   this.userService.getReports().subscribe(reports =>{
      //     this.reports= reports;
      //   })
      // }else if(num == 2){
      //   this.userService.getSupports().subscribe(supports =>{
      //     this.supports = supports
      //   })
      // }else if(num == 3){
      //   this.userService.getBans().subscribe(bans =>{
      //     this.bans = bans
      //   })
      // }else if(num == 4){
      //   this.userService.getReturns().subscribe(returns =>{
      //     this.returns = returns
      //   })
      // }
    }
  }
}


