import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-publish-status-hint',
  templateUrl: './publish-status-hint.component.html',
  styleUrls: ['./publish-status-hint.component.scss'],
})
export class PublishStatusHintComponent implements OnInit, OnDestroy {
  @Input() entityType: string;
  @Input() publishStatus: string;
  @Input() previewMode = false;

  isAdmin: boolean;
  loading = true;
  userSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser.subscribe((user) => {
      this.loading = false;
      this.isAdmin = user?.roles.includes('admin');
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
