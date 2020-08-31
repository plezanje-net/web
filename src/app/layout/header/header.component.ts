import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public naviOpen: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.naviOpen = false;
      }
    });
  }

  toggleNavi(): void {
    this.naviOpen = !this.naviOpen;
  }
}
