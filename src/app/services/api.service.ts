import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getVideos(type: String): Observable<any> { // Get latest videos from the url described in environment
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
    return this.http.get(`${environment.baseUrl}/assets/${type}.json`, {headers})
  }
}
