import { RegisterClientService } from '../services'

export default (formData) => {
  return new Promise(async (resolve, reject) => {
    await RegisterClientService.bajaClientes(formData)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
