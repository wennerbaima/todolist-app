import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Todo } from '../models/todo';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends GenericService<Todo> {

  constructor(private http: HttpClient, private configService: ConfigService) {
    super(http, configService.getUrlService()+"todo/")
  }
}
