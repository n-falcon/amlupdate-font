import { ClientsService } from '../services'

export default (category) => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.grupos(category)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
