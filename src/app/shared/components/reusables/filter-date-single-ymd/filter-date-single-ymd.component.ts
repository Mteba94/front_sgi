import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '@shared/functions/date-format';
import { Moment } from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-filter-date-single-ymd',
  standalone: true,
  imports: [SharedModule, MomentDateModule],
  templateUrl: './filter-date-single-ymd.component.html',
  styleUrls: ['./filter-date-single-ymd.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateSingleYmdComponent implements OnInit {


  ngOnInit(): void {
  }

}
