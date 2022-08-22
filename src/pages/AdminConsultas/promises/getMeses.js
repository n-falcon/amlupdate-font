import { consultasService } from '../services'

export default () => {
  return new Promise(async (resolve, reject) => {
    await consultasService.meses()
      .then(response => resolve(response.data))
      .then(err => reject({ error: true }))
  })
}
