// import path from "path"
// import {fileURLToPath} from 'url'

// export const __filename = fileURLToPath(import.meta.url)
// export const __dirname = path.dirname(__filename)

// export default __dirname
import { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));