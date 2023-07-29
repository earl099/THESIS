import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, concatMap, delay, delayWhen, from, interval, of } from 'rxjs';
import { ngxCsv } from 'ngx-csv';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-list-schedule',
  templateUrl: './list-schedule.component.html',
  styleUrls: ['./list-schedule.component.scss']
})
export class ListScheduleComponent implements OnInit {
  globalVar: any = [{}]

  columns: string[] = [
    'schedcode',
    'subjectCode',
    'subjectTitle',
    'edit',
    'view'
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  titles: any = []
  schedules: any = [];
  dataSource!: MatTableDataSource<any>;
  isShown: boolean = false
  isEditOpen: boolean = false
  tableData: any
  processData: any
  csvRecords: any
  header: boolean = true

  angForm: any;
  schedcode: any;
  schedule: any;
  scheduleCheckers: string[] = [
    'N',
    'N',
    'N',
    'N',
  ];

  counter = 0;
  visibleAddBtn = true;
  visibleDeleteBtn = false;
  scheduleFields: boolean[] = [
    false,
    false,
    false
  ]
  pageStyle: any
  @ViewChild('fileImportInput') fileImportInput: any;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private variableService: VariableService,
    private enrollmentService: EnrollmentService,
    private csvParser: NgxCsvParser,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      timein1: new FormControl({ value: '', disabled: false }),
      timeout1: new FormControl({ value: '', disabled: false }),
      day1: new FormControl({ value: '', disabled: false }),
      room1: new FormControl({ value: '', disabled: false }),
      timein2: new FormControl({ value: '', disabled: false }),
      timeout2: new FormControl({ value: '', disabled: false }),
      day2: new FormControl({ value: '', disabled: false }),
      room2: new FormControl({ value: '', disabled: false }),
      timein3: new FormControl({ value: '', disabled: false }),
      timeout3: new FormControl({ value: '', disabled: false }),
      day3: new FormControl({ value: '', disabled: false }),
      room3: new FormControl({ value: '', disabled: false }),
      timein4: new FormControl({ value: '', disabled: false }),
      timeout4: new FormControl({ value: '', disabled: false }),
      day4: new FormControl({ value: '', disabled: false }),
      room4: new FormControl({ value: '', disabled: false }),
      ok1: new FormControl({ value: '', disabled: false }),
      ok2: new FormControl({ value: '', disabled: false }),
      ok3: new FormControl({ value: '', disabled: false }),
      ok4: new FormControl({ value: '', disabled: false }),
      oras: new FormControl({ value: '', disabled: false }),
    })

    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false })
    })

    this.getSchedules();
  }

  getSchedules() {
    let specialCodes
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend

        this.scheduleService.getSchedulesBySemSY(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            //this.toastr.success(res.message);
            this.schedules = res.schedules;

            this.enrollmentService.getSubjects().subscribe((res) => {
              specialCodes = res.subjects
              console.log(specialCodes)

              for(let i = 0; i < this.schedules.length; i++) {
                for (let j = 0; j < specialCodes.length; j++) {
                  if(this.schedules[i].subjectCode == specialCodes[j].subjectcode) {
                    Object.assign(this.schedules[i], { subjectTitle: specialCodes[j].subjectTitle })
                    break
                  }
                }

                if(i == this.schedules.length - 1) {
                  this.dataSource = new MatTableDataSource(this.schedules);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
              }
            })


          }
        })
      }
    })
  }

  openEdit(schedcode: any) {
    if(this.isShown) {
      this.toastr.error('Currently Viewing Schedule Information.')

    }
    else {
      this.isEditOpen = !this.isEditOpen
      this.getSchedule(schedcode)
      if(this.isEditOpen) {
        this.pageStyle = '12rem'
      }
      else {
        this.pageStyle = '0%'
      }
    }

  }

  showInfo(schedcode: any) {
    if(this.isEditOpen) {
      this.toastr.error('Currently Editing Schedule Details.')
    }
    else {
      this.isShown = !this.isShown
      for(let i = 0; i < this.schedules.length; i++) {
        if(schedcode != this.schedules[i].schedcode) {
          continue
        }
        else {
          this.tableData = this.schedules[i]
          if(this.isShown) {
            this.pageStyle = '12rem'
          }
          else {
            this.pageStyle = '0%'
          }
        }
      }
    }
  }

  importSchedules() {
    if(confirm('Are you sure you want to edit this schedule?')) {
      if(this.csvRecords == null) {
        this.toastr.error("No Records Added.")
      }
      else {
        for(let i = 0; i < this.csvRecords.length; i++) {
          this.scheduleService.addSchedule(this.csvRecords[i]).subscribe();

          this.variableService.getIpAddress().subscribe((res) => {
            if(res) {
              let ipAdd = res.clientIp

              this.processData.get('username').setValue(localStorage.getItem('user'))
              this.processData.get('ipaddress').setValue(ipAdd)
              this.processData.get('pcname').setValue(window.location.hostname)
              this.processData.get('studentnumber').setValue('N/A')
              this.processData.get('type').setValue('Imported Schedule')
              this.processData.get('description').setValue(`Added ${this.csvRecords[i].schedcode} to list of schedules.`)
              this.variableService.addProcess(this.processData.value).subscribe()
            }
          })
        }
        this.toastr.success('Schedules added successfully.');
        this.getSchedules()
      }
    }
    else {
      this.toastr.info('Import Canceled.')
    }
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

  getSchedule(schedcode: any) {
    this.scheduleService.getSchedule(Number(schedcode)).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.schedule = res.schedule;
        console.log(this.schedule)
        this.angForm.get('timein1').setValue(this.schedule.timein1)
        this.angForm.get('timeout1').setValue(this.schedule.timeout1)
        this.angForm.get('day1').setValue(this.schedule.day1)
        this.angForm.get('room1').setValue(this.schedule.room1)
        this.angForm.get('timein2').setValue(this.schedule.timein2)
        this.angForm.get('timeout2').setValue(this.schedule.timeout2)
        this.angForm.get('day2').setValue(this.schedule.day2)
        this.angForm.get('room2').setValue(this.schedule.room2)
        this.angForm.get('timein3').setValue(this.schedule.timein3)
        this.angForm.get('timeout3').setValue(this.schedule.timeout3)
        this.angForm.get('day3').setValue(this.schedule.day3)
        this.angForm.get('room3').setValue(this.schedule.room3)
        this.angForm.get('timein4').setValue(this.schedule.timein4)
        this.angForm.get('timeout4').setValue(this.schedule.timeout4)
        this.angForm.get('day4').setValue(this.schedule.day4)
        this.angForm.get('room4').setValue(this.schedule.room4)

        this.checkerFunction()

        this.angForm.get('oras').setValue(this.schedule.oras)
      }
    })
  }

  onAddSchedule() {

    switch(this.counter) {
      case 0:
      case 1:
        this.scheduleFields[this.counter] = true
        this.counter++;
        break;

      case 2:
        this.scheduleFields[this.counter] = true
        this.visibleAddBtn = false;
        break;
    }
    this.visibleDeleteBtn = true;

    // console.log(this.scheduleFields)
    // console.log(this.counter)
  }

  onDeleteSchedule() {
    if(this.counter != 0) {
      switch(this.counter) {
        case 0:
          this.scheduleFields[this.counter] = false
          break;

        case 1:
        case 2:
          if(this.scheduleFields[this.counter]) {
            this.scheduleFields[this.counter] = false
            this.counter--;
          }
          else {
            this.counter--;
            this.scheduleFields[this.counter] = false
          }

          break;
      }
      this.visibleAddBtn = true

      console.log(this.scheduleFields)
      console.log(this.counter)
    }
    else if(this.counter == 0) {
      if(this.angForm.get('timein2').value != 'N/A') {
        this.scheduleFields[this.counter] = true
        this.visibleAddBtn = true;
        this.visibleDeleteBtn = false;
      }
      else {
        this.scheduleFields[this.counter] = false
        this.visibleAddBtn = true;
        this.visibleDeleteBtn = false;
      }

    }
    // console.log(this.scheduleFields)
    // console.log(this.counter)
  }

  onEditSchedule(schedcode: number, angForm: any) {
    // console.log(angForm.value)
    if(confirm('Are you sure you want to edit this schedule?')) {
      angForm.get('day1').setValue(angForm.get('day1').value.toUpperCase());
      angForm.get('room1').setValue(angForm.get('room1').value.toUpperCase());
      angForm.get('day2').setValue(angForm.get('day2').value.toUpperCase());
      angForm.get('room2').setValue(angForm.get('room2').value.toUpperCase());
      angForm.get('day3').setValue(angForm.get('day3').value.toUpperCase());
      angForm.get('room3').setValue(angForm.get('room3').value.toUpperCase());
      angForm.get('room4').setValue(angForm.get('room4').value.toUpperCase());

      this.checkerFunction()

      this.scheduleService.editSchedule(schedcode, angForm.value).subscribe((res) => {
        if(res) {
          this.variableService.getIpAddress().subscribe((res) => {
            if(res) {
              let ipAdd = res.clientIp

              this.processData.get('username').setValue(localStorage.getItem('user'))
              this.processData.get('ipaddress').setValue(ipAdd)
              this.processData.get('pcname').setValue(window.location.hostname)
              this.processData.get('studentnumber').setValue('N/A')
              this.processData.get('type').setValue('Imported Schedule')
              this.processData.get('description').setValue(`Modified ${schedcode}'s data.`)
              this.variableService.addProcess(this.processData.value).subscribe()
            }
          })

          this.toastr.success(res.message)
          this.router.navigate([`schedule/${schedcode}`])
        }
      })
    }
    else {
      window.location.reload()
    }


  }

  checkerFunction() {
    if(this.angForm.get('timein1').value != 'N/A') {
      this.scheduleCheckers[0] = 'Y'
      this.angForm.get('ok1').setValue(this.scheduleCheckers[0])
    }
    else {
      this.angForm.get('ok1').setValue(this.scheduleCheckers[0])
    }

    if(this.angForm.get('timein2').value != 'N/A') {
      this.scheduleCheckers[1] = 'Y'
      this.angForm.get('ok2').setValue(this.scheduleCheckers[1])
      this.scheduleFields[0] = true
    }
    else {
      this.angForm.get('ok2').setValue(this.scheduleCheckers[1])
    }

    if(this.angForm.get('timein3').value != 'N/A') {
      this.scheduleCheckers[2] = 'Y'
      this.angForm.get('ok3').setValue(this.scheduleCheckers[2])
      this.scheduleFields[1] = true
    }
    else {
      this.angForm.get('ok3').setValue(this.scheduleCheckers[2])
    }

    if(this.angForm.get('timein4').value != 'N/A') {
      this.scheduleCheckers[3] = 'Y'
      this.angForm.get('ok4').setValue(this.scheduleCheckers[3])
      this.scheduleFields[2] = true
    }
    else {
      this.angForm.get('ok4').setValue(this.scheduleCheckers[3])
    }
  }

  downloadTemplate() {
    let columns = [
      'schedcode',
      'subjectCode',
      'units',
      'semester',
      'schoolyear',
      'slots',
      'subjectype',
      'section',
      'instructor',
      'tuition',
      'graded',
      'gradeddate',
      'timein1',
      'timeout1',
      'day1',
      'room1',
      'timein2',
      'timeout2',
      'day2',
      'room2',
      'timein3',
      'timeout3',
      'day3',
      'room3',
      'timein4',
      'timeout4',
      'day4',
      'room4',
      'ok1',
      'ok2',
      'ok3',
      'ok4',
      'oras',
      'ojt',
      'petition',
      'thesis',
      'labunits',
      'internet',
      'residency',
      'encodegrade',
      'gradingpart',
      'id',
    ]

    let options = {
      headers: columns,
      showLabels: true
    }

    new ngxCsv({}, 'schedule-list-template', options)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
