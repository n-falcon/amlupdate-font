import { ParamsService } from '../services'

export default () => {
  return new Promise(async (resolve, reject) => {
    await ParamsService.read()
      .then(response => resolve(response.data))
      .then(err => reject({ error: true }))
  })
}
