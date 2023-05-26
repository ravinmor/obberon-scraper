import axios from "axios";


class ApiPocketBase {
    public api;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:8090/',
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
    }
}


export default ApiPocketBase;