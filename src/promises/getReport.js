import { ReportService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await ReportService.getReport(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
