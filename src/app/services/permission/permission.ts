import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Permission {

  private _getPermission = new BehaviorSubject<any[]>([])
  private _viewPermissionById = new BehaviorSubject<any[]>([])
  private _editPermissionById = new BehaviorSubject<any[]>([])

  permission: Observable<any[]> = this._getPermission.asObservable()
  viewPermission: Observable<any[]> = this._viewPermissionById.asObservable()
  editPermission: Observable<any[]> = this._editPermissionById.asObservable()

  constructor(private _httpclient: HttpClient) { }


  getPermission(): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/getPermission`).pipe(
      switchMap(response => {
        const Permission = (response as any).data ?? []
        return of(Permission)
      }),
      tap(permission => {
        this._getPermission.next(permission)
      }),
      catchError((error) => {
        console.error('Error fetching Permission', error);
        return throwError(
          () => new Error('Error fetching Permission')
        );
      })
    )
  }

  addPermission(response: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/addPermission`, response, { headers }).pipe(
      tap(response => {
        console.log(response);
      }),
      catchError(error => {
        return of(error)
      })

    )
  }

  deletePermission(id: string): Observable<any> {
    return this._httpclient.delete(`${environment.baseUrl}/api/v1/deletePermission/${id}`)
  }

  toggleDeleted(id: string): Observable<any> {
    return this._httpclient.put(`${environment.baseUrl}/api/v1/deletePermissions/${id}`, null)
  }

  viewPermissionById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/viewPermissionById/${id}`).pipe(
      tap(response => {
        const ViewPermissionById = (response as any).data ?? {}
        this._viewPermissionById.next(ViewPermissionById)

      }),
      catchError((error) => {
        console.error('Error fetching view permission id', error);
        return throwError(
          () => new Error('Error fetching view permission id')
        );
      })
    )
  }

  editPermissionById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/editPermissionById/${id}`).pipe(
      tap(response => {
        const EditPermissionById = (response as any).data ?? []
        this._editPermissionById.next(EditPermissionById)

      }),
      catchError((error) => {
        console.error('Error fetching edit permission id', error);
        return throwError(
          () => new Error('Error fetching edit permission id')
        );
      })
    )
  }

  updatePermission(id: any, response: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updatePermission/${id}`, response, { headers }).pipe(
      tap(response => {
        console.log(response);
      }),
      catchError(error => {
        return of(error)
      })

    )
  }

  countPermission(): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/permissionCount`)
  }

}
