import axios from "config/posconfig";
import { Filter, ProductResponse } from "./types";


export const posApi={
  getAll: async (filter: Filter) => {
    const result:ProductResponse = await axios.get(`/vendor/8f79d19a-5319-4783-8ddc-c863d98ecc16/products`, {
      params: { ...filter },
    });
    return result
  },
}
