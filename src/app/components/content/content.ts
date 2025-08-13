import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { takeUntil, Subject, forkJoin, retry, catchError, of } from 'rxjs'
import { Employee } from '../../services/employee/employee';
import { Task } from '../../services/task/task';
import { Project } from '../../services/project/project';
import { Client } from '../../services/client/client';
import { EmpAlloc } from '../../services/emp-alloc/emp-alloc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './content.html',
  styleUrl: './content.scss'
})
export class Content implements OnDestroy, OnInit {
  countAll: any
  activeCount: any
  inActiveCount: any
  taskCount: any
  projectCount: any
  projectActiveCount: any
  projectInActiveCount: any
  projectCompletedCount: any
  projectPendingCount: any
  projectRejectedCount: any
  clientCount: any
  clientExistCount: any
  clientNonExistCount: any
  assignEmployeeCount: any
  UnAssignEmployeeCount: any
  currentUserRole: any = 0

  private destroy$ = new Subject<void>();

  constructor(private _empAllocService: EmpAlloc, private _clientService: Client, private _projService: Project, private _taskService: Task, private cdr: ChangeDetectorRef, private _empServices: Employee) {}

  ngOnInit(): void {
    this.count()

    const role = JSON.parse(localStorage.getItem('role') || '{}')
    this.currentUserRole = role
  }

  count(): void {
    forkJoin([
      this._empServices.employeeAllCount().pipe(retry(3), catchError(err => of(null))),
      this._empServices.employeeActiveCount().pipe(retry(3), catchError(err => of(null))),
      this._empServices.employeeInActiveCount().pipe(retry(3), catchError(err => of(null))),
      this._taskService.countTask().pipe(retry(3), catchError(err => of(null))),
      this._projService.countProject().pipe(retry(3), catchError(err => of(null))),
      this._projService.activeCountProject().pipe(retry(3), catchError(err => of(null))),
      this._projService.InActiveCountProject().pipe(retry(3), catchError(err => of(null))),
      this._projService.CompletedCountProject().pipe(retry(3), catchError(err => of(null))),
      this._projService.PendingCountProject().pipe(retry(3), catchError(err => of(null))),
      this._projService.RejectedCountProject().pipe(retry(3), catchError(err => of(null))),
      this._clientService.countClient().pipe(retry(3), catchError(err => of(null))),
      this._clientService.countExistingClient().pipe(retry(3), catchError(err => of(null))),
      this._clientService.countNonExistingClient().pipe(retry(3), catchError(err => of(null))),
      this._empAllocService.assignEmpToClientCount().pipe(retry(3), catchError(err => of(null))),
      this._empAllocService.unAssignEmpToClientCount().pipe(retry(3), catchError(err => of(null)))

    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      allcount,
      activecount,
      inactivecount,
      taskcount,
      projcount,
      projActiveCount,
      projInActiveCount,
      projCompletedCount,
      projPendingCount,
      projRejectedCount,
      clieCount,
      clieExistCount,
      clieNonExistCount,
      assignEmpCount,
      UnAssignEmpCount
    ]) => {
      this.countAll = allcount.count
      this.activeCount = activecount.count
      this.inActiveCount = inactivecount.count
      this.taskCount = taskcount.count
      this.projectCount = projcount.count
      this.projectActiveCount = projActiveCount.count
      this.projectInActiveCount = projInActiveCount.count
      this.projectCompletedCount = projCompletedCount.count
      this.projectPendingCount = projPendingCount.count
      this.projectRejectedCount = projRejectedCount.count
      this.clientCount = clieCount.count
      this.clientExistCount = clieExistCount.count
      this.clientNonExistCount = clieNonExistCount.count,
      this.assignEmployeeCount = assignEmpCount.count,
      this.UnAssignEmployeeCount = UnAssignEmpCount.count
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
  
}
