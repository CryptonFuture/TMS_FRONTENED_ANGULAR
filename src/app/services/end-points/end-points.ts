import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EndPoints {
    private _getEp = new BehaviorSubject<any[]>([])

    ep: Observable<any[]> = this._getEp.asObservable()

    constructor(private _httpclient: HttpClient) {}

     getEp(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getEp`).pipe(
          switchMap(response => {
            const Ep = (response as any).data ?? []
            return of(Ep)
          }),
          tap(ep => {
            this._getEp.next(ep)
          }),
          catchError((error) => {
            console.error('Error fetching Ep', error);
            return throwError(
              () => new Error('Error fetching Ep')
            );
          })
        )
    }

    countEp(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/ePCount`)
    }
}
