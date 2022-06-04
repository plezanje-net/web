import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Registry } from 'src/app/types/registry';
import {
  Contribution,
  ManagementContributionsGQL,
} from 'src/generated/graphql';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss'],
})
export class ContributionsComponent implements OnInit {
  loading = true;
  error = false;

  contributions: Contribution[];

  entityNames = {
    crag: 'Plezališče',
    sector: 'Sektor',
    route: 'Smer',
  };

  statusOptions: Registry[] = [
    { value: 'user', label: 'Samo zame' },
    { value: 'proposal', label: 'Predlagaj uredništvu' },
    { value: 'public', label: 'Vidijo vsi' },
    { value: 'hidden', label: 'Samo za prijavljene' },
    { value: 'admin', label: 'Samo za admine' },
    { value: 'archive', label: 'Arhivirano' },
  ];

  constructor(
    private authService: AuthService,
    private managementContributionsGQL: ManagementContributionsGQL
  ) {}

  ngOnInit(): void {
    this.statusOptions = this.statusOptions.filter(
      (status) =>
        this.authService.currentUser.value.roles.includes('admin') ||
        ['user', 'proposal'].includes(status.value)
    );

    this.managementContributionsGQL.watch().valueChanges.subscribe({
      next: (response) => {
        this.contributions = <Contribution[]>response.data.contributions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  statusName(status: string): string {
    return this.statusOptions.find((s) => s.value == status)?.label;
  }
}
