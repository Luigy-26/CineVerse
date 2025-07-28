/*
  API The Movie Database (TMDB)
  https://developers.themoviedb.org/3/getting-started/introduction
  
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Movie{ //interface para la data de las peliculas 
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse{ //interface donde se define la respuesta de la api
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;

}

@Injectable({
  providedIn: 'root'
})

export class Api {
  //Inicializamos las variables y definimos el tipo de dato
  private apiKey: string = 'fdf43d21b3ff8cf1039c9698ab28a8ac';
  private apiUrl: string = 'https://api.themoviedb.org/3';
  private http = inject(HttpClient);
  
  //manejo de errores de manera global
  private handleError(error: HttpErrorResponse){
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Error al obtener los datos'));
  }

  //metodo para obtener las peliculas populares
  getPopularMovies(page: number = 1):Observable<MovieResponse>{
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`).pipe(catchError(this.handleError));
  }

  //metodo para obtener las peliculas mejor calificadas
  getTopRatedMovies(page: number = 1):Observable<MovieResponse>{
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`).pipe(catchError(this.handleError));
  }

  //metodo para obtener las peliculas proximas a estrenarse
  getUpcomingMovies(page: number = 1):Observable<MovieResponse>{
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}`).pipe(catchError(this.handleError));
  }

  //metodo para obtener los detalles de una película específica por ID
  getMovieById(movieId: string):Observable<Movie>{
    return this.http.get<Movie>(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`).pipe(catchError(this.handleError));
  }
}


