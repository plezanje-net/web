import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment, User } from 'src/generated/graphql';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss'],
})
export class WarningsComponent implements OnInit, OnDestroy {
  @Input() warnings: Comment[] = [];

  authSub: Subscription;
  user: User;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser.subscribe(
      (user) => (this.user = user)
    );
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
