import { getRegionComunaService } from '../services'

export default (countryCode) => {
  return new Promise((resolve) => {
    getRegionComunaService.getRegionComunaService(countryCode)
      .then(response => resolve(response.data))
      .catch(err => console.log(err))
  })
}
