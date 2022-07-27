import { ClientsService } from '../services'

export default (id, updateMalla) => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.saveDDAValidated(id, updateMalla)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
