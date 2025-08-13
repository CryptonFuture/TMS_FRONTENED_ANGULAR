import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Route {
   private _getRoute = new BehaviorSubject<any[]>([])

    route: Observable<any[]> = this._getRoute.asObservable()

    constructor(private _httpclient: HttpClient) {}

     getRoute(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getRoutes`).pipe(
          switchMap(response => {
            const Route = (response as any).data ?? []
            return of(Route)
          }),
          tap(route => {
            this._getRoute.next(route)
          }),
          catchError((error) => {
            console.error('Error fetching Route', error);
            return throwError(
              () => new Error('Error fetching Route')
            );
          })
        )
    }

    countRoute(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/routeCount`)
    }
}
