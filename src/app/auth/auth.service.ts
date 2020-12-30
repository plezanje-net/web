import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { LoginRequest } from '../types/login-request';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
    providedIn: "root"
})
export class AuthService {

    public currentUser: any = null;

    public openLogin$ = new Subject<LoginRequest>();

    constructor(private apollo: Apollo) { }

    logout(): Promise<any> {
        this.currentUser = null;
        localStorage.removeItem(this.getCookieName("auth"));
        return this.apollo.client.resetStore();
    }

    login(token: string): Promise<any> {
        localStorage.setItem(this.getCookieName("auth"), token);
        return this.apollo.client.resetStore();
    }

    getCurrentUser(): Promise<any> {
        if (this.getToken() == null) {
            return Promise.resolve(null);
        }

        if (this.currentUser) {
            return Promise.resolve(this.currentUser);
        }

        return this.apollo.query({
            query: gql`{
                profile {
                    id,
                    email,
                    roles
                }
            }`
        }).toPromise().then((result: any) => {
            this.currentUser = result.data.profile;
            return this.currentUser;
        });
    }

    getToken(): string {
        return localStorage.getItem(this.getCookieName("auth"));
    }

    getCookieName(type: string): string {
        return "plezanjenet-" + type;
    }

    checkRole(role: string) {
        if (this.currentUser) {
            return this.currentUser.roles.indexOf(role) != -1;
        }
        return false;
    }
}
