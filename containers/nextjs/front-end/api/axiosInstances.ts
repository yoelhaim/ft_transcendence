import axios from 'axios';

const baseURL = process.env.BASE_URL || "http://localhost:8000/";

// const baseURL ="http://e3r2p2.1337.ma:8000/";

axios.defaults.baseURL = baseURL;


// axios.defaults.headers.common["Authorization"] = "Bearer " + token;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Content-Type"] =  'application/json';
axios.defaults.withCredentials = true;

// axios.defaults.validateStatus = (status) => status >= 200 && status < 399;

axios.interceptors.request.use(
	async function (config) {
		
			return config
	},

	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		if (!error.response) {
		} else {
			if (error.response.status === 406) {
				// window.location.href = "/two-factor-verification";
				// localStorage.clear();
    
				return Promise.reject(error);
			}

			// if (error.response.status === 404 {// TODO }
		}
		return Promise.reject(error);
	}
);

export default axios;

