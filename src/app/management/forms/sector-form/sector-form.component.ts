import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Registry } from 'src/app/types/registry';
import { ManagementGetCragQuery, Sector } from 'src/generated/graphql';
import { SectorAction } from '../../pages/crag/crag-sectors/crag-sectors.component';

@Component({
  selector: 'app-sector-form',
  templateUrl: './sector-form.component.html',
  styleUrls: ['./sector-form.component.scss'],
})
export class SectorFormComponent implements OnInit {
  @Input('sector') form: FormGroup;

  statusOptions: Registry[] = [
    { value: 'public', label: 'Vidijo vsi' },
    { value: 'hidden', label: 'Samo za prijavljene' },
    { value: 'admin', label: 'Samo za admine' },
    { value: 'archive', label: 'Arhivirano' },
    // { value: 'proposal', label: 'Predlagaj administratorju' },
    // { value: 'user', label: 'Samo zame' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
