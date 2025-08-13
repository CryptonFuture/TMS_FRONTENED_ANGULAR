import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class User {
    constructor(private _httpclient: HttpClient) {}

    isLoggedInNot(): any {
      const token = localStorage.getItem('accessToken')
      !token
    }

     isLoggedIn(): any {
      const token = localStorage.getItem('accessToken')
      token
    }

    set accessToken(accessToken: string) {
      localStorage.setItem('accessToken', accessToken)
    }

    get accessToken(): string {
      return localStorage.getItem('accessToken') ?? ''
    }

    set id(id: string) {
      localStorage.setItem('id', id)
    }

    get id(): string {
      return localStorage.getItem('id') ?? ''
    }

    set email(email: string) {
      localStorage.setItem('email', email)
    }

    get email(): string {
      return localStorage.getItem('email') ?? ''
    }

    set tokenType(tokenType: string) {
      localStorage.setItem('tokenType', tokenType)
    }

    get tokenType(): string {
      return localStorage.getItem('tokenType') ?? ''
    }

    set role(role: string) {
      localStorage.setItem('role', role)
    }

    get role(): string {
      return localStorage.getItem('role') ?? ''
    }

     set name(name: string) {
      localStorage.setItem('name', name)
    }

    get name(): string {
      return localStorage.getItem('name') ?? ''
    }

    
    login(credentials: {email: string, password: string}): Observable<any> {
      return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/login`, credentials).pipe(
        tap(response => {
          console.log(response);
          this.accessToken = response.accessToken
          this.id = response.user.id
          this.email = response.user.email
          this.tokenType = response.user.tokenType
          this.role = response.user.role,
          this.name = response.user.name
        }),
        catchError(error => {
          return of(error)
        })
      )
    }

    register(response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/register`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    logout(id: string): Observable<any> {
      return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/logout?id=${id}`, null).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })
      )
    }
}
