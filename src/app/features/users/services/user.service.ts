import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserEntity } from '../entities/user.entity';
import { UserWithPasswordEntity } from '../entities/user-with-password.entity';
import { UpdateUserDto } from '../dtos';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);

  getAll(): Observable<UserEntity[]> {
    return this.http.get<UserEntity[]>(`${this.baseUrl}/users`);
  }

  getUserByIdWithPassword(id: number): Observable<UserWithPasswordEntity | null> {
    return this.http.get<UserWithPasswordEntity | null>(
      `${this.baseUrl}/users/with-password/${id}`,
    );
  }

  update(id: number, updateUserDto: UpdateUserDto): Observable<UserEntity> {
    return this.http.patch<UserEntity>(`${this.baseUrl}/users/${id}`, updateUserDto);
  }

  deleteUser(id: number){
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

}
