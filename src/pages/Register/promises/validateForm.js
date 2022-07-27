import { ClientsService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.validateForm(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
