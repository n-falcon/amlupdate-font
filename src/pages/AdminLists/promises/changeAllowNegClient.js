import { negativeListService } from '../services'

export default (allowNegAdm) => {
  return new Promise(async (resolve) => {
    await negativeListService.changeAllowNegClient(allowNegAdm)
      .then(response => {
        resolve(response.data)
      })
  })
}
