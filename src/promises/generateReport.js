import { ReportService } from '../services'

export default (type, filters) => {
  return new Promise(async (resolve, reject) => {
    await ReportService.generateReport(type, filters)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
