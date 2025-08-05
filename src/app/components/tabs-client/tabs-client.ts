import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ExistingClient } from '../existing-client/existing-client';
import { NonExistingClient } from '../non-existing-client/non-existing-client';

@Component({
  selector: 'app-tabs-client',
  imports: [ExistingClient, NonExistingClient, MatTabsModule],
  templateUrl: './tabs-client.html',
  styleUrl: './tabs-client.scss'
})
export class TabsClient {

}
