/**
 * This file contains the configuration for the axios instance that will be used to make requests to the API.
 * 
 * The configuration includes the base URL for the API and the interceptors that will be used to handle the requests and responses.
 */

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Base URL for the REST API of the server.
const REACT_APP_API_URL = "http://localhost:8000";

/**
 * The handler function handles the response from the server by simply returning the response.
 * @param res an AxiosResponse object
 * @returns an AxiosResponse object
 */
const handleRes = (res: AxiosResponse): AxiosResponse => {
  return res;
};

/**
 * The handler function handles the error by logging it to the console and returning a rejected promise with the error object.
 * @param err an AxiosError object
 * @returns a rejected promise with the error object
 */
const handleErr = (err: AxiosError): Promise<never> => {
  console.error(err);
  return Promise.reject(err);
};

/**
 * The axios instance that will be used to make requests to the API.
 * 
 * The instance is created with the withCredentials option set to true, which allows the client to send cookies with the request to cross site servers.
 */
const api = axios.create({ withCredentials: true });

/**
 * The interceptor handles all outgoing requests.
 * 
 * Every request made with the api instance will be passed through the request interceptor, which will log the request to the console and return the request object.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => config,
  (error: AxiosError): Promise<never> => handleErr(error)
);

/**
 * The interceptor handles all incoming responses.
 * 
 * Every response received from the server will be passed through the response interceptor, which will handle the response using the handleRes function and the handleErr function.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => handleRes(response),
  (error: AxiosError): Promise<never> => handleErr(error)
);

export { REACT_APP_API_URL, api };
