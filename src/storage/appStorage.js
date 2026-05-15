import { APP_NAME } from "../constants";
import { createStorage } from "./storage";

export const appStorage = createStorage(APP_NAME);