import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceComponent } from './components/fileTab/resource/resource.component';
import { FileTabComponent } from './components/fileTab/fileTab.component';

const routes: Routes = [
  { path: 'home', component: FileTabComponent },
  { path: 'resource', component: ResourceComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }