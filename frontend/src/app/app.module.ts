import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//ROUTING IMPORTS
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//ANGULAR MATERIAL IMPORTS
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper'
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

//BACKEND IMPORTS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//STATIC COMPONENTS
import { HeaderComponent } from './components/partials/header/header.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { SidenavComponent } from './components/partials/sidenav/sidenav.component';


//BASE COMPONENTS
import { DashboardComponent } from './components/pages/index/dashboard/dashboard.component';

//STUDENT COMPONENTS
import { StudentListComponent } from './components/pages/student/student-list/student-list.component';
import { StudentProfileComponent } from './components/pages/student/student-profile/student-profile.component';
import { EditStudentComponent } from './components/pages/student/edit-student/edit-student.component';

//ADMIN MENU COMPONENTS
import { UserPageComponent } from './components/pages/admin-menu/user/user-page/user-page.component';
import { UserListComponent } from './components/pages/admin-menu/user/user-list/user-list.component';
import { CurriculumAddComponent } from './components/pages/admin-menu/curriculum/curriculum-add/curriculum-add.component';
import { CurriculumEditComponent } from './components/pages/admin-menu/curriculum/curriculum-edit/curriculum-edit.component';
import { CurriculumListComponent } from './components/pages/admin-menu/curriculum/curriculum-list/curriculum-list.component';
import { CurriculumPageComponent } from './components/pages/admin-menu/curriculum/curriculum-page/curriculum-page.component';
import { ContentAddComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-add/content-add.component';
import { ContentEditComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-edit/content-edit.component';
import { ContentListComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-list/content-list.component';
import { ContentPageComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-page/content-page.component';

//GLOBAL VARIABLES COMPONENT
import { VariableEditComponent } from './components/pages/admin-menu/variable-edit/variable-edit.component';
import { InstallPageComponent } from './components/pages/admin-menu/install-page/install-page.component';

//ENROLLMENT COMPONENTS
import { AssessedListComponent } from './components/pages/enrollment/assessed-list/assessed-list.component';
import { EnrolledListComponent } from './components/pages/enrollment/enrolled-list/enrolled-list.component';

//SCHEDULE COMPONENTS
import { ListScheduleComponent } from './components/pages/schedule/list-schedule/list-schedule.component';
import { ScheduleProfileComponent } from './components/pages/schedule/schedule-profile/schedule-profile.component';

//LOGIN COMPONENTS
import { AdminLoginComponent } from './components/pages/login/admin-login/admin-login.component';

//REPORTS COMPONENTS
import { GenerateReportComponent } from './components/pages/reports/generate-report/generate-report.component';
import { GradesComponent } from './components/pages/student/grades/grades.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './shared/authguard/auth.interceptor';

//CSV PARSER MODULE
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { CsvModule } from '@ctrl/ngx-csv';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StudentListComponent,
    UserListComponent,
    NotFoundComponent,
    StudentProfileComponent,
    UserPageComponent,
    SidenavComponent,
    DashboardComponent,
    AdminLoginComponent,
    ListScheduleComponent,
    GenerateReportComponent,
    CurriculumAddComponent,
    CurriculumEditComponent,
    CurriculumListComponent,
    GradesComponent,
    EditStudentComponent,
    ScheduleProfileComponent,
    VariableEditComponent,
    InstallPageComponent,
    CurriculumPageComponent,
    ContentAddComponent,
    ContentEditComponent,
    ContentListComponent,
    ContentPageComponent,
    AssessedListComponent,
    EnrolledListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

    // ANGULAR MATERIAL IMPORTS
    MatAutocompleteModule,
    MatTableModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatRadioModule,
    MatTabsModule,
    MatDialogModule,

    //BACKEND IMPORTS
    HttpClientModule,

    //NOTIFICATION
    ToastrModule.forRoot({
      timeOut:2000,
      positionClass:'toast-bottom-right',
      preventDuplicates: true
    }),

    //CSV PARSER MODULE
    NgxCsvParserModule,
    CsvModule,

    //POPOVER MODULE
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
