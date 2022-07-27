import { UpdateFalsoPositivoService } from '../services'

export default (recordId, uboId, id, falsesId, alertId=null, comments) => {
  return new Promise(async (resolve, reject) => {
    await UpdateFalsoPositivoService.update(recordId, uboId, id, falsesId, alertId, comments)
      .then(response => resolve({ success: true, data: response.data }))
      .catch(err => reject({ error: true }))
  })
}
