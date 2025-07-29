export function shouldRetry({ response, error, method }: {
    response?: {} | undefined;
    error?: {} | undefined;
    method?: {} | undefined;
}): boolean;
export function waitForRetry(response: any): Promise<void>;
export const MAX_RETRY: 5;
