import { Injectable } from '@angular/core';
import { Environment } from '../environment';
import { Subject, BehaviorSubject } from 'rxjs';
import { Reservation } from './Reservation';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  subscription: any;
  environment =  new Environment();

  private _search$ = new Subject<void>();
  private _reservations$ = new BehaviorSubject<Reservation[]>([]);
  constructor(private http: HttpClient) {
  }
  public fetchData() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.subscription = this._search$.pipe(switchMap(() => this._search()),
    ).subscribe(result => {
      this._reservations$.next(result);
    });
    this._search$.next();
  }

  get reservations$() { return this._reservations$.asObservable(); }

  private async getReservations(): Promise<Reservation[]> {
    return await this.http.get<Reservation[]>(this.environment.reservationApiUrl, {responseType: 'json'}).toPromise();
  }
  public async deleteReservation(id: number): Promise<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(this.environment.reservationApiUrl + '/' + id, {responseType: 'json'}).toPromise();
  }
  public async editReservation(body: Reservation): Promise<HttpResponse<string>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>
    (this.environment.reservationApiUrl + '/' + body.reservation_id, body, {responseType: 'json', headers}).toPromise();
  }
  public async addReservation(body: Reservation): Promise<HttpResponse<string>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponse<string>>(this.environment.reservationApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  private async _search(): Promise<Reservation[]> {
    const reservations = await this.getReservations();
    return reservations;
  }
}
