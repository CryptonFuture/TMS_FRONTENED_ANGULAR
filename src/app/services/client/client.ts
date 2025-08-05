import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Client {

    private _getClient = new BehaviorSubject<any[]>([])
    private _getExistingClient = new BehaviorSubject<any[]>([])
    private _getNonExistingClient = new BehaviorSubject<any[]>([])
    
    private _viewClientById = new BehaviorSubject<any[]>([])
    private _editClientById = new BehaviorSubject<any[]>([])

    client: Observable<any[]> = this._getClient.asObservable()
    ExistingClient: Observable<any[]> = this._getExistingClient.asObservable()
    NonExistingClient: Observable<any[]> = this._getNonExistingClient.asObservable()

    viewClient: Observable<any[]> = this._viewClientById.asObservable()
    editClient: Observable<any[]> = this._editClientById.asObservable()

    constructor(private _httpclient: HttpClient) {}

    getClient(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getClient`).pipe(
          switchMap(response => {
            const Client = (response as any).data ?? []
            return of(Client)
          }),
          tap(client => {
            this._getClient.next(client)
          }),
          catchError((error) => {
            console.error('Error fetching Client', error);
            return throwError(
              () => new Error('Error fetching Client')
            );
          })
        )
    }

    getExistingClient(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getExistingClient`).pipe(
          switchMap(response => {
            const ExistingClient = (response as any).data ?? []
            return of(ExistingClient)
          }),
          tap(existingClient => {
            this._getExistingClient.next(existingClient)
          }),
          catchError((error) => {
            console.error('Error fetching Existing Client', error);
            return throwError(
              () => new Error('Error fetching Existing Client')
            );
          })
        )
    }

    getNonExistingClient(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getNonExistingClient`).pipe(
          switchMap(response => {
            const NonExistingClient = (response as any).data ?? []
            return of(NonExistingClient)
          }),
          tap(nonExistingClient => {
            this._getNonExistingClient.next(nonExistingClient)
          }),
          catchError((error) => {
            console.error('Error fetching Non Existing Client', error);
            return throwError(
              () => new Error('Error fetching Non Existing Client')
            );
          })
        )
    }

     addClient(response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/AddClient`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    updateClient(id: any, response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateClient/${id}`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    viewClientById(id: any): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/viewClientById/${id}`).pipe(
        tap(response => {
          const ViewClientById = (response as any).data ?? {}
          this._viewClientById.next(ViewClientById)

        }),
        catchError((error) => {
          console.error('Error fetching view client id', error);
          return throwError(
            () => new Error('Error fetching view client id')
          );
        })
      )
  }

  editClientById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/editClientById/${id}`).pipe(
      tap(response => {
        const EditClientById = (response as any).data ?? []
        this._editClientById.next(EditClientById)

      }),
      catchError((error) => {
        console.error('Error fetching edit client id', error);
        return throwError(
          () => new Error('Error fetching edit client id')
        );
      })
    )
  }

    deleteClient(id: string): Observable<any> {
      return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteClient/${id}`)
    }

    toggleDeleted(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/deleteClients/${id}`, null) 
    }

    countClient(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/clientCount`)
    }

    countExistingClient(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/existingClientCount`)
    }

    countNonExistingClient(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/NonExistingClientCount`)
    }


  
}
