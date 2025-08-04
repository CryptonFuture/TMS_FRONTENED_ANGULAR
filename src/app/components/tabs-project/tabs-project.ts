import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActiveProjectList } from '../project/active-project-list/active-project-list';
import { InactiveProjectList } from '../project/inactive-project-list/inactive-project-list';
import { CompletedProjectList } from '../project/completed-project-list/completed-project-list';
import { PendingProjectList } from '../project/pending-project-list/pending-project-list';
import { RejectProjectList } from '../project/reject-project-list/reject-project-list';

@Component({
  selector: 'app-tabs-project',
  imports: [RejectProjectList, PendingProjectList, ActiveProjectList, CompletedProjectList, MatTabsModule, InactiveProjectList],
  templateUrl: './tabs-project.html',
  styleUrl: './tabs-project.scss'
})
export class TabsProject {

}
