import { ParamsService } from '../services'

export default () => {
  return new Promise(async (resolve, reject) => {
    await ParamsService.getNewsLetter()
      .then(response => resolve(response.data))
      .then(err => reject({ error: true }))
  })
}
