import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/services/schedule.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {
  processData: any

  csvRecords: any;
  header: boolean = true

  constructor(
    private scheduleService: ScheduleService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private csvParser: NgxCsvParser
  ) { }

  @ViewChild('fileImportInput') fileImportInput: any;

  ngOnInit(): void {
    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false })
    })
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
    if(confirm('Are you sure you want to edit this schedule?')) {
      if(this.csvRecords == null) {
        alert('No data imported.')
        window.location.reload()
      }
      else {
        for(let i = 0; i < this.csvRecords.length; i++) {
          this.scheduleService.addSchedule(this.csvRecords[i]).pipe().subscribe();

          this.variableService.getIpAddress().subscribe((res) => {
            if(res) {
              let ipAdd = res.clientIp

              this.processData.get('username').setValue(localStorage.getItem('user'))
              this.processData.get('ipaddress').setValue(ipAdd)
              this.processData.get('pcname').setValue(window.location.hostname)
              this.processData.get('studentnumber').setValue('N/A')
              this.processData.get('type').setValue('Imported Schedule')
              this.processData.get('description').setValue(`Added ${this.csvRecords[i].schedcode} to list of schedules.`)
              this.variableService.addProcess(this.processData).subscribe()
            }
          })
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
