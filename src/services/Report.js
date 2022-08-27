import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

const Report = {
  read: (endpoint, body, headers, fileName, evt) => {
    return apiRequestorHelper({
      url: apiConfig.url + endpoint,
      method: 'post',
      body,
      headers,
      responseType: 'blob',
      onUploadProgress: evt && evt.onUploadProgress,
      onDownloadProgress: evt && evt.onDownloadProgress
    }).then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', fileName); //or any other extension
       document.body.appendChild(link);
       link.click();
    });
  },

  pdfToBase64: (endpoint, id) => {
    return apiRequestorHelper({
      url: `${apiConfig.url}/${endpoint}/${id}`,
      method: 'post',
    })
  },
  pdfToBase64Obj: (endpoint, obj) => {
    return apiRequestorHelper({
      url: `${apiConfig.url}${endpoint}`,
      method: 'post',
      body: obj,
      responseType: 'blob'
    })
  },
  generateReport: (type, filters={}) => {
    return apiRequestorHelper({
			url: apiConfig.url + '/generateReport/' + type,
			method: 'post',
      body: filters
		})
  },
  getReport: (id) => {
    return apiRequestorHelper({
			url: apiConfig.url + '/getReport',
			method: 'post',
      body: {
        id
      }
		})
  },
  getReportByUser: () => {
    return apiRequestorHelper({
			url: apiConfig.url + '/getReportByUser',
			method: 'post'
		})
  },
  deleteReport: (id) => {
    return apiRequestorHelper({
			url: apiConfig.url + '/deleteReport',
			method: 'post',
      body: {
        id
      }
		})
  }
}

export default Report