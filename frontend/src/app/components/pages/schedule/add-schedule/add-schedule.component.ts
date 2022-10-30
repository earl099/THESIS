import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {
  csvRecords: any;
  header: boolean = true

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private toastr: ToastrService,
    private csvParser: NgxCsvParser
  ) { }

  @ViewChild('fileImportInput') fileImportInput: any;

  ngOnInit(): void {

  }

  fileChangeListener($event: any) {
    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' ||
    this.header === true;

    this.csvParser
    .parse(files[0], {
      header: this.header,
      delimiter: ',',
      encoding: 'utf8'
    })
    .pipe()
    .subscribe({
      next: (result): void => {
        //console.log('Result:', result);
        this.csvRecords = result;
        //console.log(this.csvRecords);
      },
      error: (error: NgxCSVParserError) => {
        console.log('Error:', error)
      }
    })
  }

  importSchedules() {
    if(confirm('Are you sure you want to edit thie schedule?')) {
      if(this.csvRecords == null) {
        alert('No data imported.')
        window.location.reload()
      }
      else {
        for(let i = 0; i < this.csvRecords.length; i++) {
          this.scheduleService.addSchedule(this.csvRecords[i]).pipe().subscribe();
        }
        this.toastr.success('Schedules added succefully.');
        this.router.navigate(['/schedule/list'])
      }
    }
    else {
      window.location.reload()
    }
  }
}
