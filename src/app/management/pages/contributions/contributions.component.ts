import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Contribution,
  ManagementContributionsGQL,
} from 'src/generated/graphql';

export interface ContributionNode extends Contribution {
  parent: Contribution;
  children: Contribution[];
}
export interface ContributionsTree {
  crags: ContributionNode[];
  sectors: ContributionNode[];
  routes: ContributionNode[];
}

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss'],
})
export class ContributionsComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  subscription: Subscription;
  contributionsTree: ContributionsTree;

  constructor(private managementContributionsGQL: ManagementContributionsGQL) {}

  ngOnInit(): void {
    this.subscription = this.managementContributionsGQL
      .watch()
      .valueChanges.subscribe({
        next: (response) => {
          this.contributionsTree = this.makeContributionsTree(
            <Contribution[]>response.data.contributions
          );
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private makeContributionsTree(contributionsIn: Contribution[]) {
    // Make a copy (original is readonly and cannot be extended)
    const contributions: ContributionNode[] = [];
    contributionsIn.forEach((contribution) => {
      contributions.push({ ...contribution, parent: null, children: [] });
    });

    // Every contribution might have some children and/or might have a parent. Compare all possible pairs and connect them if a match is found
    for (let i = 0; i < contributions.length; i++) {
      const contributionOne = contributions[i];
      for (let j = i + 1; j < contributions.length; j++) {
        const contributionTwo = contributions[j];

        if (
          contributionOne.entity === 'crag' &&
          contributionTwo.entity === 'sector' &&
          contributionTwo.sector.crag.id === contributionOne.id
        ) {
          contributionOne.children.push(contributionTwo);
          contributionTwo.parent = contributionOne;
        }

        if (
          contributionOne.entity === 'sector' &&
          contributionTwo.entity === 'crag' &&
          contributionTwo.id === contributionOne.sector.crag.id
        ) {
          contributionOne.parent = contributionTwo;
          contributionTwo.children.push(contributionOne);
        }

        if (
          contributionOne.entity === 'sector' &&
          contributionTwo.entity === 'route' &&
          contributionTwo.route.sector.id === contributionOne.id
        ) {
          contributionTwo.parent = contributionOne;
          contributionOne.children.push(contributionTwo);
        }

        if (
          contributionOne.entity === 'route' &&
          contributionTwo.entity === 'sector' &&
          contributionTwo.id === contributionOne.route.sector.id
        ) {
          contributionOne.parent = contributionTwo;
          contributionTwo.children.push(contributionOne);
        }
      }
    }

    // Now that parent/child connections are established, organize contributions into a tree by finding top most nodes. After this all branches can be traversed.
    const tree: ContributionsTree = { crags: [], sectors: [], routes: [] };
    contributions.forEach((contribution) => {
      if (contribution.entity === 'crag') {
        tree.crags.push(contribution);
      }
      if (contribution.entity === 'sector' && !contribution.parent) {
        tree.sectors.push(contribution);
      }
      if (contribution.entity === 'route' && !contribution.parent) {
        tree.routes.push(contribution);
      }
    });

    return tree;
  }
}
