import { Injectable } from '@angular/core';
import {Notifications} from "../entities/Notification";


@Injectable({
  providedIn: 'root',
})
export class NotifyService {


  constructor() {
  }

  // notifications!: Notifications[];
  notifications = [
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 1,
      date: '2024-06-20',
      explanation: 'L\'ordine è in fase di elaborazione',
      subject: 'Ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 2,
      date: '2024-06-20',
      explanation: 'L\'ordine è stato spedito all\'indirizzo: Via G.Saragat 35 Spezzano Della Sila (CS)',
      subject: 'Ordine ASGA23DAS4 spedito',
      read: false,
      showDescription: false
    },
    {
      id: 3,
      date: '2024-06-20',
      explanation: 'L\'ordine è in consegna, il corriere sarà da te a breve',
      subject: 'Ordine ASGA23DAS4 in consegna',
      read: false,
      showDescription: false
    },
    {
      id: 4,
      date: '2024-06-20',
      explanation: 'Il reso è stato accettato, riceverai il rimborso entro 48 ore',
      subject: 'Reso su ordine ASGA23DAS4 accettato',
      read: false,
      showDescription: false
    },
    {
      id: 5,
      date: '2024-06-20',
      explanation: 'Ricambia e scopri la sua lista dei desideri!',
      subject: 'L\'utente francuzzu ha iniziato a seguirti',
      read: false,
      showDescription: false
    },
    {
      id: 6,
      date: '2024-06-20',
      explanation: 'Ricambia e scopri cosa desidera più di tutto!',
      subject: 'L\'utente francuzzu ti ha aggiunto agli amici',
      read: false,
      showDescription: false
    },
    {
      id: 7,
      date: '2024-06-20',
      explanation: 'Devi andare nel tuo profilo e cliccare su "modifica password" poi riprova a fare quello che stavi facendo',
      subject: 'La tua richiesta di supporto D3243DS ha ricevuto una risposta',
      read: false,
      showDescription: false
    }
  ];


  markAllNotificationsAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }





}


