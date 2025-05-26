import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../models/level.model';

@Injectable({
	providedIn: 'root'
})
export class DataService {
    
    constructor(private http: HttpClient) {}

	getLevelData(name: string): Observable<Level> {
		return this.http.get<any>(`assets/levels/${name}.json`);
	}
}