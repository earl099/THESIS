import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


//USER CREATED MODULES
import { AddStudentComponent } from './components/pages/student/add-student/add-student.component';
import { StudentListComponent } from './components/pages/student/student-list/student-list.component';
import { StudentProfileComponent } from './components/pages/student/student-profile/student-profile.component';
import { UserListComponent } from './components/pages/admin-menu/user-list/user-list.component';
import { UserPageComponent } from './components/pages/admin-menu/user-page/user-page.component';
import { DashboardComponent } from './components/pages/index/dashboard/dashboard.component';
import { HomeComponent } from './components/pages/index/home/home.component';
import { InstallPageComponent } from './components/pages/admin-menu/install-page/install-page.component';
import { AddUserComponent } from './components/pages/admin-menu/add-user/add-user.component';
import { EditUserComponent } from './components/pages/admin-menu/edit-user/edit-user.component';
import { CurriculumListComponent } from './components/pages/admin-menu/curriculum-list/curriculum-list.component';
import { CurriculumAddComponent } from './components/pages/admin-menu/curriculum-add/curriculum-add.component';
import { CurriculumEditComponent } from './components/pages/admin-menu/curriculum-edit/curriculum-edit.component';
import { VariableEditComponent } from './components/pages/admin-menu/variable-edit/variable-edit.component';
import { GradesComponent } from './components/pages/student/grades/grades.component';
import { AddScheduleComponent } from './components/pages/schedule/add-schedule/add-schedule.component';
import { EditScheduleComponent } from './components/pages/schedule/edit-schedule/edit-schedule.component';
import { ListScheduleComponent } from './components/pages/schedule/list-schedule/list-schedule.component';
import { ScheduleProfileComponent } from './components/pages/schedule/schedule-profile/schedule-profile.component';
import { GenerateReportComponent } from './components/pages/reports/generate-report/generate-report.component';
import { LoaAddComponent } from './components/pages/reports/loa/loa-add/loa-add.component';
import { LoaListComponent } from './components/pages/reports/loa/loa-list/loa-list.component';
import { ShifteeAddComponent } from './components/pages/reports/shiftee/shiftee-add/shiftee-add.component';
import { ShifteeListComponent } from './components/pages/reports/shiftee/shiftee-list/shiftee-list.component';
import { AssessmentComponent } from './components/pages/enrollment/assessment/assessment.component';
import { ValidationComponent } from './components/pages/enrollment/validation/validation.component';
import { AddingComponent } from './components/pages/enrollment/adding/adding.component';
import { ChangingComponent } from './components/pages/enrollment/changing/changing.component';
import { DroppingComponent } from './components/pages/enrollment/dropping/dropping.component';
import { UserLoginComponent } from './components/pages/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/pages/login/admin-login/admin-login.component';
import { EditStudentComponent } from './components/pages/student/edit-student/edit-student.component';

//AUTHGUARD
import { AuthGuard } from './shared/authguard/auth.guard';



const routes: Routes = [
  //REDIRECT TO HOME
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  //HOME PAGE
  { path: 'home', component: HomeComponent },

  //DASHBOARD PAGE
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  /*--- ADMIN SUBMENU ---*/
  //ACCOUNT LIST
  { path: 'account/list', component: UserListComponent, canActivate: [AuthGuard] },

  //ADD ACCOUNT PAGE
  { path: 'account/add', component: AddUserComponent, canActivate: [AuthGuard]},

  //EDIT ACCOUNT PAGE
  { path: 'account/edit/:collegeID', component: EditUserComponent, canActivate: [AuthGuard] },

  //USER PAGE
  { path: 'account/profile/:collegeID', component: UserPageComponent, canActivate: [AuthGuard] },

  //CURRICULUM LIST PAGE
  { path: 'curriculum/list', component: CurriculumListComponent, canActivate: [AuthGuard] },

  //ADD CURRICULUM PAGE
  { path: 'curriculum/add', component: CurriculumAddComponent, canActivate: [AuthGuard] },

  //EDIT CURRICULUM PAGE
  { path: 'curriculum/edit/:refid', component: CurriculumEditComponent, canActivate: [AuthGuard] },

  //GLOBAL VARIABLES PAGE
  { path: 'variables/edit', component: VariableEditComponent, canActivate: [AuthGuard] },

  /*--- STUDENT SUBMENU ---*/
  //STUDENT LIST PAGE
  { path: 'student/list', component: StudentListComponent, canActivate: [AuthGuard] },
  { path: 'student/search/:searchTerm', component: StudentListComponent, canActivate: [AuthGuard] },

  //STUDENT PAGE
  { path: 'student/profile/:studentNumber', component: StudentProfileComponent, canActivate: [AuthGuard] },

  //ADD STUDENT PAGE
  { path: 'student/add', component: AddStudentComponent, canActivate: [AuthGuard] },

  //STUDENT GRADES PAGE
  { path: 'student/grades', component: GradesComponent, canActivate: [AuthGuard] },

  //EDIT STUDENT PAGE
  { path: 'student/edit/:studentNumber', component: EditStudentComponent, canActivate: [AuthGuard] },

  /*--- SCHEDULE SUBMENU ---*/
  //ADD SCHEDULE PAGE
  { path: 'schedule/add', component: AddScheduleComponent, canActivate: [AuthGuard] },

  //EDIT SCHEDULE PAGE
  { path: 'schedule/edit/:schedcode', component: EditScheduleComponent, canActivate: [AuthGuard] },

  //SCHEDULE LIST PAGE
  { path: 'schedule/list', component: ListScheduleComponent, canActivate: [AuthGuard] },

  //SCHEDULE PROFILE PAGE
  { path: 'schedule/:schedcode', component: ScheduleProfileComponent, canActivate: [AuthGuard] },

  /*--- ENROLLMENT SUBMENU ---*/
  //ASSESSMENT PAGE
  { path: 'enrollment/assessment', component: AssessmentComponent, canActivate: [AuthGuard] },

  //VALIDATION PAGE
  { path: 'enrollment/validation', component: ValidationComponent, canActivate: [AuthGuard] },

  //ADDING PAGE
  { path: 'enrollment/adding', component: AddingComponent, canActivate: [AuthGuard] },

  //DROPPING PAGE
  { path: 'enrollment/dropping', component: DroppingComponent, canActivate: [AuthGuard] },

  //CHANGING PAGE
  { path: 'enrollment/changing', component: ChangingComponent, canActivate: [AuthGuard] },

  /*--- REPORTS SUBMENU ---*/
  //GENERATE REPORTS PAGE
  { path: 'report/generate', component: GenerateReportComponent, canActivate: [AuthGuard] },

  //ADD LOA PAGE
  { path: 'report/loa/add', component: LoaAddComponent, canActivate: [AuthGuard] },

  //LOA LIST PAGE
  { path: 'report/loa/list', component: LoaListComponent, canActivate: [AuthGuard] },

  //ADD SHIFTEE PAGE
  { path: 'report/shiftee/add', component: ShifteeAddComponent, canActivate: [AuthGuard] },

  //SHIFTEE LIST PAGE
  { path: 'report/shiftee/list', component: ShifteeListComponent, canActivate: [AuthGuard] },

  /*--- LOGIN SECTION ---*/
  { path: 'login/user', component: UserLoginComponent },

  { path: 'login/admin', component: AdminLoginComponent },

  //INSTALLATION PAGE
  { path: 'install', component: InstallPageComponent, canActivate: [AuthGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
