import { axiosInstance } from "./config";

export const getExample = (url:string) => {
	return axiosInstance.get(url);
};
