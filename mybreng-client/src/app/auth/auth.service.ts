import { Injectable } from '@angular/core';
import { AccountService } from '@app/web-api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean | undefined>(undefined);

  constructor(private readonly account: AccountService) { }

  public get authenticated(): Observable<boolean | undefined> {
    return this.authenticatedSubject.asObservable();
  }

  public login(email: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.account
        .accountLogin({
          email,
          password
        })
        .subscribe({
          next: () => {
            resolve(true);
            this.authenticatedSubject.next(true);
          },
          error: () => {
            resolve(false);
          }
        });
    });
  }
}
