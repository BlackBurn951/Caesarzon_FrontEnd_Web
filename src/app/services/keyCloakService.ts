import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PopupService} from "./popUpService";
import {jwtDecode} from "jwt-decode";
import {Notifications} from "../entities/Notification";
import {tap, catchError} from "rxjs/operators";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {Logout} from "../entities/Logout";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {
  private manageNotifyURL = 'http://localhost:8090/notify-api/user/notifications';
  private manageNotifyAdminURL = 'http://localhost:8090/notify-api/admin/notifications';
  private deleteNotifyURL = 'http://localhost:8090/notify-api/notification';
  private accessTokenUrl = 'http://25.24.244.170:8080/realms/CaesarRealm/protocol/openid-connect/token';
  private logoutURL = 'http://localhost:8090/user-api/logout';

  private ACCESS_TOKEN!: string;
  private REFRESH_TOKEN!: string;
  loading: boolean = false;

  private nomeUtente!: string;
  private cognomeUtente!: string;

  private username: string = ""
  private isAdmin!: boolean;
  private isLogged!: boolean;
  menuOpen = false;

  notifications: Notifications[] = [];

  private notifyCountSubject = new BehaviorSubject<number>(0);
  notifyCount$ = this.notifyCountSubject.asObservable()

  constructor(private router: Router, private http: HttpClient, private popUp: PopupService) { }

  //Pulizia delle variabili relative ai token dell'utente
  refreshAuthVariables(){
    this.ACCESS_TOKEN = "";
    this.REFRESH_TOKEN = "";
  }

  setNomeUtente(nome: string): void {
    this.nomeUtente = nome
  }

  setCognomeNomeUtente(cognome: string){
    this.cognomeUtente = cognome
  }

  getNomeUtente(){
    return this.nomeUtente
  }

  getCognomeNomeUtente(){
    return this.cognomeUtente
  }

  //Metodo per ricevere i token da KeyCloak per l'utente
  login(username: string, password: string): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'caesar-app');
    body.set('username', username);
    body.set('password', password);

    this.http.post(this.accessTokenUrl, body.toString(), { headers, withCredentials: true }).subscribe(
      (response: any) => {
        this.setTokens(response.access_token, response.refresh_token);
        this.saveUsernameToCache(username);

        if (username != "Guest") {
          this.isLogged = true;
          this.setLogin();
          this.saveUsernameToCache(username);
          this.popUp.closePopup();
          this.setAdminStatus(this.ACCESS_TOKEN);
          this.getNotify().subscribe(notifies => {
            this.notifications = notifies;
          });

          this.startExpirationTimer(60 * 60 * 1000);

          this.startTokenRefreshTimer();
        }
      },
      (error) => {
        this.popUp.updateStringa("Username o password errati. Riprova");
        this.popUp.openPopups(234, true);

        console.error("Error during request:", error);
      }
    );
  }


  getUsernameFromCache(): string | null {
    const cachedUsername = localStorage.getItem('username');
    if (cachedUsername) {
      this.username = cachedUsername;
      return cachedUsername;
    }
    return this.username;
  }

  getUsername() {
    return this.getUsernameFromCache() || this.username;
  }


  //Metodo per assegnare i token alla cache
  setTokens(accessToken: string, refreshToken: string) {
    this.ACCESS_TOKEN = accessToken;
    this.REFRESH_TOKEN = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  saveUsernameToCache(username: string): void {
    localStorage.setItem('username', username);
    this.username = username;
  }


  setLogin(){
    localStorage.setItem('isLogged', String(this.isLogged));
  }

  //Metodo per prendere i token dalla cache
  getAccessToken() {
    const token = localStorage.getItem('access_token');
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





  toggleLogin(){

    const logout: Logout ={
      logout: true
    }

    const headers = this.permaHeader()
    return this.http.put<string>(this.logoutURL, logout, { headers, responseType: 'text' as 'json' }).subscribe( response=>{
        if(response === "Logout avvenuto con successo!"){
          this.notifications = [];
          this.clearCache()
          this.refreshAuthVariables();
          this.login("Guest","Mascalzone1");
          this.router.navigate(['']);

        }else{

        }
      }
    )
  }

  clearCache(): void {
    this.nomeUtente = "";
    this.cognomeUtente = "";
    this.username = "";
    this.isAdmin = false;
    this.isLogged = false;
    this.notifications = [];
    this.refreshAuthVariables()
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLogged');
    localStorage.removeItem('isAdmin');

    this.notifyCountSubject.next(0);
  }



  //Metodo per creare l'header contenente l'access token
  permaHeader(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getAccessToken()
    });
  }

  refreshToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', 'caesar-app');
    body.set('refresh_token', this.REFRESH_TOKEN);

    return this.http.post(this.accessTokenUrl, body.toString(), { headers }).pipe(
      tap((response: any) => {
        this.setTokens(response.access_token, response.refresh_token);
      }),
      catchError((error) => {
        console.error('Error during token refresh:', error);
        this.toggleLogin(); // Considera di fare il logout se il refresh fallisce
        return throwError(error);
      })
    );
  }

  private startTokenRefreshTimer() {
    const refreshInterval = 14 * 60 * 1000; // 30 minuti in millisecondi, puoi modificare l'intervallo a seconda delle tue esigenze

    setInterval(() => {
      this.refreshToken().subscribe(
        () => {
        },
        (error) => {
        }
      );
    }, refreshInterval);
  }

  private expirationTimeout: any;

  startExpirationTimer(duration: number) {
    this.clearExpirationTimer();
    this.expirationTimeout = setTimeout(() => {
      this.clearCache();
    }, duration);
  }

  clearExpirationTimer() {
    if (this.expirationTimeout) {
      clearTimeout(this.expirationTimeout);
      this.expirationTimeout = null;
    }
  }



  // Metodo per decodificare il token e impostare lo stato di admin
  setAdminStatus(accessToken: string) {
    try {
      const decodedToken: any = jwtDecode(accessToken);
      let roles: string[] = [];

      if (decodedToken.realm_access && decodedToken.realm_access.roles) {
        roles = roles.concat(decodedToken.realm_access.roles);
      }
      if (decodedToken.resource_access && decodedToken.resource_access["caesar-app"] && decodedToken.resource_access["caesar-app"].roles) {
        roles = roles.concat(decodedToken.resource_access["caesar-app"].roles);
      }

      this.isAdmin = roles.includes('admin');
      localStorage.setItem('isAdmin', String(this.isAdmin));  // Salva in localStorage

    } catch (error) {
      this.isAdmin = false;
      localStorage.setItem('isAdmin', 'false');  // Salva anche in caso di errore
    }
  }

  getAdmin(): boolean {
    const isAdminString = localStorage.getItem('isAdmin');
    if (isAdminString) {
      this.isAdmin = isAdminString === 'true';
      return this.isAdmin;
    } else {
      return false;
    }
  }



  getNotify(): Observable<Notifications[]> {
    const headers = this.permaHeader();
    let url;
    if(this.isAdmin){
      url = this.manageNotifyAdminURL;
    }else{
      url = this.manageNotifyURL
    }
    return this.http.get<Notifications[]>(url, { headers }).pipe(
      tap(notifications => {
        this.notifications = notifications;
        this.updateNotifyCount();
      })
    );
  }
  // Metodo per marcare come lette le notifiche
  markRead(): Observable<any> {
    const headers = this.permaHeader();
    if (this.notifications && this.notifications.length > 0) {
      const notificationsToSend = this.notifications.map(({ showDescription, ...rest }) => rest);
      let url
      if(this.isAdmin){
        url = this.manageNotifyAdminURL;
      }else{
        url = this.manageNotifyURL
      }
      return this.http.put(url, notificationsToSend, { headers, responseType: 'text' }).pipe(
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

    const customURL = `${this.deleteNotifyURL}?notify-id=${notification.id}&isUser=${!this.isAdmin}`;


    return this.http.delete(customURL, { headers, responseType: 'text' }).pipe(
      tap(() => {
        if(this.notifications.length > 0){
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.updateNotifyCount();
        }

      }),
      catchError(error => {
        console.error("Error deleting notification:", error);
        return throwError(error);
      })
    );
  }

  private updateNotifyCount(): void {
    if(this.notifications && this.notifications.length > 0) {
      const unreadCount = this.notifications.filter(notification => !notification.read).length;
      this.notifyCountSubject.next(unreadCount);
    }

  }


}
