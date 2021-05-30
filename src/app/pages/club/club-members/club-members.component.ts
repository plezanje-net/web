import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';

@Component({
  selector: 'app-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
})
export class ClubMembersComponent implements OnInit {
  loading = true;
  error = null;
  constructor(private clubService: ClubService) {}

  ngOnInit(): void {}

  deleteMember(id: string) {
    console.log('deleting member with id: ' + id);
  }
}
