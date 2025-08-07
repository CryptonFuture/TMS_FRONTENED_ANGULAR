import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EmpAlloc {
    private _getAssignToClientEmp = new BehaviorSubject<any[]>([])
    private _getAssignEmp = new BehaviorSubject<any[]>([])
    private _getUnAssignEmp = new BehaviorSubject<any[]>([])
    private _editAllocEmpById = new BehaviorSubject<any[]>([])
    private _viewAllocEmpById = new BehaviorSubject<any>({})

    AssignToClientEmp: Observable<any[]> = this._getAssignToClientEmp.asObservable()
    AssignEmp: Observable<any[]> = this._getAssignEmp.asObservable()
    UnAssignEmp: Observable<any[]> = this._getUnAssignEmp.asObservable()
    allocEditById: Observable<any[]> = this._editAllocEmpById.asObservable()
    allocViewById: Observable<any> = this._viewAllocEmpById.asObservable()

    constructor(private _httpclient: HttpClient) {}

    getAssignToClientEmp(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getAssignToClientEmp`).pipe(
          switchMap(response => {
            const AssignToClientEmp = (response as any).data ?? []
            return of(AssignToClientEmp)
          }),
          tap(assignToClientEmp => {
            this._getAssignToClientEmp.next(assignToClientEmp)
          }),
          catchError((error) => {
            console.error('Error fetching Assign Emp To Client', error);
            return throwError(
              () => new Error('Error fetching Assign Emp To Client')
            );
          })
        )
    }

    getUnAssignToClientEmp(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getUnAssignToClientEmp`).pipe(
          switchMap(response => {
            const UnAssignToClientEmp = (response as any).data ?? []
            return of(UnAssignToClientEmp)
          }),
          tap(unAssignToClientEmp => {
            this._getAssignToClientEmp.next(unAssignToClientEmp)
          }),
          catchError((error) => {
            console.error('Error fetching UnAssign Emp To Client', error);
            return throwError(
              () => new Error('Error fetching UnAssign Emp To Client')
            );
          })
        )
    }

    getAssignEmp(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getAssignEmp`).pipe(
          switchMap(response => {
            const AssignEmp = (response as any).data ?? []
            return of(AssignEmp)
          }),
          tap(assignEmp => {
            this._getAssignEmp.next(assignEmp)
          }),
          catchError((error) => {
            console.error('Error fetching Assign Emp', error);
            return throwError(
              () => new Error('Error fetching Assign Emp')
            );
          })
        )
    }

    getUnAssignEmp(): Observable<any> {
      return this._httpclient.get(`${environment.baseUrl}/api/v1/getUnAssignEmp`).pipe(
          switchMap(response => {
            const UnAssignEmp = (response as any).data ?? []
            return of(UnAssignEmp)
          }),
          tap(unAssignEmp => {
            this._getUnAssignEmp.next(unAssignEmp)
          }),
          catchError((error) => {
            console.error('Error fetching UnAssign Emp', error);
            return throwError(
              () => new Error('Error fetching UnAssign Emp')
            );
          })
        )
    }

    editAllocEmpById(id: any): Observable<any> {
     return this._httpclient.get(`${environment.baseUrl}/api/v1/editAllocEmpById/${id}`).pipe(
      tap(response => {
        const EditAllocEmpById = (response as any).data ?? []
        this._editAllocEmpById.next(EditAllocEmpById)

      }),
      catchError((error) => {
         console.error('Error fetching edit emp Alloc id Employee', error);
            return throwError(
              () => new Error('Error fetching edit emp Alloc id Employee')
            );
      })
     ) 
    }

    viewAllocEmpById(id: any): Observable<any> {
     return this._httpclient.get(`${environment.baseUrl}/api/v1/viewAllocEmpById/${id}`).pipe(
      tap(response => {
        const ViewAllocEmpById = (response as any).data ?? {}
        this._viewAllocEmpById.next(ViewAllocEmpById)

      }),
      catchError((error) => {
         console.error('Error fetching view alloc emp id Employee', error);
            return throwError(
              () => new Error('Error fetching view alloc emp id Employee')
            );
      })
     ) 
    }

    toggleDeleted(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/deleteAllocEmp/${id}`, null)
      
    }

    deleteAllocEmp(id: string): Observable<any> {
      return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteAllocationEmp/${id}`)
    }

    updateAllocEmp(id: any, response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateAllocEmp/${id}`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    assignEmpToClientCount(): Observable<any> {
       return this._httpclient.get(`${environment.baseUrl}/api/v1/assignEmpToClientCount`)
    }

    unAssignEmpToClientCount(): Observable<any> {
       return this._httpclient.get(`${environment.baseUrl}/api/v1/unAssignEmpToClientCount`)
    }

    assignAllocEmpCount(): Observable<any> {
       return this._httpclient.get(`${environment.baseUrl}/api/v1/assignEmpCount`)
    }

    unAssignAllocEmpCount(): Observable<any> {
       return this._httpclient.get(`${environment.baseUrl}/api/v1/unAssignEmpCount`)
    }

}
