import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon.model';
import { User } from '../models/user.model';
import { PokemonCatalogueService } from './pokemon-catalogue.service';
import { UserService } from './user.service';

const {apiKey, apiUsers} = environment

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private _loading : boolean = false;

  get loading(): boolean {
    return this._loading;
  }

  constructor(
    private http: HttpClient,
    private readonly pokemonService : PokemonCatalogueService,
    private readonly userService : UserService,
  ) { }
  // get pokemon based on Name 
  

  // Patch request with the userId and the pokemon
  public addToFavourites(pokemonName: string): Observable<any> {
    if(!this.userService.user) {
      throw new Error("addToFavourites: There is no user ");
    } 

    const user: User = this.userService.user;

    const pokemon : Pokemon | undefined = this.pokemonService.PokemonByName(pokemonName);

    if (!pokemon) {
      throw new Error ("addToFavourites No pokemon with name: " + pokemonName)
    }

    if(this.userService.inFavourites(pokemonName)) {
      throw new Error ("addToFavourites Pokemon already in favourites: " + pokemonName)
    }

    const headers = new HttpHeaders({
      'Content-Type' : 'Application/json',
      'x-apikey' : apiKey
    })

    this._loading = true;

    return this.http.patch(`${apiUsers}/${user.id}`, {
      pokemon: [...user.pokemon, pokemon]
    }, {
      headers
    })
    .pipe(
      finalize(() => {
        this._loading = false;
      })
    )
  }
}
