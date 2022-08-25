import { ClientsService } from '../services'

export default (rut) => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.historyQuiebras(rut)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
