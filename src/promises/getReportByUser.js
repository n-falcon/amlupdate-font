import { ReportService } from '../services'

export default () => {
  return new Promise(async (resolve, reject) => {
    await ReportService.getReportByUser()
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
