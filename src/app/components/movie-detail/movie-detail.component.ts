/*
 * Componente para mostrar detalles completos de una película.
 * - Obtener ID de película desde la URL
 * - Buscar película en las 3 listas (popular, topRated, upcoming)
 * - Mostrar información detallada con backdrop y poster
 * - Navegación de regreso al inicio
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material para diseño de tarjetas, botones, íconos, etc.
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

// RxJS para manejar múltiples observables
import { forkJoin } from 'rxjs';
import { Api, Movie } from '../../service/api';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  // Propiedades para manejar la película, estado de carga y errores
  movie: Movie | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,  // Para leer parámetros de la URL
    private router: Router, // Para navegación entre rutas
    private api: Api  // Servicio para obtener las películas
  ){}

  ngOnInit(): void{
    // Suscribirse a los parámetros de la ruta y obtener el ID de la película
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId){
        this.loadMovieDetail(movieId);
      }
    });
  }

  // Método para cargar los detalles de la película
  loadMovieDetail(movieId: string): void {
    this.error = false;
    this.loading = true;

    forkJoin([
      this.api.getPopularMovies(),
      this.api.getTopRatedMovies(),
      this.api.getUpcomingMovies()
    ]).subscribe({
      // Buscar la película en las tres listas
      next: ([popular, topRated, upcoming]) => {
        this.movie = 
          popular.results.find(m => m.id.toString() === movieId) ||
          topRated.results.find(m => m.id.toString() === movieId) ||
          upcoming.results.find(m => m.id.toString() === movieId) ||
          null;
        this.loading = false;
        if (!this.movie) this.error = true;
      },
      error: (error) => {
        // Manejo de error en la solicitud HTTP
        console.error('Error loading movie detail:', error);
        this.loading = false;
        this.error = true;
      }
    })
  }

  // Método para obtener la URL de la imagen de la película
  getImageUrl(posterPath: string): string {
    return posterPath 
      ? `https://image.tmdb.org/t/p/original${posterPath}`
      : 'assets/no-image.jpg';
  }

  // Método para navegar de regreso al inicio
  goBack(): void {
    this.router.navigate(['/']);
  }
} 