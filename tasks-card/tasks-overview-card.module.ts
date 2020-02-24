/**
 * Created by Alberto on 2017-01-19
 */

import { NgModule } from '@angular/core';



import { TasksCardComponent } from './tasks-overview-card.component';

import { SharedModule } from '../../shared/shared.module';
// import { TasksSharedModule } from '../../shared/tasks/tasks-shared.module';

import { TaskProgressChartComponent } from './task-progress-chart.component';



@NgModule({
  imports: [SharedModule],
  declarations: [
    TasksCardComponent,
    TaskProgressChartComponent
  ],
  exports: [TasksCardComponent]
})

export class TasksCardModule {
}
