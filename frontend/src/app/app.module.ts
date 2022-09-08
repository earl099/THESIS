import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//ROUTING IMPORTS
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//ANGULAR MATERIAL IMPORTS
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

//BACKEND IMPORTS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//STATIC COMPONENTS
import { HeaderComponent } from './components/partials/header/header.component';
import { SearchStudentComponent } from './components/partials/search-student/search-student.component';
import { SearchUserComponent } from './components/partials/search-user/search-user.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { SidenavComponent } from './components/partials/sidenav/sidenav.component';


//BASE COMPONENTS
import { HomeComponent } from './components/pages/index/home/home.component';
import { DashboardComponent } from './components/pages/index/dashboard/dashboard.component';

//STUDENT COMPONENTS
import { StudentListComponent } from './components/pages/student/student-list/student-list.component';
import { AddStudentComponent } from './components/pages/student/add-student/add-student.component';
import { StudentProfileComponent } from './components/pages/student/student-profile/student-profile.component';


//ADMIN MENU COMPONENTS
import { AddUserComponent } from './components/pages/admin-menu/add-user/add-user.component';
import { UserPageComponent } from './components/pages/admin-menu/user-page/user-page.component';
import { UserListComponent } from './components/pages/admin-menu/user-list/user-list.component';
import { EditUserComponent } from './components/pages/admin-menu/edit-user/edit-user.component';
import { CurriculumAddComponent } from './components/pages/admin-menu/curriculum-add/curriculum-add.component';
import { CurriculumEditComponent } from './components/pages/admin-menu/curriculum-edit/curriculum-edit.component';
import { CurriculumListComponent } from './components/pages/admin-menu/curriculum-list/curriculum-list.component';

//ENROLLMENT COMPONENTS
import { AssessmentComponent } from './components/pages/enrollment/assessment/assessment.component';
import { ValidationComponent } from './components/pages/enrollment/validation/validation.component';
import { AddingComponent } from './components/pages/enrollment/adding/adding.component';
import { DroppingComponent } from './components/pages/enrollment/dropping/dropping.component';
import { ChangingComponent } from './components/pages/enrollment/changing/changing.component';

//SCHEDULE COMPONENTS
import { AddScheduleComponent } from './components/pages/schedule/add-schedule/add-schedule.component';
import { EditScheduleComponent } from './components/pages/schedule/edit-schedule/edit-schedule.component';
import { ListScheduleComponent } from './components/pages/schedule/list-schedule/list-schedule.component';

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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StudentListComponent,
    UserListComponent,
    SearchStudentComponent,
    SearchUserComponent,
    NotFoundComponent,
    StudentProfileComponent,
    UserPageComponent,
    SidenavComponent,
    HomeComponent,
    DashboardComponent,
    AddStudentComponent,
    EditUserComponent,
    AssessmentComponent,
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
    GradesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

    // ANGULAR MATERIAL IMPORTS
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

    //BACKEND IMPORTS
    HttpClientModule,

    //ERROR HANDLING
    ToastrModule.forRoot({
      timeOut:2000,
      positionClass:'toast-top-right',
      preventDuplicates: true
    })
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
