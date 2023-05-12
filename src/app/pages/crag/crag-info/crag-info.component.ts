import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Crag, User } from 'src/generated/graphql';
import { IDistribution } from '../../../common/distribution-chart/distribution-chart.component';

@Component({
  selector: 'app-crag-info',
  templateUrl: './crag-info.component.html',
  styleUrls: ['./crag-info.component.scss'],
})
export class CragInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() crag: Crag;

  @Input() id: string = 'default';

  attendanceDistribution: IDistribution[] = [];

  crags$ = new BehaviorSubject<any>([]);
  user: User;
  subscriptions = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.init();

    const userSub = this.authService.currentUser.subscribe(
      (user) => (this.user = user)
    );
    this.subscriptions.push(userSub);
  }

  ngOnChanges(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  init() {
    this.crags$.next([this.crag]);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Maj',
      'Jun',
      'Jul',
      'Avg',
      'Sep',
      'Okt',
      'Nov',
      'Dec',
    ];

    this.attendanceDistribution = this.crag.activityByMonth.find((a) => a > 20)
      ? this.crag.activityByMonth.map((value, m) => ({
          label: months[m],
          value: value,
        }))
      : [];
  }
}
