import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "./constants/general.const";

const pb = new PocketBase(POCKETBASE_URL);
export default pb;
