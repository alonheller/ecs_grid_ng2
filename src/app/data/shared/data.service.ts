import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import { EcsResponse } from './../model/ecsResponse';
import { EcsResponseParsed } from './../model/ecsResponseParsed';
import { Actions } from './../model/actions';

@Injectable()
export class DataService {

  private host: string;

  constructor(private http: Http) {
    this.host = environment.host;
  }

  private addHeaders(data: any): Headers {
    let headers = new Headers();
    headers.append('Action', data.Action);
    headers.append('Content-Type', 'ecs/json');
    headers.append('Accept', 'application/json, text/plain, */*');

    return headers;
  }

  private createRequestObject(action: string, params: any) {
    return { 'Action': action, 'Parameters': params };
  }

  private post(data: any): Observable<Response> {
    return this.http.post(this.host, data, { headers: this.addHeaders(data), withCredentials: true })
      .map((res: EcsResponse) => JSON.parse(res._body));
  }

  login(user: string, password: string): Observable<Response> {
    let data = this.createRequestObject(Actions.LOGIN,
      { 'username': user, 'password': password, 'rememberMe': false });

    return this.post(data)
      .map((res: EcsResponseParsed) => {
        return res;
      })

  }

  getLocationAlarms(locationId: number, showWarnings: boolean): Observable<Array<any>> {
    let data = this.createRequestObject(Actions.GET_LOCATION_ALARMS,
      { locationID: locationId, showWarnings: showWarnings });
    return this.post(data)
      .map((res:any) => res.ReturnValue.$values);
  }

  getLocationRoutersAlarms(locationId: number, openTickets: boolean): Observable<Response> {
    let data = this.createRequestObject(Actions.GET_LOCATION_ROUTERS_ALARMS,
      { locationID: locationId, openTickets: openTickets });
    return this.post(data);
  }

  getUserLocations(): Observable<Response> {
    let data = this.createRequestObject(Actions.GET_USER_LOCATIONS, {});
    return this.post(data);
  }

}
