import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Resource } from './Resource';
import { Subject, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  subscription: any;
  environment =  new Environment();

  private _search$ = new Subject<void>();
  private _resources$ = new BehaviorSubject<Resource[]>([]);
  constructor(private http: HttpClient) {
  }
  public fetchData() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.subscription = this._search$.pipe(switchMap(() => this._search()),
    ).subscribe(result => {
      this._resources$.next(result);
    });
    this._search$.next();
  }

  get resources$() { return this._resources$.asObservable(); }

  private async getResources(): Promise<Resource[]> {
    return await this.http.get<Resource[]>(this.environment.resourceApiUrl, {responseType: 'json'}).toPromise();
  }
  public async deleteResource(id: number): Promise<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(this.environment.resourceApiUrl + '/' + id, {responseType: 'json'}).toPromise();
  }
  public async editResource(body: Resource): Promise<HttpResponse<string>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.environment.resourceApiUrl + '/' + body.resource_id, body, {responseType: 'json', headers}).toPromise();
  }
  public async addResource(body: Resource): Promise<HttpResponse<string>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<HttpResponse<string>>(this.environment.resourceApiUrl, body, {responseType: 'json', headers}).toPromise();
  }
  private async _search(): Promise<Resource[]> {
    const resources = await this.getResources();
    return resources;
  }
}
