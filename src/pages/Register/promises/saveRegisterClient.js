import { RegisterClientService } from '../services'

export default (client) => {
  return new Promise(async (resolve, reject) => {
    await RegisterClientService.save(client)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
