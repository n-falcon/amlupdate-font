import { portalService } from "../services"

export default (responseToken) => {
    return new Promise(resolve => {
        portalService.validateCaptchaResponse(responseToken)
        .then(response => resolve({ success: true, data: response.data.data }))
    })
}