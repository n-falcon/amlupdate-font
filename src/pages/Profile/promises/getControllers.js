import { controllersService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await controllersService.read(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
