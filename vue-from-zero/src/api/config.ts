import Axios from "axios";
const { NODE_ENV } = process.env;

export const axiosInstance = Axios.create();



