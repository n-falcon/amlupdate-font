import { DetailFalsoPositivoService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await DetailFalsoPositivoService.getProfiles(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
