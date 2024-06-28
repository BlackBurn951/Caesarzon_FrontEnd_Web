import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {PopupService} from "./popUpService";
import {jwtDecode} from "jwt-decode";
import {Notifications} from "../entities/Notification";
import {tap, catchError} from "rxjs/operators";
import {BehaviorSubject, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  private keycloakLogoutUrl = 'http://25.24.244.170:8080/realms/CaesarRealm/protocol/openid-connect/logout';
  private manageNotifyURL = 'http://localhost:8090/notify-api/user/notifications';
  private deleteNotifyURL = 'http://localhost:8090/notify-api/notification';
  private accessTokenUrl = 'http://25.24.244.170:8080/realms/CaesarRealm/protocol/openid-connect/token';

  private ACCESS_TOKEN!: string;
  private REFRESH_TOKEN!: string;

  private isAdmin: boolean = false;
  private isLogged: boolean = false;

  notifications: Notifications[] = [];

  private notifyCountSubject = new BehaviorSubject<number>(0);
  notifyCount$ = this.notifyCountSubject.asObservable()

  constructor(private http: HttpClient, private popUp: PopupService) { }

  //Pulizia delle variabili relative ai token dell'utente
  refreshAuthVariables(){
    this.ACCESS_TOKEN = "";
    this.REFRESH_TOKEN = "";
  }

  //Metodo per ricevere i token da KeyCloak per l'utente
  login(username: string, password: string): void{
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'caesar-app');
    body.set('username', username);
    body.set('password', password);

    this.http.post(this.accessTokenUrl, body.toString(), { headers, withCredentials: true }).subscribe(
      (response:any) => {
        this.setTokens(response.access_token, response.refresh_token);
        if(username != "guest"){
          this.isLogged = true;
          this.setLogin();
          this.popUp.closePopup()
          this.getNotify().subscribe(notifies => {
            this.notifications = notifies;
          })
          this.setAdminStatus(this.ACCESS_TOKEN)
        }
        console.log("TOKEN: " + this.ACCESS_TOKEN);
      },
      (error) => {
        console.error("Error during request:", error);
      }
    );
  }

  getIsAdmin(){
    return this.isAdmin;
  }

  //Metodo per assegnare i token alla cache
  setTokens(accessToken: string, refreshToken: string) {
    this.ACCESS_TOKEN = accessToken;
    this.REFRESH_TOKEN = refreshToken;
    localStorage.setItem('access_token', accessToken);
  }

  setLogin(){
    localStorage.setItem('isLogged', String(this.isLogged));
  }

  //Metodo per prendere i token dalla cache
  getAccessToken() {
    const token = localStorage.getItem('access_token');
    console.log("TOKEN NELLA CACHE: " + token)
    if (token) {
      return token;
    } else {
      return this.ACCESS_TOKEN;
    }
  }

  //Metodo per prendere lo stato di logging dell'utente
  getLoggedStatus(){
    const isLoggedString = localStorage.getItem('isLogged');
    if (isLoggedString) {
      return isLoggedString === 'true';
    } else {
      return this.isLogged;
    }
  }

  //Metodo per assegnare lo stato di login dell'utente
  setLoggedStatus(){
    const isLoggedString = localStorage.getItem('isLogged');
    if (isLoggedString) {
      return isLoggedString === 'false';
    } else {
      return this.isLogged;
    }
  }

  setAdmin(){
    const isAdminString = localStorage.getItem('isAdmin');
    if (isAdminString) {
      return isAdminString === 'false';
    } else {
      return this.isAdmin = true;
    }
  }

  getAdmin(){
    const isAdminString = localStorage.getItem('isAdmin');
    if (isAdminString) {
      return isAdminString === 'true';
    } else {
      return this.isLogged;
    }
  }

  toggleLogin(event: MouseEvent) {
    const params = new HttpParams()
      .set('id_token_hint', this.ACCESS_TOKEN)
      .set('post_logout_redirect_uri', 'http://localhost:4200');

    this.http.get(this.keycloakLogoutUrl, { params }).subscribe({
      next: () => {
        console.log("LOGIN LOGOUT");
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
    this.isLogged = !this.isLogged;
    this.setLogin()
    this.isAdmin = false
    this.setTokens("", "")
    event.preventDefault()
  }

  //Metodo per creare l'header contenente l'access token
  permaHeader(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getAccessToken()
    });
  }

  // Metodo per decodificare il token e impostare lo stato di admin
  setAdminStatus(accessToken: string) {
    try {
      console.log("Decoding access token...");
      const decodedToken: any = jwtDecode(accessToken);
      console.log("Decoded token:", decodedToken);

      let roles: string[] = [];

      // Controllo in realm_access
      if (decodedToken.realm_access && decodedToken.realm_access.roles) {
        roles = roles.concat(decodedToken.realm_access.roles);
        console.log("Roles found in realm_access:", decodedToken.realm_access.roles);
      } else {
        console.warn("No roles found in realm_access.");
      }

      // Controllo in resource_access
      if (decodedToken.resource_access && decodedToken.resource_access["caesar-app"] && decodedToken.resource_access["caesar-app"].roles) {
        roles = roles.concat(decodedToken.resource_access["caesar-app"].roles);
      } else {
        console.warn("No roles found in resource_access['caesar-app'].");
      }

      // Verifica se i ruoli contengono 'admin'
      this.isAdmin = roles.includes('admin');
      console.log("Is admin:", this.isAdmin);

    } catch (error) {
      console.error("Error decoding token:", error);
      this.isAdmin = false;
    }
  }

  getNotify(): Observable<Notifications[]> {
    const headers = this.permaHeader();
    return this.http.get<Notifications[]>(this.manageNotifyURL, { headers }).pipe(
      tap(notifications => {
        this.notifications = notifications;
        this.updateNotifyCount();
      })
    );
  }
  // Metodo per marcare come lette le notifiche
  markRead(): Observable<any> {
    const headers = this.permaHeader();
    if (this.notifications.length > 0) {
      const notificationsToSend = this.notifications.map(({ showDescription, ...rest }) => rest);
      return this.http.put(this.manageNotifyURL, notificationsToSend, { headers, responseType: 'text' }).pipe(
        tap(() => {
          this.notifications.forEach(notification => notification.read = true);
          this.updateNotifyCount();
        }),
        catchError(error => {
          console.error("Error marking notifications as read:", error);
          return throwError(error);
        })
      );
    } else {
      console.warn("No notifications to mark as read");
      return throwError("No notifications to mark as read");
    }
  }

  deleteNotify(notification: Notifications): Observable<any> {
    const headers = this.permaHeader();
    const customURL = `${this.deleteNotifyURL}?notify-id=${notification.id}&isUser=true`;
    return this.http.delete(customURL, { headers, responseType: 'text' }).pipe(
      tap(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.updateNotifyCount();
      }),
      catchError(error => {
        console.error("Error deleting notification:", error);
        return throwError(error);
      })
    );
  }

  private updateNotifyCount(): void {
    const unreadCount = this.notifications.filter(notification => !notification.read).length;
    this.notifyCountSubject.next(unreadCount);
  }


}
