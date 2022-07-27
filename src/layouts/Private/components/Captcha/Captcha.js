import React, { useEffect, useState } from "react"

import ReCAPTCHA from 'react-google-recaptcha'
//import getCaptchaPublicKey from "../../../../pages/Stakeholder/promises/getCaptchaPublicKey";
//import validateCaptchaGoogle from "../../../../pages/Stakeholder/promises/validateCaptchaGoogle";
import { notification } from 'antd'


import './Captcha.scss';



export default ({success}) => {

    const [loadingCaptcha, setLoadingCaptcha] = useState(false);
    const [publicCaptchaKey, setPublicCaptchaKey] = useState(null);


    useEffect(() => {
        async function siteKeyMethod() {
            //const siteKey = await getCaptchaPublicKey();
            
            //setPublicCaptchaKey(siteKey.data)
        }

        siteKeyMethod();

        //traer el codigo de captcha publico y setearlo
    }, [])



    async function captchaProcecced (value)  {
        success(true, value);
    }

    function captchaError(){
        success(false, null);
        notification.error({
            message: "Error",
            description: "Validacion no Superada"
          })
    }


    return (
        
        <div className="captchaApp">
        { publicCaptchaKey && <ReCAPTCHA
          sitekey={publicCaptchaKey}
          onChange={captchaProcecced}
          onErrored={captchaError}
        />}
      </div>
    )
}