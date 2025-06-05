import * as datasync from "../plugin/datasync/datasync.min.js";
// ============== App Config ================

const BASE_URL = "http://localhost:5173";


// ============== API Client ================

datasync.registerPostEndpoint( 'postRegister', `${BASE_URL}/auth/register`);
datasync.registerPostEndpoint( 'postLogin', `${BASE_URL}/auth/login`);

