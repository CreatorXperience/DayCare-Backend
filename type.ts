import { Application } from "express";
import {Server, IncomingMessage, ServerResponse} from "http"

type TConnectionArgs = {
    server: Server<typeof IncomingMessage, typeof ServerResponse>;
    app: Application;
    uri: string | undefined;
    port: string;
  }

  export type {TConnectionArgs}