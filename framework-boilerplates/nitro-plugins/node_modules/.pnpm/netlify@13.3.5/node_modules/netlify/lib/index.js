import pWaitFor from 'p-wait-for';
import { getMethods } from './methods/index.js';
import { openApiSpec } from './open_api.js';
import { getOperations } from './operations.js';
// 1 second
const DEFAULT_TICKET_POLL = 1e3;
// 1 hour
const DEFAULT_TICKET_TIMEOUT = 3.6e6;
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class NetlifyAPI {
    #accessToken = null;
    defaultHeaders = {
        accept: 'application/json',
    };
    /** The protocol is used like `https` */
    scheme;
    host;
    pathPrefix;
    agent;
    globalParams = {};
    constructor(firstArg, secondArg) {
        // variadic arguments
        const [accessTokenInput, options = {}] = typeof firstArg === 'object' ? [null, firstArg] : [firstArg, secondArg];
        this.globalParams = options.globalParams || {};
        this.agent = options.agent;
        this.scheme = options.scheme || openApiSpec.schemes[0];
        this.host = options.host || openApiSpec.host;
        this.pathPrefix = options.pathPrefix || openApiSpec.basePath;
        // use the setter to set the header as well
        this.accessToken = options.accessToken || accessTokenInput || null;
        this.defaultHeaders['User-agent'] = options.userAgent || 'netlify/js-client';
        const methods = getMethods({
            basePath: this.basePath,
            defaultHeaders: this.defaultHeaders,
            agent: this.agent,
            globalParams: this.globalParams,
        });
        Object.assign(this, { ...methods });
    }
    /** Retrieves the access token */
    get accessToken() {
        return this.#accessToken;
    }
    set accessToken(token) {
        if (!token) {
            delete this.defaultHeaders.Authorization;
            this.#accessToken = null;
            return;
        }
        this.#accessToken = token;
        this.defaultHeaders.Authorization = `Bearer ${this.#accessToken}`;
    }
    get basePath() {
        return `${this.scheme}://${this.host}${this.pathPrefix}`;
    }
    async getAccessToken(ticket, { poll = DEFAULT_TICKET_POLL, timeout = DEFAULT_TICKET_TIMEOUT } = {}) {
        const { id } = ticket;
        // ticket capture
        let authorizedTicket;
        const checkTicket = async () => {
            const t = await this.showTicket({ ticketId: id });
            if (t.authorized) {
                authorizedTicket = t;
            }
            return Boolean(t.authorized);
        };
        await pWaitFor(checkTicket, {
            interval: poll,
            timeout,
            message: 'Timeout while waiting for ticket grant',
        });
        const accessTokenResponse = await this.exchangeTicket({ ticketId: authorizedTicket.id });
        // See https://open-api.netlify.com/#/default/exchangeTicket for shape
        this.accessToken = accessTokenResponse.access_token;
        return accessTokenResponse.access_token;
    }
}
export const methods = getOperations();
