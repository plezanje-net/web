import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from 'src/generated/graphql';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss'],
})
export class WarningsComponent implements OnInit {
  @Input() warnings: Comment[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
