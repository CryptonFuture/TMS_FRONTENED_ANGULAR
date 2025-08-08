import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EmpAssign {
  private _getEmpAssign = new BehaviorSubject<any[]>([])
  private _viewEmpAssignById = new BehaviorSubject<any[]>([])
  private _editEmpAssignById = new BehaviorSubject<any[]>([])

  empAssign: Observable<any[]> = this._getEmpAssign.asObservable()
  viewEmpAssign: Observable<any[]> = this._viewEmpAssignById.asObservable()
  editEmpAssign: Observable<any[]> = this._editEmpAssignById.asObservable()

  constructor(private _httpclient: HttpClient) { }

  getEmpAssign(): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/getEmpAssign`).pipe(
      switchMap(response => {
        const EmpAssign = (response as any).data ?? []
        return of(EmpAssign)
      }),
      tap(empAssign => {
        this._getEmpAssign.next(empAssign)
      }),
      catchError((error) => {
        console.error('Error fetching Emp Assign', error);
        return throwError(
          () => new Error('Error fetching Emp Assign')
        );
      })
    )
  }

  addEmpAssign(response: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/addEmpAssign`, response, { headers }).pipe(
      tap(response => {
        console.log(response);
      }),
      catchError(error => {
        return of(error)
      })

    )
  }

  deleteEmpAssign(id: string): Observable<any> {
    return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteEmpAssign/${id}`)
  }

  toggleDeleted(id: string): Observable<any> {
    return this._httpclient.put(`${environment.baseUrl}/api/v1/deleteEmpAssigns/${id}`, null)
  }

  viewEmpAssignById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/viewEmpAssignById/${id}`).pipe(
      tap(response => {
        const ViewEmpAssignById = (response as any).data ?? {}
        this._viewEmpAssignById.next(ViewEmpAssignById)

      }),
      catchError((error) => {
        console.error('Error fetching view Emp Assign id', error);
        return throwError(
          () => new Error('Error fetching view Emp Assign id')
        );
      })
    )
  }

  editEmpAssignById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/editEmpAssignyId/${id}`).pipe(
      tap(response => {
        const EdiEmpAssignById = (response as any).data ?? []
        this._editEmpAssignById.next(EdiEmpAssignById)

      }),
      catchError((error) => {
        console.error('Error fetching edit Emp Assign id', error);
        return throwError(
          () => new Error('Error fetching edit Emp Assign id')
        );
      })
    )
  }

  updateEmpAssign(id: any, response: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateEmpAssign/${id}`, response, { headers }).pipe(
      tap(response => {
        console.log(response);
      }),
      catchError(error => {
        return of(error)
      })

    )
  }

  countEmpAssign(): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/empAssignCount`)
  }
}
