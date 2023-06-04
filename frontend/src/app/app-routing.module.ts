import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


//USER CREATED MODULES
import { StudentListComponent } from './components/pages/student/student-list/student-list.component';
import { StudentProfileComponent } from './components/pages/student/student-profile/student-profile.component';
import { UserListComponent } from './components/pages/admin-menu/user/user-list/user-list.component';
import { UserPageComponent } from './components/pages/admin-menu/user/user-page/user-page.component';
import { DashboardComponent } from './components/pages/index/dashboard/dashboard.component';
import { InstallPageComponent } from './components/pages/admin-menu/install-page/install-page.component';
import { CurriculumListComponent } from './components/pages/admin-menu/curriculum/curriculum-list/curriculum-list.component';
import { CurriculumAddComponent } from './components/pages/admin-menu/curriculum/curriculum-add/curriculum-add.component';
import { CurriculumEditComponent } from './components/pages/admin-menu/curriculum/curriculum-edit/curriculum-edit.component';
import { VariableEditComponent } from './components/pages/admin-menu/variable-edit/variable-edit.component';
import { GradesComponent } from './components/pages/student/grades/grades.component';
import { ListScheduleComponent } from './components/pages/schedule/list-schedule/list-schedule.component';
import { ScheduleProfileComponent } from './components/pages/schedule/schedule-profile/schedule-profile.component';
import { GenerateReportComponent } from './components/pages/reports/generate-report/generate-report.component';
import { AdminLoginComponent } from './components/pages/login/admin-login/admin-login.component';
import { EditStudentComponent } from './components/pages/student/edit-student/edit-student.component';
import { CurriculumPageComponent } from './components/pages/admin-menu/curriculum/curriculum-page/curriculum-page.component';
import { ContentListComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-list/content-list.component';
import { ContentAddComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-add/content-add.component';
import { ContentPageComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-page/content-page.component';
import { ContentEditComponent } from './components/pages/admin-menu/curriculum/content-curriculum/content-edit/content-edit.component';
import { AssessedListComponent } from './components/pages/enrollment/assessed-list/assessed-list.component';
import { EnrolledListComponent } from './components/pages/enrollment/enrolled-list/enrolled-list.component';

//AUTHGUARD
import { AuthGuard } from './shared/authguard/auth.guard';




const routes: Routes = [
  //REDIRECT TO HOME
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //DASHBOARD PAGE
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  /*--- ADMIN SUBMENU ---*/
  //ACCOUNT LIST
  { path: 'account/list', component: UserListComponent, canActivate: [AuthGuard] },

  //USER PAGE
  { path: 'account/profile/:collegeID', component: UserPageComponent, canActivate: [AuthGuard] },

  //CURRICULUM LIST PAGE
  { path: 'curriculum/list', component: CurriculumListComponent, canActivate: [AuthGuard] },

  //ADD CURRICULUM PAGE
  { path: 'curriculum/add', component: CurriculumAddComponent, canActivate: [AuthGuard] },

  //EDIT CURRICULUM PAGE
  { path: 'curriculum/edit/:id', component: CurriculumEditComponent, canActivate: [AuthGuard] },

  //CURRICULUM PROFILE PAGE
  { path: 'curriculum/profile/:id', component: CurriculumPageComponent, canActivate: [AuthGuard] },

  //CURRICULUM CONTENT LIST PAGE
  { path: 'curriculum/content/:refid', component: ContentListComponent, canActivate: [AuthGuard] },

  //CURRICULUM CONTENT ADD PAGE
  { path: 'curriculum/content/:refid/add', component: ContentAddComponent, canActivate: [AuthGuard] },

  //CURRICULUM CONTENT PROFILE PAGE
  { path: 'curriculum/content/:refid/:id', component: ContentPageComponent, canActivate: [AuthGuard] },

  //CURRICULUM CONTENT EDIT PAGE
  { path: 'curriculum/content/:refid/:id/edit', component: ContentEditComponent, canActivate: [AuthGuard] },

  //GLOBAL VARIABLES PAGE
  { path: 'variables/edit', component: VariableEditComponent, canActivate: [AuthGuard] },

  /*--- STUDENT SUBMENU ---*/
  //STUDENT LIST PAGE
  { path: 'student/list', component: StudentListComponent, canActivate: [AuthGuard] },
  { path: 'student/search/:searchTerm', component: StudentListComponent, canActivate: [AuthGuard] },

  //STUDENT PAGE
  { path: 'student/profile/:studentNumber', component: StudentProfileComponent, canActivate: [AuthGuard] },

  //STUDENT GRADES PAGE
  { path: 'student/grades', component: GradesComponent, canActivate: [AuthGuard] },

  //EDIT STUDENT PAGE
  { path: 'student/edit/:studentNumber', component: EditStudentComponent, canActivate: [AuthGuard] },

  /*--- SCHEDULE SUBMENU ---*/
  //SCHEDULE LIST PAGE
  { path: 'schedule/list', component: ListScheduleComponent, canActivate: [AuthGuard] },

  //SCHEDULE PROFILE PAGE
  { path: 'schedule/:schedcode', component: ScheduleProfileComponent, canActivate: [AuthGuard] },

  /*--- ENROLLMENT SUBMENU ---*/
  //ASSESSED PAGE
  { path: 'enrollment/assessed_list', component: AssessedListComponent, canActivate: [AuthGuard] },

  //ENROLLED LIST PAGE
  { path: 'enrollment/enrolled_list', component: EnrolledListComponent, canActivate: [AuthGuard] },

  /*--- REPORTS SUBMENU ---*/
  //GENERATE REPORTS PAGE
  { path: 'report/generate', component: GenerateReportComponent, canActivate: [AuthGuard] },

  { path: 'login', component: AdminLoginComponent },

  //INSTALLATION PAGE
  { path: 'install', component: InstallPageComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
