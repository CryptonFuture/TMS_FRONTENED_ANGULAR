import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Project {
    private _getProject = new BehaviorSubject<any[]>([])
    private _viewProjectById = new BehaviorSubject<any[]>([])
    private _editProjectById = new BehaviorSubject<any[]>([])

    project: Observable<any[]> = this._getProject.asObservable()
    viewProject: Observable<any[]> = this._viewProjectById.asObservable()
    editProject: Observable<any[]> = this._editProjectById.asObservable()

    constructor(private _httpclient: HttpClient) {}

    getProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getProject`).pipe(
          switchMap(response => {
            const Project = (response as any).data ?? []
            return of(Project)
          }),
          tap(project => {
            this._getProject.next(project)
          }),
          catchError((error) => {
            console.error('Error fetching Project', error);
            return throwError(
              () => new Error('Error fetching Project')
            );
          })
        )
      }
   

    addProject(response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.post<any>(`${environment.baseUrl}/api/v1/AddProject`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    updateProject(id: any, response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateProject/${id}`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    viewProjectById(id: any): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/viewProjectById/${id}`).pipe(
        tap(response => {
          const ViewProjectById = (response as any).data ?? {}
          this._viewProjectById.next(ViewProjectById)

        }),
        catchError((error) => {
          console.error('Error fetching view project id', error);
          return throwError(
            () => new Error('Error fetching view project id')
          );
        })
      )
  }

  editProjectById(id: any): Observable<any> {
    return this._httpclient.get(`${environment.baseUrl}/api/v1/editProjectById/${id}`).pipe(
      tap(response => {
        const EditProjectById = (response as any).data ?? []
        this._editProjectById.next(EditProjectById)

      }),
      catchError((error) => {
        console.error('Error fetching edit project id', error);
        return throwError(
          () => new Error('Error fetching edit project id')
        );
      })
    )
  }

    deleteProject(id: string): Observable<any> {
      return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteProject/${id}`)
    }

    toggleDeleted(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/deleteProjects/${id}`, null) 
    }

    toggleIsAllow(id: string, allow_for_off_time: boolean): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/toggleIsAllow`, {
        id,
        allow_for_off_time
      })
    }

    countProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/projectCount`)
    }
 }