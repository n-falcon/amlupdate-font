import './ModalNewRequest.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Col, Row, Icon, Button, Steps, message, notification } from 'antd'
import {Step1Page, Step2FilePage, Step2BdPage, Step3Page} from './components'
import {sendNewRequestFilePromise, sendBdRequestPromise} from '../../promises'


const ModalNewRequest = ({closeModalRequest, currentUser}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState();
    const [formFile, setFormFile] = useState(null);
    const [formBd, setFormBd] = useState(null);


    const sendFormFile = (category, formFile) => {
    const formData = new FormData()
      formData.append('file', formFile)
      formData.append("category", category)


      sendNewRequestFilePromise(formData)
        .then(results => {
        if(results.status === 'OK') {
            message.success('Solicitud enviada con éxito')
            closeModalRequest();
        }else {
            notification.error({
            message: 'Error',
            description: results.message
            })
        }
        })
    }

    const sendFormS3 = (recipients) => {
        sendBdRequestPromise({...formBd, recipients}).then(results => {
                if(results.status === 'OK' && recipients.length > 0) {
                    message.success('Solicitud enviada con éxito')
                    closeModalRequest();
                }else {
                    notification.error({
                    message: 'Error',
                    description: recipients.length === 0 ? "Debe seleccionar destinatarios" : results.message
                    })
                }
            }
        )
    }

      const next2File = (file) => {
        setFormFile(file);
        next();
      }

      const next2Bd = (bd) => {
        setFormBd(bd);
        next();
      }

      const next = () => {
          const current = currentStep + 1;
         setCurrentStep(current);
      }

      const prev = () => {
        const current = currentStep - 1;
         setCurrentStep(current);
      }

      const fileOrBd = (option) => {
        setSelectedOption(option);
        next();
      }



    return(
        <div className="modal-newrequest-onb">
            <div className="topBar-nr-onb">
                    <Row>
                        <Col span={6}>
                            <div className="topBar-nr-onb-title">
                                Envío del formulario On Boarding
                            </div>
                        </Col>
                        <Col span={1} push={17}>
                            <div className="button-close-ob">
                                <a href="#" onClick={closeModalRequest}><Icon type="close" style={{color:'black', fontSize:'20px'}} /></a>
                            </div>
                        </Col>

                    </Row>
            </div>
            <div className="nr-onb-content-steps">
                <div className="nr-onb-steps">
                    <hr />
                            <Steps current={currentStep}>

                                <Steps.Step title="Seleccione la base de datos" />

                                {currentStep === 1 && selectedOption === "file" &&
                                    <Steps.Step title="Suba el archivo externo" />
                                }
                                {currentStep > 0 && selectedOption === "bd" &&
                                    <Steps.Step title="Identifique el tipo de destinatario" />
                                }
                                {currentStep > 0 && selectedOption === "bd" &&
                                    <Steps.Step title="Seleccione los destinarios" />
                                }
                            </Steps>
                    <hr />
                </div>
                <div className="steps-content">
                    {currentStep === 0 &&
                        <Step1Page fileOrBd={fileOrBd}/>
                    }
                    { currentStep === 1 && selectedOption === "file" &&
                        <Step2FilePage next={next2File} sendFormFile={sendFormFile} prev={prev} />
                    }
                    { currentStep === 1 && selectedOption === "bd" &&
                        <Step2BdPage next2Bd={next2Bd} prev={prev} currentUser = {currentUser}/>
                    }
                    {currentStep === 2 &&
                        <Step3Page prev={prev} formBd={formBd} sendFormS3={sendFormS3}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default ModalNewRequest
