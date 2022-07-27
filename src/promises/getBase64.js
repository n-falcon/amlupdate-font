import {ReportService} from '../services';

export default (id) => {
    return new Promise((resolve, reject) => {
       ReportService.pdfToBase64('pdfSearchBase64', id).then(async response => {
        resolve({
            base64: response.data
        })
       }).catch(res => {
        console.log(res);
       });
    });
}