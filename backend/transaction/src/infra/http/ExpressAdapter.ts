import HttpServer from "./HttpServer";
import express from "express";

export default class ExpressAdapter implements HttpServer {
	app: any;

	constructor () {
		this.app = express();
		this.app.use(express.json());
	}

	register(url: string, callback: Function){
		this.app.use(url, callback);
	}

	listen(port: number, callback: Function): void {
		this.app.listen(port, callback);
	}

}
