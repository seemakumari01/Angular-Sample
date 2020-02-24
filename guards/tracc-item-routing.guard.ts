import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import * as fromRoot from '../reducers/index';
import { State } from '../reducers/index';
import { Store } from '@ngrx/store';
import { ClientArea } from '../models/client-area';
import { MaturityLoadFilters } from '../models/maturity-load-filters';
import * as RouterActions from '../actions/router';
import { take } from 'rxjs/operators';
import { navigatedByGuard$ } from '../plans/shared-subjects';

@Injectable()
export class TraccItemRoutingGuard implements CanActivate {

  maturityLoadFilters: MaturityLoadFilters;

  public static performRouting(routeRoot: string, clientArea: ClientArea, maturityLoadFilters: MaturityLoadFilters, store: Store<State>) {
    if (maturityLoadFilters) {

      // console.error('routeRoot routeRoot ---> ', routeRoot);

      if (!routeRoot.includes('maturity') && maturityLoadFilters.action) {
        navigatedByGuard$.next(true); // notify plans-component that navigation took place via Guard....
        store.dispatch(new RouterActions.Go({ path: [routeRoot + '/', clientArea.rowGuid, 'tracc', maturityLoadFilters.traccId, maturityLoadFilters.realTraccId, 'stage', maturityLoadFilters.stage, 'action', maturityLoadFilters.action] }));
      } else if (!routeRoot.includes('maturity') && maturityLoadFilters.stage) {
        navigatedByGuard$.next(true); // notify plans-component that navigation took place via Guard....
        store.dispatch(new RouterActions.Go({ path: [routeRoot + '/', clientArea.rowGuid, 'tracc', maturityLoadFilters.traccId, maturityLoadFilters.realTraccId, 'stage', maturityLoadFilters.stage] }));
      } else if (!routeRoot.includes('maturity') && maturityLoadFilters.traccId) {
        navigatedByGuard$.next(true); // notify plans-component that navigation took place via Guard....
        // in this situation we don't have `stage` in `maturityLoadFilters`, so we have to provide hardcoded stage here...
        store.dispatch(new RouterActions.Go({ path: [routeRoot + '/', clientArea.rowGuid, 'tracc', maturityLoadFilters.traccId, maturityLoadFilters.realTraccId, 'stage', 2] }));
      } else if (routeRoot.includes('maturity') || !maturityLoadFilters.traccId) {
        store.dispatch(new RouterActions.Go({ path: [routeRoot + '/', clientArea.rowGuid] }));
      }
    }
  }

  constructor(public store: Store<State>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log('TraccItemRoutingGuard');

    this.store.select<MaturityLoadFilters>(fromRoot.getMaturityItemLoadFiltersQuery)
      .pipe(take(1))
      .subscribe((milf: MaturityLoadFilters) => this.maturityLoadFilters = milf);
    this.store.select<ClientArea>(fromRoot.getCurrentAreaQuery)
      .pipe(take(1))
      .subscribe((a: ClientArea) => {
        if (this.maturityLoadFilters && a) {
          TraccItemRoutingGuard.performRouting(state.url, a, this.maturityLoadFilters, this.store);
        } else {
          if (a) {
            this.store.dispatch(new RouterActions.Go({ path: ['/' + state.url + '/', a.rowGuid] }));
          }
        }
      });

    return false;
  }
}
