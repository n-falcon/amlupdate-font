import { FormService } from '../services'

export default (countryCode) => {
  return new Promise((resolve) => {
    FormService.getCountriesCode(countryCode)
      .then(response => resolve(response.data))
      .catch(err => console.log(err))
  })
}