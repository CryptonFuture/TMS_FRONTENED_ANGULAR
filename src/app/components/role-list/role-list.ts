import  { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select';
import { Route } from '../../services/route/route';
import { catchError, forkJoin, of, retry, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-list',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatFormField, MatTreeModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleList implements OnInit, OnDestroy {

  columnsToDisplay = ['name', 'route', 'role', 'description'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null;

  isExpanded(element: any) {
    return this.expandedElement === element;
  }

  toggle(element: any) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  private destroy$ = new Subject<void>();
  
  route: any[] = []
  countRoute: any
  constructor(private cdr: ChangeDetectorRef, private _routeServices: Route) {}

  ngOnInit(): void {
    this.getRouteRole()
  }

  getRouteRole(): void {
    forkJoin([
      this._routeServices.getRoute().pipe(retry(3), catchError(err => of(null))),
      this._routeServices.countRoute().pipe(retry(3), catchError(err => of(null)))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([
      routes,
      routeCount
    ]) => {
      this.route = routes
      this.countRoute = routeCount.count
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}



