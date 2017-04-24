import * as rimraf from "rimraf";

let onError = (error: Error) => error && console.log(error.message);

rimraf("../../Server/resources", onError);
rimraf("../../Server/views", onError);
rimraf("../source/**/*.js", onError);
rimraf("../source/**/*.js.map", onError);
rimraf("../tasks/**/*.js", onError);
rimraf("../tasks/**/*.js.map", onError);

console.log("Workspace cleaned...");