import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DesDep {
  private _getdesDep = new BehaviorSubject<any[]>([])

  desDep: Observable<any[]> = this._getdesDep.asObservable()

  constructor(private _httpclient: HttpClient) {}

   getDesDep(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getDesDep`).pipe(
        switchMap(response => {
          const DesDep = (response as any).data ?? []
          return of(DesDep)
        }),
        tap(desDep => {
          this._getdesDep.next(desDep)
        }),
        catchError((error) => {
          console.error('Error fetching Des Dep', error);
          return throwError(
            () => new Error('Error fetching Des Dep')
          );
        })
      )
    }
}
