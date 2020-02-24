/**
 * Created by Alberto on 2017-01-17.
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
/**
 * PROVIDERS
 */
import { TaskService } from '../../services/task.service';
/**
 * STORE
 */
import * as RouterActions from '../../actions/router';
import { LoadTasksSummaryAction } from '../../actions/tasks';
import * as fromRoot from '../../reducers/index';
import { State } from '../../reducers/index';
/**
 * MODELS
 */
import { ActualTargetCount } from '../../models/plan-actual-target-count';
import { ServerLoadStatus } from '../../models/enums/server-call-status';
import { ClientArea } from '../../models/client-area';
import { Task } from '../../models/task';
import { PlanSummary } from '../../models/plan-summary';
import { TaskBundle } from '../../models/task-bundle';

@Component({
  moduleId: module.id,
  selector: 'tasks-overview-card',
  templateUrl: 'tasks-overview-card.component.html',
  styleUrls: ['tasks-overview-card.component.css'],
})

export class TasksCardComponent implements OnInit, OnDestroy {

  @Input() set currentArea(area: ClientArea) {
    if (area) {
      this.store.dispatch(new LoadTasksSummaryAction(area.rowGuid));
    }
  }

  // ---------------------------------------------------
  nbInProgressTasks: number;
  nbTodoTasks: number;
  nbCompleteTasks: number;
  nbOverdueTasks: number;
  // ---------------------------------------------------


  // ---------------------------------------------------
  // traccPerUserTaskStats: ActionSummaryStats[];
  // summaryStats: ActionSummaryStats;
  actualVsTarget: ActualTargetCount[];
  tasks$: Observable<TaskBundle>;
  learningTasks: Task[];
  // ---------------------------------------------------


  // ---------------------------------------------------
  filtered: ActualTargetCount[];
  filterMonths: number;
  // ---------------------------------------------------


  // ---------------------------------------------------
  // haveData: boolean;

  loadStatus: ServerLoadStatus;
  loadStatusSubscription: Subscription;

  learningLoadStatus: ServerLoadStatus;
  learningloadStatusSubscription: Subscription;

  loadStatusEnum = ServerLoadStatus;

  tasksSummarySubscription: Subscription;
  leSubscription: Subscription;
  // ---------------------------------------------------

  constructor(private store: Store<State>, private taskService: TaskService) {
  }

  ngOnInit() {

    this.learningloadStatusSubscription = this.store.select(fromRoot.getLoadingTaskListFlagQuery).subscribe(loadStatus => this.learningLoadStatus = loadStatus);
    this.loadStatusSubscription = this.store.select(fromRoot.getLoadingTaskSummaryFlagQuery).subscribe(loadStatus => this.loadStatus = loadStatus);


    /**
    * Fetch tasks list and filter workshop tasks...
    */
    this.tasks$ = this.store.select<TaskBundle>(fromRoot.getTaskListQuery);
    this.leSubscription = this.tasks$.pipe(filter(Boolean)).subscribe((leTasks: any) => {
      // console.warn('leTasks ', leTasks);
      this.learningTasks = leTasks.trainingTasks;
    });


    this.tasksSummarySubscription = this.store.select<PlanSummary>(fromRoot.getTasksSummaryQuery)
      .pipe(
        filter(Boolean)
      )
      .subscribe((plansSummary: PlanSummary) => {
        // console.log('Loading plans for dashboard card');
        // console.log('Area mode');
        // console.log(plansSummary);
        this.actualVsTarget = plansSummary.areaSummaryStats.avt;
        // this.summaryStats = plansSummary.areaSummaryStats;
        // this.traccPerUserTaskStats = p.traccs;

        this.nbOverdueTasks = plansSummary.areaSummaryStats.o;
        this.nbTodoTasks = plansSummary.areaSummaryStats.s;
        this.nbCompleteTasks = plansSummary.areaSummaryStats.c;
        this.nbInProgressTasks = plansSummary.areaSummaryStats.i;

        // this.haveData = (plansSummary.areaSummaryStats.c + plansSummary.areaSummaryStats.i + plansSummary.areaSummaryStats.o + plansSummary.areaSummaryStats.u) > 0;

        const avtLength = this.actualVsTarget.length;
        if (avtLength >= 48) {
          this.filter(28);
        } else if (avtLength >= 38) {
          this.filter(22);
        } else if (avtLength >= 32) {
          this.filter(18);
        }
      });
  }



  expandTasks() {
    this.store.dispatch(new RouterActions.Go({ path: ['/tasks'] }));
  }

  filter(noOfMonths: number) {
    this.filterMonths = noOfMonths;
    this.filtered = this.actualVsTarget.slice(-noOfMonths);
  }

  resetFilter() {
    if (this.filtered && this.filterMonths) {
      this.filtered = null;
      this.filterMonths = null;
    }
  }

  ngOnDestroy() {
    this.tasksSummarySubscription.unsubscribe();
    this.leSubscription.unsubscribe();
    this.loadStatusSubscription.unsubscribe();
    this.learningloadStatusSubscription.unsubscribe();
  }

}
