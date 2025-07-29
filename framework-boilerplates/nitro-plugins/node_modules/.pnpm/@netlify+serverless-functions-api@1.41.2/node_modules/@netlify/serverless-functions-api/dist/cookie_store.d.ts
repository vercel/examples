import { Cookie } from '@netlify/node-cookies';
interface Cookies {
    delete: CookieStore['delete'];
    get: CookieStore['get'];
    set: CookieStore['set'];
}
interface DeleteCookieOp {
    options: DeleteCookieOptions;
    type: 'delete';
}
interface DeleteCookieOptions {
    domain?: string;
    name: string;
    path?: string;
}
interface SetCookieOp {
    cookie: Cookie;
    type: 'set';
}
declare class CookieStore {
    ops: (DeleteCookieOp | SetCookieOp)[];
    request: Request;
    constructor(request: Request);
    apply(headers: Headers): void;
    delete(input: string | DeleteCookieOptions): void;
    get(name: string): string;
    getPublicInterface(): Cookies;
    set(cookie: Cookie): void;
    set(name: string, value: string): void;
}
export { CookieStore };
export type { Cookies };
