import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'



const Report = () => {
    return ({
        read: (endpoint, body, headers, fileName) => {
            return apiRequestorHelper({
                url: apiConfig.url + endpoint,
                method: 'post',
                body,
                headers,
                responseType: 'blob'
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
        }

    })
}
export default Report