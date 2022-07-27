import { ParamsService } from '../services'

export default (currentUser) => {
  return new Promise(async (resolve, reject) => {
    await ParamsService.getNewsGesintel(currentUser)
      .then(response => resolve(response !== undefined ? response.data : []))
      .then(err => reject({ error: true }))
  })
}
