import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TaskAssign {
  private _getTaskAssign = new BehaviorSubject<any[]>([])
  private _viewTaskAssignById = new BehaviorSubject<any[]>([])
  private _editTaskAssignById = new BehaviorSubject<any[]>([])

  taskAssign: Observable<any[]> = this._getTaskAssign.asObservable()
  viewTaskAssign: Observable<any[]> = this._viewTaskAssignById.asObservable()
  editTaskAssign: Observable<any[]> = this._editTaskAssignById.asObservable()

  constructor(private _httpclient: HttpClient) { }

  getTaskAssign(search: any = "", page: any = 1, limit: any = 10): Observable<any> {
     let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }

       params = params
        .set('page', page.toString())
        .set('limit', limit.toString())

    return this._httpclient.get(`${environment.baseUrl}/api/v1/getTaskAssign`, {params}).pipe(
      switchMap(response => {
        const TaskAssign = (response as any).data ?? []
        return of(TaskAssign)
      }),
      tap(taskAssign => {
        this._getTaskAssign.next(taskAssign)
      }),
      catchError((error) => {
        console.error('Error fetching Task Assign', error);
        return throwError(
          () => new Error('Error fetching Task Assign')
        );
      })
    )
  }

  addTaskAssign(response: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/addTaskAssign`, response, { headers }).pipe(
      tap(response => {
        console.log(response);
      }),
      catchError(error => {
        return of(error)
      })

    )
  }

  deleteTaskAssign(id: string): Observable<any> {
    return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteTaskAssign/${id}`)
  }

  toggleDeleted(id: string): Observable<any> {
    return this._httpclient.put(`${environment.baseUrl}/api/v1/deleteTaskAssigns/${id}`, null)
  }

  viewTaskpAssignById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/viewTaskAssignById/${id}`).pipe(
      tap(response => {
        const ViewTaskAssignById = (response as any).data ?? {}
        this._viewTaskAssignById.next(ViewTaskAssignById)

      }),
      catchError((error) => {
        console.error('Error fetching view Task Assign id', error);
        return throwError(
          () => new Error('Error fetching view Task Assign id')
        );
      })
    )
  }

  editTaskAssignById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/editTaskAssignById/${id}`).pipe(
      tap(response => {
        const EdiTaskAssignById = (response as any).data ?? []
        this._editTaskAssignById.next(EdiTaskAssignById)

      }),
      catchError((error) => {
        console.error('Error fetching edit Task Assign id', error);
        return throwError(
          () => new Error('Error fetching edit Task Assign id')
        );
      })
    )
  }

  updateTaskAssign(id: any, response: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateTaskAssign/${id}`, response, { headers }).pipe(
      tap(response => {
        console.log(response);
      }),
      catchError(error => {
        return of(error)
      })

    )
  }

  countTaskAssign(search: string = ""): Observable<any> {
    let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }

    return this._httpclient.get(`${environment.baseUrl}/api/v1/taskAssignCount` , {params})
  }
}
