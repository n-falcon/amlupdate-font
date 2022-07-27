import { complianceService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await complianceService.read(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
