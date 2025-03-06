//create a folder called config in the root of  your project

//create a file called axios.config.ts or name it whatever u like, i know u have wonderful names for your files 😅

// do something similiar to this below



import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default axios;


// anywhere where u need axios, imprt it from this directory and not from axios it's self
