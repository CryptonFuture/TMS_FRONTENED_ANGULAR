import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, MatTooltipModule, MatMenuModule, MatSidenavModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatGridListModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  isDrawerOpen = true;

  constructor(private _router: Router) {}

  submit(): void {
    this._router.navigate(['dashboard'])
  }
}
