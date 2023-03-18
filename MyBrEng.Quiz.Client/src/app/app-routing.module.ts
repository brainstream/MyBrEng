import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'quiz',
    loadChildren: () => import('@app/quiz').then(m => m.QuizModule)
  }, {
    path: 'student',
    loadChildren: () => import('@app/student').then(m => m.StudentModule)
  }, {
    path: 'go',
    loadChildren: () => import('@app/go').then(m => m.GoModule)
  }, {
    path: '**',
    redirectTo: 'quiz'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
