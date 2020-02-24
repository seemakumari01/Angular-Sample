import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActualTargetCount } from '../../models/plan-actual-target-count';

@Component({
  selector: 'task-progress-chart',
  template: `
    <chart style="padding-top: 10px" [options]="chartData"></chart>
    <div style="display: none; visibility: hidden;">
      <span i18n="@@TaskProgressChart_TitleText" #titleText>YOUR PROCESS STEP PROGRESS</span>
      <span i18n="@@ViewProgressCompletingTasksTowardsPlanInThisAreaActualVsTarget" #titleSubtitle>View your progress in completing tasks towards our plan in this area (Actual vs Target).</span>
      <span i18n="@@stepsOverdue" #stepsOverdue>Steps overdue</span>
      <span i18n="@@stepsPlanned" #stepsPlanned>Planned steps</span>
      <span i18n="@@stepsCompleteCumulative" #stepsComplete>Steps complete (cumulative)</span>
      <span i18n="@@stepsTargetCumulative" #stepsTarget>Target for steps complete (cumulative)</span>
      <span i18n="@@processSteps" #yAxis>process steps</span>
    </div>
  `
})
export class TaskProgressChartComponent {
  // @Input() chartHeight: number;
  chartData: any;

  @ViewChild('titleText') elementRefTitle: ElementRef;
  @ViewChild('titleSubtitle') elementRefSubtitle: ElementRef;
  @ViewChild('stepsOverdue') elementRefOverdue: ElementRef;
  @ViewChild('stepsPlanned') elementRefPlanned: ElementRef;
  @ViewChild('stepsComplete') elementRefComplete: ElementRef;
  @ViewChild('stepsTarget') elementRefTarget: ElementRef;
  @ViewChild('yAxis') elementRefYAxis: ElementRef;


  @Input()
  set data(data: ActualTargetCount[]) {
    // console.log('Tasks progress data is = ', data);
    this.setChartData(data);
  }

  private setChartData(data: any) {
    if (data !== undefined) {
      this.chartData = {
        chart: {
          height: 400
        },
        lang: { noData: 'Not enough data to draw the chart' },
        title: {
          text: this.elementRefTitle.nativeElement.innerText,
          style: {
            fontSize: '16px'
          }
        },
        subtitle: {
          text: this.elementRefSubtitle.nativeElement.innerText,
        },
        xAxis: {
          // categories: ['steps'],
          // labels: {
          //   enabled: false
          // },
          categories: data.map((d: ActualTargetCount) => d.b),
          tickLength: 0,
          minorTickLength: 0,
        },
        yAxis: {
          min: Math.max(Math.min(data[0].a, data[0].t) - 10, 0),
          title: {
            text: this.elementRefYAxis.nativeElement.innerText
          },
          allowDecimals: false
        },
        legend: {
          reversed: true,
          symbolRadius: 0
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}" class="fa fa-circle"></span> {series.name}: <b>{point.y}</b><br/>',
          useHTML: true
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            marker: {
              enabled: false
            }
          },
          column: {
            pointPadding: 0,
            groupPadding: 0.1,
            borderWidth: 0
          }
        },
        series: [
          {
            name: this.elementRefOverdue.nativeElement.innerText,
            type: 'column',
            color: '#ff4008',
            data: data.map((d: ActualTargetCount) => d.o)
          },
          {
            name: this.elementRefPlanned.nativeElement.innerText,
            type: 'column',
            color: '#a1a1a1',
            data: data.map((d: ActualTargetCount) => d.i)
          },
          {
            name: this.elementRefComplete.nativeElement.innerText,
            type: 'column',
            color: '#07d567',
            data: data.map((d: ActualTargetCount) => d.a)

          }, {
            name: this.elementRefTarget.nativeElement.innerText,
            type: 'line',
            color: '#000000',
            step: 'center', // gives type error but actually works
            marker: {
              enabled: true
            },
            data: data.map((d: ActualTargetCount) => d.t)
          }],
        credits: {
          enabled: false
        }
      };

    }
  }

}
