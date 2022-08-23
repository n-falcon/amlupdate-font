import { negativeListService } from '../services'

export default (params) => {
  return new Promise(async (resolve) => {
    await negativeListService.read(params)
      .then(response => {
        resolve(response.data)
      })
  })
}
