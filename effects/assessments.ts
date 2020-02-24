import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as assessments from '../actions/assessments';
import {
  ActionTypes,
  AssessmentLoadedAction,
  AssessmentsLoadedAction,
  MaturityDataLoadedAction,
  PlanSummaryLoadedAction
} from '../actions/assessments';
import { TraccDataService } from '../maturity/traccdata.service';
import { PlansDataService } from '../plans/plans-data.service';
import { PlanSummary } from '../models/plan-summary';
import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../reducers/index';
import { MaturityBundle } from '../models/maturity-bundle';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class AssessmentEffects {

  /**
   *  storing hashes here, so it won't make things complicated in component...
   */
  maturityDataHash: number;
  planSummaryHash: number;

  maturityItemType: string; // e.g. 'tracc', 'theme'
  maturityStage: number; // e.g. 'tracc', 'theme'
  plansSummaryType: string; // e.g. 'tracc', 'action', 'step'

  areaGuidFromMaturity: string; // areaGuid related to the plan data in the store
  areaGuidFromPlans: string; // areaGuid related to the plan data in the store
  plansTraccId: number; // areaGuid related to the plan data in the store

  @Effect()
  loadMaturityData$: Observable<MaturityDataLoadedAction> = this.actions$.pipe(
    ofType(ActionTypes.LOAD_MATURITY_DATA),
    tap((action: assessments.LoadMaturityDataAction) => {
      if ((this.maturityItemType && action.payload.itemType !== 'theme' && this.maturityItemType === action.payload.itemType) && (this.areaGuidFromMaturity && this.areaGuidFromMaturity === action.payload.maturityLoadFilters.areaGuid)) { // check if `this.areaGuidFromMaturity` matches guid in `payload` (this means user doesn't changed the area and we're good to go)
        this.store.dispatch(new MaturityDataLoadedAction({ data: undefined, status: 304 })); // By default we're assuming that status code 304 and data hasn't been reloaded
      }
    }),
    tap((action: assessments.LoadMaturityDataAction) => {
      if (action.payload) {
        this.areaGuidFromMaturity = action.payload.maturityLoadFilters.areaGuid;
        this.maturityItemType = action.payload.itemType;
        this.maturityStage = action.payload.maturityLoadFilters.stage;
      }
    }),
    switchMap((a: assessments.LoadMaturityDataAction) => {
      return this.traccDataService.retrieveMaturityActions(a.payload.maturityLoadFilters, a.payload.itemType, this.maturityDataHash)
        .pipe(map((response: HttpResponse<MaturityBundle>) => {
          this.maturityDataHash = response.body.hash;
          return { data: response.body, status: response.status };
        }), catchError((error) => {
          if (error.status === 304) {
            return of({ data: undefined, status: error.status });
          }
          return of<any>(undefined);
        }));
      // .map((response: HttpResponse<MaturityBundle>) => {
      //   this.maturityDataHash = response.body.hash;
      //   return { data: response.body, status: response.status };
      // })
      // .catch((error) => {
      //   if (error.status === 304) {
      //     return of({ data: undefined, status: error.status });
      //   }
      //   return of<any>(undefined);
      // });
    }),
    map((assessments: { data: MaturityBundle, status: number }) => ({ type: ActionTypes.MATURITY_DATA_LOADED, payload: assessments }))
  );

  @Effect()
  loadAssessments$: Observable<AssessmentsLoadedAction> = this.actions$.pipe(
    ofType(ActionTypes.LOAD_ASSESSMENTS),
    switchMap((a: assessments.FetchAssessmentListAction) => this.traccDataService.loadAssessments(a.payload.rowGuid)),
    map(assessments => ({ type: ActionTypes.ASSESSMENTS_LOADED, payload: assessments }))
  );
  // .startWith(new areas.LoadAction())
  // .do(a => console.log(a))

  // @Effect()
  // loadMaturityThemeData$: Observable<any> = this.actions$
  //   .ofType(ActionTypes.LOAD_MATURITY_THEME_DATA)
  //   .switchMap((a: assessments.LoadMaturityThemeDataAction) => this.traccDataService.retrieveMaturityThemes(a.payload.maturityLoadFilters, a.payload.itemType))
  //   .map(themes => ({ type: ActionTypes.MATURITY_THEME_DATA_LOADED, payload: themes }));

  @Effect()
  loadAssessment$: Observable<AssessmentLoadedAction> = this.actions$.pipe(
    ofType(ActionTypes.LOAD_ASSESSMENT),
    switchMap((a: assessments.FetchAssessmentAction) => this.traccDataService.loadAssessment(a.payload)
      .pipe(
        catchError(error => of<any>(undefined)),
        map(assessment => ({ type: ActionTypes.ASSESSMENT_LOADED, payload: assessment }))
      ))
  );

  @Effect()
  loadPlanSummary$: Observable<PlanSummaryLoadedAction> = this.actions$.pipe(
    ofType(ActionTypes.LOAD_PLAN_SUMMARY),
    tap((action: assessments.LoadPlanSummaryAction) => {
      if ((this.plansSummaryType && this.plansSummaryType === action.payload.summaryType) && (this.areaGuidFromPlans === action.payload.areaGuid && !action.payload.traccId) || (this.areaGuidFromPlans === action.payload.areaGuid && this.plansTraccId === action.payload.traccId && !action.payload.action)) { // check if `this.areaGuidFromPlans` matches guid in `payload` (this means user doesn't changed the area and we're good to go)
        this.store.dispatch(new PlanSummaryLoadedAction({ data: undefined, status: 304 })); // By default we're assuming that status code 304 and data hasn't been reloaded
      }
    }),
    tap((action: assessments.LoadPlanSummaryAction) => {
      if (action.payload) {
        this.plansSummaryType = action.payload.summaryType;
        this.areaGuidFromPlans = action.payload.areaGuid;
        this.plansTraccId = action.payload.traccId;
      }
    }), // store the `summaryType` here to determine the type of next call, we'll decide if we have to make API call based on the `summaryType` value
    switchMap((a: assessments.LoadPlanSummaryAction) => {
      return this.planDataService.retrievePlanSummary(a.payload.summaryType, a.payload.areaGuid, a.payload.traccId, a.payload.realTraccId, a.payload.stage, a.payload.action, a.payload.identityGuid, this.planSummaryHash)
        .pipe(
          map((response: any) => {
            this.planSummaryHash = response.body.hash;
            return { data: response.body, status: response.status };
          }),
          catchError((error) => {
            if (error.status === 304) {
              return of({ data: undefined, status: error.status });
            }
            return of<any>(undefined);
          })
        );
    }),
    map((planSummary: { data: PlanSummary, status: number }) => ({ type: ActionTypes.PLAN_SUMMARY_LOADED, payload: planSummary }))
  );

  constructor(private actions$: Actions, private traccDataService: TraccDataService, private planDataService: PlansDataService, private store: Store<State>) { }
}
