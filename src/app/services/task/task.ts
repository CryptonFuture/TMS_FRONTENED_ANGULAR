import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';
import { AddTask, UpdateTask } from '../../Interface/task/task'

@Injectable({
  providedIn: 'root'
})
export class Task {
    private _getTask = new BehaviorSubject<any[]>([])
    private _viewTaskById = new BehaviorSubject<any[]>([])
    private _ediTaskById = new BehaviorSubject<any[]>([])

    task: Observable<any[]> = this._getTask.asObservable()
    viewTask: Observable<any[]> = this._viewTaskById.asObservable()
    editTask: Observable<any[]> = this._ediTaskById.asObservable()

  constructor(private _httpclient: HttpClient) {}

  getTask(search: any = "", page: any = 1, limit: any = 10, sort: any = 'name:asc', status: any = "", date: any = ""): Observable<any> {
       let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }

      if(status) {
        params = params.set('status', status)
      }

       if(date) {
        params = params.set('date', date)
      }

       params = params
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort)

    return this._httpclient.get(`${environment.baseUrl}/api/v1/getTask`, {params}).pipe(
        switchMap(response => {
          const Task = (response as any).data ?? []
          return of(Task)
        }),
        tap(task => {
          this._getTask.next(task)
        }),
        catchError((error) => {
          console.error('Error fetching Task', error);
          return throwError(
            () => new Error('Error fetching Task')
          );
        })
      )
    }

    addTask(response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/addTask`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    deleteTask(id: string): Observable<any> {
      return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteTask/${id}`)
    }

    toggleDeleted(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/deleteTasks/${id}`, null) 
    }

  viewTaskById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/viewTaskById/${id}`).pipe(
      tap(response => {
        const ViewTaskById = (response as any).data ?? {}
        this._viewTaskById.next(ViewTaskById)

      }),
      catchError((error) => {
        console.error('Error fetching view task id', error);
        return throwError(
          () => new Error('Error fetching view task id')
        );
      })
    )
  }

  editTaskById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/editTaskById/${id}`).pipe(
      tap(response => {
        const EdiTaskById = (response as any).data ?? []
        this._ediTaskById.next(EdiTaskById)

      }),
      catchError((error) => {
        console.error('Error fetching edit task id', error);
        return throwError(
          () => new Error('Error fetching edit task id')
        );
      })
    )
  }

   updateTask(id: any, response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateTask/${id}`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    countTask(search: string = "", status: any = "", date: any = ""): Observable<any> {
       let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }

      if(status) {
        params = params.set('status', status)
      }

       if(date) {
        params = params.set('date', date)
      }
      return this._httpclient.get(`${environment.baseUrl}/api/v1/taskCount`, {params})
    }
}
