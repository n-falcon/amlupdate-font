import { ClientsService } from '../services'

export default () => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.areas()
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}