import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Project {
    private _getProject = new BehaviorSubject<any[]>([])
    private _getActiveProject = new BehaviorSubject<any[]>([])
    private _getInActiveProject = new BehaviorSubject<any[]>([])
    private _getCompletedProject = new BehaviorSubject<any[]>([])
    private _getPendingProject = new BehaviorSubject<any[]>([])
    private _getRejectProject = new BehaviorSubject<any[]>([])

    private _viewProjectById = new BehaviorSubject<any[]>([])
    private _editProjectById = new BehaviorSubject<any[]>([])
    private _projectStatus = new BehaviorSubject<any[]>([])

    project: Observable<any[]> = this._getProject.asObservable()
    ActiveProject: Observable<any[]> = this._getActiveProject.asObservable()
    InActiveProject: Observable<any[]> = this._getInActiveProject.asObservable()
    CompletedProject: Observable<any[]> = this._getCompletedProject.asObservable()
    PendingProject: Observable<any[]> = this._getPendingProject.asObservable()
    RejectProject: Observable<any[]> = this._getRejectProject.asObservable()

    viewProject: Observable<any[]> = this._viewProjectById.asObservable()
    editProject: Observable<any[]> = this._editProjectById.asObservable()
    projStatus: Observable<any[]> = this._projectStatus.asObservable()

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

      getActiveProject(): Observable<any> {
        return this._httpclient.get(`${environment.baseUrl}/api/v1/getActiveProject`).pipe(
            switchMap(response => {
              const ActiveProject = (response as any).data ?? []
              return of(ActiveProject)
            }),
            tap(activeProject => {
              this._getActiveProject.next(activeProject)
            }),
            catchError((error) => {
              console.error('Error fetching Active Project', error);
              return throwError(
                () => new Error('Error fetching Active Project')
              );
            })
          )
      }

      getInActiveProject(): Observable<any> {
          return this._httpclient.get(`${environment.baseUrl}/api/v1/getInActiveProject`).pipe(
              switchMap(response => {
                const InActiveProject = (response as any).data ?? []
                return of(InActiveProject)
              }),
              tap(InActiveProject => {
                this._getInActiveProject.next(InActiveProject)
              }),
              catchError((error) => {
                console.error('Error fetching In Active Project', error);
                return throwError(
                  () => new Error('Error fetching In Active Project')
                );
              })
            )
      }

      getCompletedProject(): Observable<any> {
          return this._httpclient.get(`${environment.baseUrl}/api/v1/getCompletedProject`).pipe(
              switchMap(response => {
                const CompletedProject = (response as any).data ?? []
                return of(CompletedProject)
              }),
              tap(completedProject => {
                this._getCompletedProject.next(completedProject)
              }),
              catchError((error) => {
                console.error('Error fetching Completed Project', error);
                return throwError(
                  () => new Error('Error fetching Completed Project')
                );
              })
            )
      }

       getPendingProject(): Observable<any> {
          return this._httpclient.get(`${environment.baseUrl}/api/v1/getPendingProject`).pipe(
              switchMap(response => {
                const PendingProject = (response as any).data ?? []
                return of(PendingProject)
              }),
              tap(pendingProject => {
                this._getPendingProject.next(pendingProject)
              }),
              catchError((error) => {
                console.error('Error fetching Pending Project', error);
                return throwError(
                  () => new Error('Error fetching Pending Project')
                );
              })
            )
      }

       getRejectProject(): Observable<any> {
          return this._httpclient.get(`${environment.baseUrl}/api/v1/getRejectProject`).pipe(
              switchMap(response => {
                const RejectProject = (response as any).data ?? []
                return of(RejectProject)
              }),
              tap(rejectProject => {
                this._getRejectProject.next(rejectProject)
              }),
              catchError((error) => {
                console.error('Error fetching Reject Project', error);
                return throwError(
                  () => new Error('Error fetching Reject Project')
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

    projectActive(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/activeProject/${id}`, null) 
    }

    projectInActive(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/InactiveProject/${id}`, null) 
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

     activeCountProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/projectActiveCount`)
    }

     InActiveCountProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/projectInActiveCount`)
    }

     CompletedCountProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/projectCompletedCount`)
    }

     PendingCountProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/projectPendingCount`)
    }

     RejectedCountProject(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/projectRejectCount`)
    }

    projectStatus(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getProjectStatus`).pipe(
         switchMap(response => {
            const ProjectStatus = (response as any).data ?? []
            return of(ProjectStatus)
          }),
          tap(projectStatus => {
            this._projectStatus.next(projectStatus)
          }),
          catchError((error) => {
            console.error('Error fetching Project Status', error);
            return throwError(
              () => new Error('Error fetching Project Status')
            );
          })
      )
    }
 }