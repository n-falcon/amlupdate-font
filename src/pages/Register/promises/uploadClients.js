import { RegisterClientService } from '../services'

export default (formData) => {
  return new Promise(async (resolve, reject) => {
    await RegisterClientService.upload(formData)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
