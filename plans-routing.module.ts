import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlansComponent } from './plans.component';
import { PlanTraccViewComponent } from './plan-tracc-view.component';
import { TraccItemRoutingGuard } from '../_guards/tracc-item-routing.guard';
import { PlansSubscriptionGuard } from '../_guards/plans-subscription.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      // { path: 'progress/area/:areaId', component: ProgressComponent },
      // { path: 'progress/area/:areaId/tracc/:tracc', component: MaturityDetailsComponent },
      {
        path: 'plans', component: PlansComponent,
        canActivate: [TraccItemRoutingGuard]
      },
      {
        path: 'plans/:areaId',
        component: PlansComponent,
        children: [
          // {
          //   path: '',
          //   component: PlansSummaryChartComponent,
          //   pathMatch: 'prefix',
          //   outlet: 'summary-chart'
          // },
          // {
          //   path: 'tracc/:tracc/stage/:stage/action/:action/steps',
          //   component: PlanActionViewComponent,
          // },
          {
            path: 'tracc/:traccId/:realTraccId/stage/:stage',
            component: PlanTraccViewComponent,
            canActivate: [PlansSubscriptionGuard]
          },
          {
            path: 'tracc/:traccId/:realTraccId/stage/:stage/action/:action',
            component: PlanTraccViewComponent,
            canActivate: [PlansSubscriptionGuard]
          },
          // {
          //   path: 'tracc/:tracc',
          //   component: PlanTraccViewComponent,
          // },
          {
            path: '',
            component: PlanTraccViewComponent,
          }
        ]
      }
      // {path: 'plans/:areaId/tracc/:traccName', component: PlansComponent},
      // {path: 'plans/:areaId/tracc/:traccName/:actionCode', component: PlansComponent},
    ])
  ],
  // providers: [
  //   PlanSummaryResolver
  // ],
  exports: [RouterModule]
})
export class PlansRoutingModule {
}
