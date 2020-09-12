import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { LoginRequest } from '../types/login-request';

@Injectable({
    providedIn: "root"
})
export class AuthService {

    public currentUser: any = null;

    public openLogin$ = new Subject<LoginRequest>();

    constructor(private http: HttpClient) { }

    // login(user: any): Promise<any> {
    //     // return this.http
    //     //   .post<any>(environment.API_URL + "auth/login", user)
    //     //   .toPromise();
    // }

    logout(): void {
        localStorage.removeItem(this.getCookieName("AUTH"));
        this.currentUser = null;
    }

    getCurrentUser(): Promise<any> {
        if (this.currentUser) {
            return Promise.resolve(this.currentUser);
        }

        return this.http
            .get<any>("auth/user")
            .toPromise()
            .then(response => {
                this.currentUser = response.data;
                return response.data;
            })
            .catch(error => null);
    }

    setToken(token: string): void {
        localStorage.setItem(this.getCookieName("AUTH"), token);
    }

    getToken(): string {
        return localStorage.getItem(this.getCookieName("AUTH"));
    }

    getCookieName(type: string): string {
        return "plezanjenet-";
    }

    checkRole(role: string) {
        if (this.currentUser) {
            return this.currentUser.roles.indexOf(role) != -1;
        }
        return false;
    }
}
