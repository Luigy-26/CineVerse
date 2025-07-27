/*
 * Componente principal que maneja la página de inicio de CineVerse.
 * - Cargar películas populares, mejor calificadas y próximas
 * - Gestionar paginación (máximo 5 páginas por sección)
 * - Navegación suave entre secciones
 * - Scroll al inicio de la página
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Angular Material para tarjetas, botones, carga, chips, etc.
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

// Importación de la API y las interfaces
import { Api, Movie, MovieResponse } from '../../service/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  //Arreglos para almacenar las peliculas
  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];
  //estado de carga de las peliculas
  loading = {
    popular: true,
    topRated: true,
    upcoming: true
  };
  
  // Paginación
  popularPage = 1;
  topRatedPage = 1;
  upcomingPage = 1;

  constructor(private api: Api) {}

  // Método donde se cargan las peliculas
  ngOnInit(): void {
    this.loadMovies();
  }

   /**
   * Carga inicial de películas desde la API para cada sección.
   * Cada sección se maneja por separado para mostrar el estado de carga individual.
   */
  loadMovies(): void {
    // Cargar películas populares
    this.api.getPopularMovies().subscribe({
      next: (response: MovieResponse) => {
        this.popularMovies = response.results;
        this.loading.popular = false;
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.loading.popular = false;
      }
    });

    // Cargar películas mejor calificadas
    this.api.getTopRatedMovies().subscribe({
      next: (response: MovieResponse) => {
        this.topRatedMovies = response.results;
        this.loading.topRated = false;
      },
      error: (error) => {
        console.error('Error loading top rated movies:', error);
        this.loading.topRated = false;
      }
    });

    // Cargar películas próximas
    this.api.getUpcomingMovies().subscribe({
      next: (response: MovieResponse) => {
        this.upcomingMovies = response.results;
        this.loading.upcoming = false;
      },
      error: (error) => {
        console.error('Error loading upcoming movies:', error);
        this.loading.upcoming = false;
      }
    });
  }

  /**
   * Genera la URL de la imagen de la película.
   * @param posterPath - La ruta de la imagen de la película.
   * @returns La URL completa de la imagen o la ruta de la imagen por defecto si no hay imagen.
   */
  getImageUrl(posterPath: string): string {
    return posterPath 
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : 'assets/no-image.jpg';
  }

  // Scroll suave a secciones
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Scroll al inicio de la página
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cargar más películas populares
  loadMorePopular(): void {
    this.popularPage++;
    this.api.getPopularMovies(this.popularPage).subscribe({
      next: (response: MovieResponse) => {
        this.popularMovies = [...this.popularMovies, ...response.results];
      },
      error: (error) => {
        console.error('Error loading more popular movies:', error);
        this.popularPage--;
      }
    });
  }

  // Cargar más películas mejor calificadas
  loadMoreTopRated(): void {
    this.topRatedPage++;
    this.api.getTopRatedMovies(this.topRatedPage).subscribe({
      next: (response: MovieResponse) => {
        this.topRatedMovies = [...this.topRatedMovies, ...response.results];
      },
      error: (error) => {
        console.error('Error loading more top rated movies:', error);
        this.topRatedPage--;
      }
    });
  }

  // Cargar más películas próximas
  loadMoreUpcoming(): void {
    this.upcomingPage++;
    this.api.getUpcomingMovies(this.upcomingPage).subscribe({
      next: (response: MovieResponse) => {
        this.upcomingMovies = [...this.upcomingMovies, ...response.results];
      },
      error: (error) => {
        console.error('Error loading more upcoming movies:', error);
        this.upcomingPage--;
      }
    });
  }
} 