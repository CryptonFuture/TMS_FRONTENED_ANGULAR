import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-content',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './content.html',
  styleUrl: './content.scss'
})
export class Content {

}
