export type Callback<E = Error | null | undefined> = (error?: E) => void;
export type HeadersObject = {
	[key: string]: string | string[] | undefined;
};
export type BufferEncoding = any;
