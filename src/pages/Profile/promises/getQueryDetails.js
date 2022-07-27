import { queryDetailsService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await queryDetailsService.read(id)
      .then(response => resolve(response.data.record))
      .catch(err => reject({ error: true }))
  })
}
