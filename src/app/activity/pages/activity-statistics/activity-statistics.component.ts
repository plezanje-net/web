import { EChartsOption, SeriesOption } from 'echarts';
import { StatsRoutes, MyRoutesStatsGQL, StatsActivities, MyActivitiesStatisticsGQL } from 'src/generated/graphql';
import { FormControl, FormGroup } from '@angular/forms';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DataError } from 'src/app/types/data-error';
import {
  GradingSystemsService,
} from '../../../shared/services/grading-systems.service';
import { LoadingSpinnerService } from '../../../pages/home/loading-spinner.service';
import { ACTIVITY_TYPES, ASCENT_TYPES } from 'src/app/common/activity.constants';
import { AscentType } from 'src/app/types/ascent-type';

@Component({
  selector: 'app-activity-statistics',
  templateUrl: './activity-statistics.component.html',
  styleUrls: ['./activity-statistics.component.scss'],
})
export class ActivityStatisticsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscriptionActivity: Subscription;
  options: EChartsOption;
  optionsByYear: EChartsOption;
  activitiesByYear: EChartsOption;
  myRouteStats: StatsRoutes[];
  myActivityStats: StatsActivities[];
  loading = true;
  sumLabel = 'Skupaj';
  xAxisData = [];
  activityYears = [
    {
      value: null,
      label: 'Vse',
      ascents: []
    },
  ];
  data = [];
  emphasisStyle = {
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)',
    },
  };
  currentYear = null;

  filters = new FormGroup({
    year: new FormControl(),
    ascentType: new FormControl(),
  });

  ascentTypes = ASCENT_TYPES;
  activityTypes = ACTIVITY_TYPES.filter(
    (a) => a.value != 'peak' && a.value != 'iceFall'
  );

  topRopeAscentTypes = ASCENT_TYPES.filter((ascentType) => ascentType.topRope);
  nonTopRopeAscentTypes = ASCENT_TYPES.filter(
    (ascentType) => !ascentType.topRope
  );
  defaultAscentTypes = ['onsight', 'redpoint', 'flash'];
  selectedAscentTypes:AscentType[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    private myRouteStatsGQL: MyRoutesStatsGQL,
    private myActivityStatsGQL: MyActivitiesStatisticsGQL,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService,
    private GradingSystemsService: GradingSystemsService
  ) {}

  @Output() errorEvent = new EventEmitter<DataError>();

  ngOnInit(): void {
    const filtersSub = this.filters.valueChanges.subscribe(async (values) => {
      
      this.selectedAscentTypes = this.ascentTypes.filter((x)=> values.ascentType.includes(x.value)).sort((a,b)=> {
        if (a.order < b.order) {
          return -1;
        } else if (a.order > b.order) {
          return 1;
        }
        return 0;
      });
      this.currentYear = values.year;
      await this.querySuccess(values.year);
      this.buildOptionsByYear();
    });
    this.subscriptions.push(filtersSub);
    this.filters.controls.ascentType.setValue(this.defaultAscentTypes);

    this.subscription = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.myRouteStatsGQL.fetch({
            input: {
              routeTypes: ['sport'],
            },
          });
        })
      )
      .subscribe({
        next: async (result) => {
          this.loading = false;
          this.myRouteStats = <StatsRoutes[]>result.data.myRoutesStatistics;
          await this.querySuccess(null);
          this.calcRoutesByYear()
          this.buildOptionsByYear();
        },
        error: (error) => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        },
      });

      this.subscriptionActivity = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.myActivityStatsGQL.fetch({
            input: {
              // activityTypes: ['crag'],
            },
          });
        })
      )
      .subscribe({
        next: async (result) => {
          this.loading = false;
          this.myActivityStats = <StatsActivities[]>result.data.myActivitiesStatistics;
  
          this.buildOptionsActivitiesByYear();
        },
        error: (error) => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        },
      });

      this.subscriptions.push(this.subscription);
  }

  calcRoutesByYear() {
    for (let element of this.myRouteStats[Symbol.iterator]()) {
      const ind = this.activityYears.findIndex((el) => el.value === element.year);
      if ( ind === -1 ) {
        this.activityYears.push({
          value: element.year,
          label: element.year.toString(),
          ascents: [],
        });
      }

      this.activityYears.forEach(el => {
        if(el.value == element.year) {
          if (!el.ascents[element.ascent_type]) {
            el.ascents[element.ascent_type] = 0;
          }
          el.ascents[element.ascent_type] += element.nr_routes;
        }
      });
      this.activityYears = this.activityYears.sort((a, b) => {
        if (a.value == null || b.value == null) -1;
        else return b.value - a.value;
      });

      this.currentYear = this.activityYears[0].label;
    }
  }

  async querySuccess(year) {
    if (!this.myRouteStats) {
      return;
    }

    var tempData = [];
    this.data = [];
    for await (let element of this.myRouteStats[Symbol.iterator]()) {
      if (!(year && element.year !== year)) {
        try {
          var grade = await this.GradingSystemsService.diffToGrade(
            element.difficulty,
            'french',
            false
          );
          if (this.selectedAscentTypes.find((x) => x.value === element.ascent_type)) {
            if (!tempData[this.sumLabel]) {
              tempData[this.sumLabel] = [];
              tempData[this.sumLabel]['sum'] = 0;
            }

            if (!tempData[grade.name] ) {
              tempData[grade.name] = [];
              tempData[grade.name]['sum'] = 0;
            }
  
            if (!tempData[grade.name][element.ascent_type]) {
              tempData[grade.name][element.ascent_type] = 0;
            }
            tempData[grade.name][element.ascent_type] += element.nr_routes;

            if (!tempData[this.sumLabel][element.ascent_type]) {
              tempData[this.sumLabel][element.ascent_type] = 0;
            }

            
            tempData[this.sumLabel][element.ascent_type] += element.nr_routes;
            tempData[grade.name]['sum'] += element.nr_routes;
            tempData[this.sumLabel]['sum'] += element.nr_routes;
          }
        } catch (error) {
          console.log('Error getting grade:', error);
        }
      }
    }
    
    let sort = Object.keys(tempData).sort().reverse();
    this.xAxisData = sort;
    sort.forEach(element => {
      this.data.push({ grade: element, data: tempData[element]});
    });
    let first = this.data.shift();
    if (first) {
      this.data.push(first);
    }
    this.buildOptions();
  }

  buildOptions() {
    let series = this.selectedAscentTypes.map((x) => {
      let sums = [];
      this.data.forEach(element => {
        if (element.grade !== this.sumLabel) {
          if (element.data[x.value] ) {
            sums.unshift(element.data[x.value]);
          } else {
            sums.unshift(0);
          }
        }
      });

      return {
        name: ((x.topRope) ? '(T) ': '') + x.label,
        type: 'bar',
        stack: 'one',

        emphasis: this.emphasisStyle,
        data: sums,
      } as SeriesOption
    }
    );

    this.options = {
      title: {
        text: this.currentYear,
      },
      legend: {
        data: this.selectedAscentTypes.map((x) => ((x.topRope) ? '(T) ': '') + x.label),
        left: '35%',
      },
      // brush: {
      //   toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
      //   xAxisIndex: 0
      // },
      // toolbox: {
      //   feature: {
      //     // magicType: {
      //     //   type: ['stack']
      //     // },
      //     dataView: {}
      //   }
      // },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      tooltip: {},
      color: this.selectedAscentTypes.map((x) => x.color),
      xAxis: {},
      yAxis: {
        data: this.xAxisData.slice(1).reverse(),
        name: 'Ocena',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false },
      },
      grid: {
        bottom: 50,
      },
      series: series,
    };
  }


  buildOptionsByYear() {
    let series = this.selectedAscentTypes.map((x)=> {
      let sums = [];
      this.activityYears.forEach(element => {
        if (element.value) {
          if (element.ascents[x.value] ) {
            sums.unshift(element.ascents[x.value]);
          } else {
            sums.unshift(0);
          }
        }
      });

      return {
        name: ((x.topRope) ? '(T) ': '') + x.label,
        type: 'line',
        data: sums,
      } as SeriesOption
    });


    this.optionsByYear = {
      tooltip: {
        trigger: 'axis',
      },
      color: this.selectedAscentTypes.map((x) => x.color),
      legend: {
        data: this.selectedAscentTypes.map((x) => ((x.topRope) ? '(T) ': '') + x.label),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.activityYears.map((x)=> x.label).slice(1).reverse(),
      },
      yAxis: {
        type: 'value',
      },
      series: series
      ,
    };
  }

  buildOptionsActivitiesByYear() {

    const years = [...new Set(this.myActivityStats.map((x) => x.year))];

    let series = this.activityTypes.map((x)=> {
      let sums = []
        years.forEach((element, index) => {
          const el = this.myActivityStats.find((s)=>s.type === x.value && s.year == element);
          if (el) {
            sums[index] = el.nr_activities;
          } else {
            sums[index] = 0;
          }
        });
      return {
        name: x.label,
        type: 'line',
        data: sums,
      } as SeriesOption
    });

    this.activitiesByYear = {
      tooltip: {
        trigger: 'axis',
      },
      color: this.activityTypes.map((x) => x.color),
      legend: {
        data: this.activityTypes.map((x) => x.label),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
      },
      yAxis: {
        type: 'value',
      },
      series: series
      ,
    };

  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
