import { uploadBatchService } from '../services'

export default (formData) => {
  return new Promise(resolve => {
    uploadBatchService.create(formData)
      .then(response => {
        if (response.data === 'Carga exitosa') {
          resolve({ success: true })
        } else {
          resolve({ error: true })
        }
      })
  })
}
