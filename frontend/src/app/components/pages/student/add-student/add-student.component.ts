import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  csvRecords: any;
  header: boolean = true;

  constructor(
    private studentService: StudentService,
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

  importStudents() {
    if(confirm("Are you sure you want to import this data?")) {
      if(this.csvRecords == null) {
        alert("No data imported.");
        window.location.reload();
      }
      else{
        for (let i = 0; i < this.csvRecords.length; i++) {
          this.studentService.addStudent(this.csvRecords[i]).pipe().subscribe((res) => {
            if(res) {
              this.toastr.success(res.message);
            }
          });
        }
        alert("Students imported successfully.");
        this.router.navigate(['/student/list'])
      }
    }
  }

  numberFilter(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
