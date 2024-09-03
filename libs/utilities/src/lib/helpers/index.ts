import CountryList from 'country-list-with-dial-code-and-flag'
import { CountryInterface } from "country-list-with-dial-code-and-flag/dist/types";

const countries: CountryInterface[] = CountryList.getAll()

export const countryList = countries?.map(country => {
    return { value: country.name, label: `${country.flag} ${country.name}` }
})