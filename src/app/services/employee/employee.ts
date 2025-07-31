import { Injectable } from '@angular/core';
import { switchMap, tap, pipe, catchError, throwError, BehaviorSubject, Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Employee {
    private _getActiveEmployee = new BehaviorSubject<any[]>([])
    private _getInActiveEmployee = new BehaviorSubject<any[]>([])
    private _getEmyById = new BehaviorSubject<any[]>([])
    private _viewEmpById = new BehaviorSubject<any>({})
    private _countAll = new BehaviorSubject<any>({})
    private _countActiveEmp = new BehaviorSubject<any>({})
    private _countInActiveEmp = new BehaviorSubject<any>({})

    activeEmp: Observable<any[]> = this._getActiveEmployee.asObservable()
    InactiveEmp: Observable<any[]> = this._getInActiveEmployee.asObservable()
    emyById: Observable<any[]> = this._getEmyById.asObservable()
    viewEmyById: Observable<any> = this._viewEmpById.asObservable()
    countEmpAll: Observable<any> = this._countAll.asObservable()
    countActiveEmp: Observable<any> = this._countActiveEmp.asObservable()
    countInActiveEmp: Observable<any> = this._countInActiveEmp.asObservable()

    constructor(private _httpclient: HttpClient) {}


    getActiveEmp(search: string = "", page: number = 1, limit: number = 10, sort: string = 'name:asc'): Observable<any> {
      let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }

       params = params
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('sort', sort)

      return this._httpclient.get(`${environment.baseUrl}/api/v1/getActiveEmp`, {params}).pipe(
        switchMap(response => {
          const ActiveEmp = (response as any).data ?? []
          return of(ActiveEmp)
        }),
        tap(activeEmployee => {
          this._getActiveEmployee.next(activeEmployee)
        }),
        catchError((error) => {
          console.error('Error fetching Active Employee', error);
          return throwError(
            () => new Error('Error fetching Active Employee')
          );
        })
      )
    }

      getInActiveEmp(search: string = "", page: number = 1, limit: number = 10): Observable<any> {
         let params = new HttpParams()

        if(search) {
          params = params.set('search', search)
        }

        params = params
        .set('page', page.toString())
        .set('limit', limit.toString());

        return this._httpclient.get(`${environment.baseUrl}/api/v1/getInActiveEmp`, {params}).pipe(
          switchMap(response => {
            const InActiveEmp = (response as any).data ?? []
            return of(InActiveEmp)
          }),
          tap(InactiveEmployee => {
            this._getInActiveEmployee.next(InactiveEmployee)
          }),
          catchError((error) => {
            console.error('Error fetching In Active Employee', error);
            return throwError(
              () => new Error('Error fetching In Active Employee')
            );
          })
        )
    }

    editEmpById(id: any): Observable<any> {
     return this._httpclient.get(`${environment.baseUrl}/api/v1/editEmpById/${id}`).pipe(
      tap(response => {
        const EmpById = (response as any).data ?? []
        this._getEmyById.next(EmpById)

      }),
      catchError((error) => {
         console.error('Error fetching edit emp id Employee', error);
            return throwError(
              () => new Error('Error fetching edit emp id Employee')
            );
      })
     ) 
    }

    viewEmpById(id: any): Observable<any> {
     return this._httpclient.get(`${environment.baseUrl}/api/v1/viewEmpById/${id}`).pipe(
      tap(response => {
        const ViewEmpById = (response as any).data ?? {}
        this._viewEmpById.next(ViewEmpById)

      }),
      catchError((error) => {
         console.error('Error fetching edit emp id Employee', error);
            return throwError(
              () => new Error('Error fetching edit emp id Employee')
            );
      })
     ) 
    }

    toggleStatus(id: string, active: boolean): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/toggleStatus`, {
        id,
        active
      })
    }

    toggleDeleted(id: string): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/toggleDeleted/${id}`, null)
      
    }


    toggleAdmin(id: string, is_admin: boolean): Observable<any> {
      return this._httpclient.put(`${environment.baseUrl}/api/v1/toggleAdmin`, {
        id,
        is_admin
      })
    }

    deleteEmp(id: string): Observable<any> {
      return this._httpclient.delete(`${environment.baseUrl}/api/v1/deleteEmp/${id}`)
    }

    updateUser(id: any, response: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })
      return this._httpclient.put<any>(`${environment.baseUrl}/api/v1/updateUser/${id}`, response, {headers}).pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(error => {
          return of(error)
        })

      )
    }

    employeeAllCount(): Observable<any> {
       return this._httpclient.get(`${environment.baseUrl}/api/v1/employeeAllCount`)
    }

    
    employeeActiveCount(search: string = ""): Observable<any> {
      let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }
       return this._httpclient.get(`${environment.baseUrl}/api/v1/employeeActiveCount`, {params})
    }

     employeeInActiveCount(search: string = ""): Observable<any> {
      let params = new HttpParams()

      if(search) {
        params = params.set('search', search)
      }
       return this._httpclient.get(`${environment.baseUrl}/api/v1/employeeInActiveCount`, {params})
    }


}
