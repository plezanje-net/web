import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment, Crag } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-warnings',
  templateUrl: './crag-warnings.component.html',
  styleUrls: ['./crag-warnings.component.scss'],
})
export class CragWarningsComponent implements OnInit {
  @Input() crag: Crag;

  warnings: Comment[];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.warnings = this.crag.comments.filter((c) => c.type == 'warning');
  }
}
