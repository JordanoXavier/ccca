export default interface HttpServer {
	register (url: string, callback: Function): void;
	listen (port: number, callback: Function): void;
}
