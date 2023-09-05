import type { EChartsOption } from 'echarts';
import { StatsActivities, MyActivityStatsGQL } from 'src/generated/graphql';
import { FormControl, FormGroup } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
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
  IGrade,
} from '../../../shared/services/grading-systems.service';
import { LoadingSpinnerService } from '../../../pages/home/loading-spinner.service';

@Component({
  selector: 'app-activity-statistics',
  templateUrl: './activity-statistics.component.html',
  styleUrls: ['./activity-statistics.component.scss'],
})
export class ActivityStatisticsComponent implements OnInit {
  subscription: Subscription;
  options: EChartsOption;
  optionsLine: EChartsOption;
  myStats: StatsActivities[];
  loading = true;
  labels = [
    "Z rdečo piko", "Flash", "Na pogled"
  ];
  xAxisData = [];
  dataRP = [];
  dataF = [];
  dataOS = [];  
  dataRPSum = 0;
  dataFSum = 0;
  dataOSSum = 0;  
  activityYears = [{
    value: null,
    label: "Vse",
    nrRoutesRP: 0,
    nrRoutesF: 0,
    nrRoutesOS: 0
  }];
  emphasisStyle = {
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)'
    }
  };
  currentYear = null;
  colors = ['#D13C2A', '#999999', '#609CDE'];

  filters = new FormGroup({
    year: new FormControl(),
  });

  subscriptions: Subscription[] = [];
  constructor(
    private myStatsGQL: MyActivityStatsGQL,
    private loadingSpinnerService: LoadingSpinnerService,
    private authService: AuthService,
    private GradingSystemsService: GradingSystemsService

  ) {}

  @Output() errorEvent = new EventEmitter<DataError>();

  ngOnInit(): void {
    const filtersSub = this.filters.valueChanges.subscribe((values) => {
      this.currentYear = values.year;
      this.querySuccess(values.year);
    });
    this.subscriptions.push(filtersSub);

    this.subscription = this.authService.currentUser
      .pipe(
        switchMap((user) => {
          this.loadingSpinnerService.pushLoader();
          return this.myStatsGQL.fetch({
            input: {}
          });
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.myStats = <StatsActivities[]>result.data.myActivityStatistics;
          this.querySuccess(null);
          this.parseByYear();

        },
        error: (error) => {
          this.loadingSpinnerService.popLoader();
          this.queryError();
        },
      });

  }

  //parses result for graph by year
  parseByYear(): void {
    this.activityYears.forEach(year => {
      if(year.value) {
          var filterByYear = this.myStats.filter(x=> x.year == year.value);
          filterByYear.forEach((elementByYear, index) => {
            if(elementByYear.ascent_type=='redpoint') year.nrRoutesRP += elementByYear.nr_routes;
            if(elementByYear.ascent_type=='flash') year.nrRoutesF += elementByYear.nr_routes;
            if(elementByYear.ascent_type=='onsight') year.nrRoutesOS += elementByYear.nr_routes;
          });
      }
    });

    var sorted = this.activityYears.filter(year => year.value).sort((a, b) => a.value - b.value);
    this.buildOptionsLine(sorted);
  }

  async querySuccess(year) {
    var data1 = [];
    var data2 = [];
    var data3 = [];       
    let xAxisLabels = [];  

    this.myStats.forEach(async (element) => {
      if(year && element.year!==year) return;
      if( this.activityYears.findIndex((el) => el.value === element.year)===-1)  {
        this.activityYears.push({
          value: element.year,
          label: element.year.toString(),
          nrRoutesRP: 0,
          nrRoutesF: 0,
          nrRoutesOS: 0
        }); 
      }

      this.activityYears = this.activityYears.sort((a, b) => {
        if(a.value == null || b.value == null) -1;
        else return b.value - a.value
      })

      if(!year) this.currentYear = this.activityYears[0].label;

      try {
        var grade = await this.GradingSystemsService.diffToGrade(
          element.difficulty,
          'french',
          false
        );
        if(xAxisLabels.indexOf(grade.name)===-1) { 
          xAxisLabels.push(grade.name );
          if(element.ascent_type === 'redpoint') {
              data1.push(element.nr_routes);
              data2.push(0);
              data3.push(0);
          } else if(element.ascent_type === 'flash') {
            data1.push(0);
            data2.push(element.nr_routes);
            data3.push(0);
          } if(element.ascent_type === 'onsight') {
            data1.push(0);
            data2.push(0);
            data3.push(element.nr_routes);
          }
        } else {
          if(element.ascent_type === 'redpoint') {
            data1[data1.length-1] += element.nr_routes;
          } else if(element.ascent_type === 'flash') {
            data2[data2.length-1] += element.nr_routes;
          } if(element.ascent_type === 'onsight') {
            data3[data3.length-1] += element.nr_routes;
          }
        }

      } catch (error) {
        console.log("Error getting grade:", error);
      } finally {
        this.dataRP = data1;
        this.dataRPSum = data1.reduce(
          (accumulator, currentValue) => accumulator + currentValue, 0
        );
        this.dataF = data2;
        this.dataFSum = this.dataF.reduce(
          (accumulator, currentValue) => accumulator + currentValue, 0
        );
        this.dataOS = data3;
        this.dataOSSum = this.dataOS.reduce(
          (accumulator, currentValue) => accumulator + currentValue, 0
        );
        this.buildOptions(data1, data2, data3, xAxisLabels);
      }
    });
  }

  buildOptionsLine(sorted) {
    this.optionsLine = {
      tooltip: {
        trigger: 'axis'
      },
      color: this.colors,
      legend: {
        data: this.labels
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: sorted.map(x=> x.label)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: this.labels[0],
          type: 'line',
          data: sorted.map(x=> x.nrRoutesRP)
        },
        {
          name: this.labels[1],
          type: 'line',
          data: sorted.map(x=> x.nrRoutesF)
        },
        {
          name: this.labels[2],
          type: 'line',
          data: sorted.map(x=> x.nrRoutesOS)
        }
      ]
    };
  }

  buildOptions(data1, data2, data3, xAxisLabels) {
    this.xAxisData = xAxisLabels;
    this.options = {
      title: {
        text: this.currentYear
      },
      legend: {
        data: this.labels,
        left: '35%'
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
          saveAsImage: {}
        }
      },
      tooltip: {},
      color: this.colors,
      xAxis: {
      },
      yAxis: {
            data: xAxisLabels,
        name: 'Ocena',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false }
      },
      grid: {
        bottom: 50
      },
      series: [
        {
          name: this.labels[0],
          type: 'bar',
          stack: 'one',
    
          emphasis: this.emphasisStyle,
          data: data1
        },
        {
          name: this.labels[1],
          type: 'bar',
          stack: 'one',
          emphasis: this.emphasisStyle,
          data: data2,
    
        },
        {
          name: this.labels[2],
          type: 'bar',
          stack: 'one',
          emphasis: this.emphasisStyle,
          data: data3,
    
        }
      ]
    };
  }

  queryError() {
    this.errorEvent.emit({
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    });
  }
}
