import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { CurriculumService } from 'src/app/services/curriculum.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-curriculum-add',
  templateUrl: './curriculum-add.component.html',
  styleUrls: ['./curriculum-add.component.scss']
})
export class CurriculumAddComponent implements OnInit {
  angForm: any;
  csvRecords: any;
  header: boolean = true;
  variables: any;

  @ViewChild('fileImportInput') fileImportInput: any;

  constructor(
    private curriculumService: CurriculumService,
    private variableService: VariableService,
    private toastr: ToastrService,
    private csvParser: NgxCsvParser,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      course: new FormControl({ value: '', disabled: false }, Validators.required),
      coursemajor: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })
    this.getVariables()
  }

  addCurriculum(angForm: any) {
    if(angForm.course.value == '' || angForm.coursemajor.value == '') {
      alert('No data to add.')
      window.location.reload()
    }
    else {
      this.curriculumService.addCurriculum(angForm.value).pipe(first()).subscribe((res) => {

      })
    }
  }

  importCurriculum() {
    if(confirm('Are you sure you want to import this data')) {
      if(this.csvRecords == null) {
        alert('No data imported.');
        window.location.reload()
      }
      else {
        for(let i = 0; i < this.csvRecords.length; i++) {
          let data: any = this.fb.group({
            course: new FormControl(this.csvRecords[i].course),
            coursemajor: new FormControl(this.csvRecords[i].coursemajor),
            schoolyear: new FormControl(this.angForm.get('schoolyear').value)
          })

          this.curriculumService.addCurriculum(data.value).pipe(first()).subscribe((res) => {
            if(res) {
              this.toastr.success(res.message)
            }
          })
        }
        alert('Data imported successfully.');
        this.router.navigate(['/curriculum/list']);
      }
    }
    else {
      window.location.reload()
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
        console.log('Result:', result);
        this.csvRecords = result;
        console.log(this.csvRecords);
      },
      error: (error: NgxCSVParserError) => {
        console.log('Error:', error)
      }
    })
  }

  getVariables() {
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.toastr.success(res.message)
        this.variables = res.legend[0]
        this.angForm = this.fb.group({
          course: new FormControl({ value: '', disabled: false }, Validators.required),
          coursemajor: new FormControl({ value: '', disabled: false }),
          schoolyear: new FormControl({value: this.variables.schoolyear, disabled: false})
        })
      }
    })
  }
}
