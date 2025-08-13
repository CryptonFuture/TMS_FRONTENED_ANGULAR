import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Role {

   private _getRoleLogs = new BehaviorSubject<any[]>([])

    role: Observable<any[]> = this._getRoleLogs.asObservable()

    constructor(private _httpclient: HttpClient) {}

     getRoles(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getRoles`).pipe(
          switchMap(response => {
            const Role = (response as any).data ?? []
            return of(Role)
          }),
          tap(role => {
            this._getRoleLogs.next(role)
          }),
          catchError((error) => {
            console.error('Error fetching Role', error);
            return throwError(
              () => new Error('Error fetching Role')
            );
          })
        )
    }
  
}
