import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//ROUTING IMPORTS
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//ANGULAR MATERIAL IMPORTS
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatStepperModule } from '@angular/material/stepper'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';

//BACKEND IMPORTS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//STATIC COMPONENTS
import { HeaderComponent } from './components/partials/header/header.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { SidenavComponent } from './components/partials/sidenav/sidenav.component';


//BASE COMPONENTS
import { HomeComponent } from './components/pages/index/home/home.component';
import { DashboardComponent } from './components/pages/index/dashboard/dashboard.component';

//STUDENT COMPONENTS
import { StudentListComponent } from './components/pages/student/student-list/student-list.component';
import { AddStudentComponent } from './components/pages/student/add-student/add-student.component';
import { StudentProfileComponent } from './components/pages/student/student-profile/student-profile.component';
import { EditStudentComponent } from './components/pages/student/edit-student/edit-student.component';

//ADMIN MENU COMPONENTS
import { AddUserComponent } from './components/pages/admin-menu/user/add-user/add-user.component';
import { UserPageComponent } from './components/pages/admin-menu/user/user-page/user-page.component';
import { UserListComponent } from './components/pages/admin-menu/user/user-list/user-list.component';
import { EditUserComponent } from './components/pages/admin-menu/user/edit-user/edit-user.component';
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
import { ValidationComponent } from './components/pages/enrollment/validation/validation.component';
import { AddingComponent } from './components/pages/enrollment/adding/adding.component';
import { DroppingComponent } from './components/pages/enrollment/dropping/dropping.component';
import { ChangingComponent } from './components/pages/enrollment/changing/changing.component';
import { RegformReprintComponent } from './components/pages/enrollment/reprint/regform-reprint/regform-reprint.component';
import { CogReprintComponent } from './components/pages/enrollment/reprint/cog-reprint/cog-reprint.component';

//SCHEDULE COMPONENTS
import { AddScheduleComponent } from './components/pages/schedule/add-schedule/add-schedule.component';
import { EditScheduleComponent } from './components/pages/schedule/edit-schedule/edit-schedule.component';
import { ListScheduleComponent } from './components/pages/schedule/list-schedule/list-schedule.component';
import { ScheduleProfileComponent } from './components/pages/schedule/schedule-profile/schedule-profile.component';

//LOGIN COMPONENTS
import { UserLoginComponent } from './components/pages/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/pages/login/admin-login/admin-login.component';

//REPORTS COMPONENTS
import { GenerateReportComponent } from './components/pages/reports/generate-report/generate-report.component';
import { LoaListComponent } from './components/pages/reports/loa/loa-list/loa-list.component';
import { LoaAddComponent } from './components/pages/reports/loa/loa-add/loa-add.component';
import { ShifteeListComponent } from './components/pages/reports/shiftee/shiftee-list/shiftee-list.component';
import { ShifteeAddComponent } from './components/pages/reports/shiftee/shiftee-add/shiftee-add.component';
import { GradesComponent } from './components/pages/student/grades/grades.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './shared/authguard/auth.interceptor';

//CSV PARSER MODULE
import { NgxCsvParserModule } from 'ngx-csv-parser';




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
    HomeComponent,
    DashboardComponent,
    AddStudentComponent,
    EditUserComponent,
    ValidationComponent,
    AddingComponent,
    DroppingComponent,
    ChangingComponent,
    AddScheduleComponent,
    EditScheduleComponent,
    UserLoginComponent,
    AdminLoginComponent,
    ListScheduleComponent,
    GenerateReportComponent,
    ShifteeAddComponent,
    ShifteeListComponent,
    LoaListComponent,
    LoaAddComponent,
    AddUserComponent,
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
    RegformReprintComponent,
    CogReprintComponent
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
    MatFileUploadModule,
    MatStepperModule,
    MatRadioModule,
    MatTabsModule,

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
