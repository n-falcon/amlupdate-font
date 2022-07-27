import { ClientsService } from '../services'

export default (id, obsCli) => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.sendFormC57(id, obsCli)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
