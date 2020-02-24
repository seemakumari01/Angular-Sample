import { Action } from '@ngrx/store';
import { type } from '../../shared-common/util';
import { ClientArea } from '../models/client-area';
import { Assessment } from '../models/assessment';
import { AreaAndTracc } from '../models/area-and-tracc';
import { MaturityLoadFilters } from '../models/maturity-load-filters';
import { PlanSummary } from '../models/plan-summary';
import { MaturityBundle } from '../models/maturity-bundle';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  // AREA_CHANGED: type('[ClientArea] Area Selected'),
  // AREA_GUID_PICK: type('[ClientArea] Area Picked via Guid'),
  LOAD_MATURITY_DATA: type('[Assessment[]] Load Maturity Data from API'),
  MATURITY_DATA_LOADED: type('[Assessment[]] Maturity Data Loaded from API'),
  // LOAD_MATURITY_THEME_DATA: type('[Assessment[]] Load Maturity Theme Data from API'),
  // MATURITY_THEME_DATA_LOADED: type('[Assessment[]] Maturity Theme Data Loaded from API'),
  LOAD_ASSESSMENTS: type('[Assessment[]] Fetch Assessments from API'),
  ASSESSMENTS_LOADED: type('[Assessment[]] Assessments loaded'),
  LOAD_ASSESSMENT: type('[Assessment] Fetch Assessment from API'),
  ASSESSMENT_LOADED: type('[Assessment] Assessment loaded'),
  // UNSET_CURRENT_ASSESSMENT: type('[Assessment] Current Assessment unset'),
  LOAD_MATURITY_ITEMS: type('[Assessment] Load Maturity Items'),
  MATURITY_STAGE_PICKED: type('[Assessment] Maturity Stage Picked'),
  MATURITY_STAGE_PICKED_BY_SCORE: type('[Assessment] Maturity Stage Picked By Score'),
  LOAD_PLAN_SUMMARY: type('[Assessment] load plans items summary'),
  PLAN_SUMMARY_LOADED: type('[Assessment] plans items summary loaded'),
  MATURITY_ACTION_PICKED: type('[Assessment] Maturity Action Picked'),
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
// export class CurrentAreaSelectedAction implements Action {
//   type = ActionTypes.AREA_CHANGED;
//   constructor(public payload: ClientArea) {
//     console.log('CurrentAreaChangeAction');
//   }
// }
//
// export class CurrentAreaPickWithGuidAction implements Action {
//   type = ActionTypes.AREA_GUID_PICK;
//   constructor(public payload: string) {
//     console.log('CurrentAreaPickWithGuidAction');
//   }
// }

export class LoadMaturityDataAction implements Action {
  type = ActionTypes.LOAD_MATURITY_DATA;
  constructor(public payload: { maturityLoadFilters: MaturityLoadFilters, itemType: string }) {
    // console.log('LoadMaturityDataAction');
  }
}

export class MaturityDataLoadedAction implements Action {
  type = ActionTypes.MATURITY_DATA_LOADED;
  constructor(public payload: { data: MaturityBundle, status: number }) {
    // console.log('MaturityDataLoadedAction');
  }
}

// export class LoadMaturityThemeDataAction implements Action {
//   type = ActionTypes.LOAD_MATURITY_THEME_DATA;
//   constructor(public payload: { maturityLoadFilters: MaturityLoadFilters, itemType: string }) {
//     console.log('LoadMaturityThemeDataAction');
//   }
// }

// export class MaturityThemeDataLoadedAction implements Action {
//   type = ActionTypes.MATURITY_THEME_DATA_LOADED;
//   constructor(public payload: { data: Theme[], status: number }) {
//     console.log('MaturityThemeDataLoadedAction');
//   }
// }


export class FetchAssessmentListAction implements Action {
  type = ActionTypes.LOAD_ASSESSMENTS;
  constructor(public payload: ClientArea) {
    // console.log('FetchAssessmentListAction');
  }
}

export class AssessmentsLoadedAction implements Action {
  type = ActionTypes.ASSESSMENTS_LOADED;
  constructor(public payload: Assessment[]) {
    // console.log('AssessmentsLoadedAction');
  }
}

export class FetchAssessmentAction implements Action {
  type = ActionTypes.LOAD_ASSESSMENT;
  constructor(public payload: AreaAndTracc) {
    // console.log('FetchAssessmentAction');
  }
}

export class AssessmentLoadedAction implements Action {
  type = ActionTypes.ASSESSMENT_LOADED;
  constructor(public payload: Assessment) {
    // console.log('AssessmentLoadedAction');
  }
}

// export class UnsetCurrentAssessmentAction implements Action {
//   type = ActionTypes.UNSET_CURRENT_ASSESSMENT;
//   constructor(public payload: any) {
//     // console.log('UnsetCurrentAssessmentAction');
//   }
// }

export class MaturityItemsLoadAction implements Action {
  type = ActionTypes.LOAD_MATURITY_ITEMS;
  constructor(public payload: MaturityLoadFilters) {
    // console.log('MaturityItemsLoadAction');
  }
}

export class MaturityStagePickedAction implements Action {
  type = ActionTypes.MATURITY_STAGE_PICKED;
  constructor(public payload: number) {
    // console.log('MaturityStagePickedAction');
  }
}

export class MaturityStagePickedByScoreAction implements Action {
  type = ActionTypes.MATURITY_STAGE_PICKED_BY_SCORE;
  constructor(public payload?: number) {
    // console.log('MaturityStagePickedByScoreAction');
  }
}

export class LoadPlanSummaryAction implements Action {
  type = ActionTypes.LOAD_PLAN_SUMMARY;
  constructor(public payload: { summaryType: string, areaGuid: string, traccId?: number, realTraccId?: number, stage?: number, action?: string, identityGuid?: string }) {
    // console.log('LoadPlanSummaryAction');
  }
}

export class PlanSummaryLoadedAction implements Action {
  type = ActionTypes.PLAN_SUMMARY_LOADED;
  constructor(public payload: { data: PlanSummary, status: number }) {
    // console.log('PlanSummaryLoadedAction');
  }
}

//
// export class MaturityActionPickedAction implements Action {
//   type = ActionTypes.MATURITY_ACTION_PICKED;
//   constructor(public payload: string) {
//     console.log('MaturityActionPickedAction - ' + payload);
//   }
// }


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoadMaturityDataAction
  | MaturityDataLoadedAction
  | FetchAssessmentListAction
  | AssessmentsLoadedAction
  | FetchAssessmentAction
  | AssessmentLoadedAction
  | MaturityStagePickedAction
  | MaturityStagePickedByScoreAction
  | LoadPlanSummaryAction
  | PlanSummaryLoadedAction;
  // | LoadMaturityThemeDataAction
  // | MaturityThemeDataLoadedAction;
