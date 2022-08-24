import { ReportService } from '../services'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    await ReportService.deleteReport(id)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
