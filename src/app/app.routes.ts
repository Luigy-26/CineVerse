import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'movie/:id', component: MovieDetailComponent},
    {path:'**', redirectTo: ''}
];
