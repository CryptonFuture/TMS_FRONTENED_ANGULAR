import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserLogs {
    private _getUserLogs = new BehaviorSubject<any[]>([])

    logs: Observable<any[]> = this._getUserLogs.asObservable()

    constructor(private _httpclient: HttpClient) {}

     getLogs(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getLogs`).pipe(
          switchMap(response => {
            const Logs = (response as any).data ?? []
            return of(Logs)
          }),
          tap(logs => {
            this._getUserLogs.next(logs)
          }),
          catchError((error) => {
            console.error('Error fetching Logs', error);
            return throwError(
              () => new Error('Error fetching Logs')
            );
          })
        )
    }

    countLogs(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/logsCount`)
    }
}
