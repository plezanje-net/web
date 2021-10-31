import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ManagementGetCragQuery, Sector } from 'src/generated/graphql';

@Component({
  selector: 'app-sector-form',
  templateUrl: './sector-form.component.html',
  styleUrls: ['./sector-form.component.scss'],
})
export class SectorFormComponent implements OnInit {
  @Input() sector: Sector;

  form = new FormGroup({
    label: new FormControl(),
    name: new FormControl(),
    status: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {
    this.form.patchValue(this.sector);
  }
}
