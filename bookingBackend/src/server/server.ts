
import { PORT } from "../config/config";
import App from "../index";

const server = new App();
server.start(PORT);
