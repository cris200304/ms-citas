import axios from "axios";

const citasApi = axios.create({
    baseURL: "http://localhost:8083",
});

export default citasApi;
