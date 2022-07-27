import { DetailFalsoPositivoService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await DetailFalsoPositivoService.read(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
