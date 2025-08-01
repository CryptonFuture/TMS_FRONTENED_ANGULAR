import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { takeUntil, Subject, forkJoin, retry, catchError, of } from 'rxjs'
import { Employee } from '../../services/employee/employee';
import { Task } from '../../services/task/task';
import { Project } from '../../services/project/project';

@Component({
  selector: 'app-content',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './content.html',
  styleUrl: './content.scss'
})
export class Content implements OnDestroy, OnInit {
  countAll: any
  activeCount: any
  inActiveCount: any
  taskCount: any
  projectCount: any
  private destroy$ = new Subject<void>();

  constructor(private _projService: Project, private _taskService: Task, private cdr: ChangeDetectorRef, private _empServices: Employee) {}

  ngOnInit(): void {
    this.count()
  }

  count(): void {
    forkJoin([
      this._empServices.employeeAllCount().pipe(retry(3), catchError(err => of(null))),
      this._empServices.employeeActiveCount().pipe(retry(3), catchError(err => of(null))),
      this._empServices.employeeInActiveCount().pipe(retry(3), catchError(err => of(null))),
      this._taskService.countTask().pipe(retry(3), catchError(err => of(null))),
      this._projService.countProject().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      allcount,
      activecount,
      inactivecount,
      taskcount,
      projcount
    ]) => {
      this.countAll = allcount.count
      this.activeCount = activecount.count
      this.inActiveCount = inactivecount.count
      this.taskCount = taskcount.count
      this.projectCount = projcount.count
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
  
}
