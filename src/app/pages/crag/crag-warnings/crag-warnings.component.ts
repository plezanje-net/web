import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-crag-warnings',
  templateUrl: './crag-warnings.component.html',
  styleUrls: ['./crag-warnings.component.scss']
})
export class CragWarningsComponent implements OnInit {

  @Input() crag: any;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
