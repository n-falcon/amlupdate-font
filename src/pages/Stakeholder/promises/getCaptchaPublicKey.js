import { portalService } from "../services";

export default () => {
    return new Promise(resolve => {
        portalService.getCaptchaPublicKey()
        .then(response => resolve({ success: true, data: response.data }))
    });
}