import './FormModal.scss'
import React, { useEffect, useState } from "react"
//import { getFormDeclarationPromise } from '../../../../pages/Stakeholder/components/TabNewRequest/promises'
import { Modal, Button } from "antd"

const FormModal = ({client, currentUser, typeForm, modalReady, showForm, form }) => {
    const [pathUrl, setPathUrl] = useState(null);

    const onCancelFormModal = () => {
        setPathUrl(null)
        modalReady();
	  }

    const openForm = (formId) => {
      let path = '/forms/' + client.extId
      if(typeForm === 'CDI' && currentUser.category === 'COLABORADOR') path += '/formTrab/'
      else if(typeForm === 'CDI' && currentUser.category === 'PROVEEDOR') path += '/formProv/'
      else if(typeForm === 'TRAVEL') path += '/formTravel/'
      else if(typeForm === 'GIFT') path += '/formGift/'
      else if(typeForm === 'SOC') path += '/formSoc/'
      else if(typeForm === 'FP') path += '/formFP/'
      else if(typeForm === 'DIR') path += '/formDir/'
      else if(typeForm === 'PATR') path += '/formPatr/' // no va para cliente 1 (SMU)
      else if(typeForm === 'REL') path += '/formTrab/'
      else if(typeForm === 'KYC') path += '/formKyc/'

      path += formId

      setPathUrl(path)
    }

    useEffect(() => {
        if(showForm) {
            //todo:ajustar
            //if(form) {
            if(true) {
                openForm(form.id)
           /* }else {
                getFormDeclarationPromise(currentUser.id, typeForm).then((form) => {
                    openForm(form.data)
                }).catch(err => console.log(err));
            }

            */
        }
        }
		//si el id es distinto de 1 hago el windows open y si no depende de la ruta se monta el componente
		// console.log(pathUrl + form.data);
    }, [showForm]);

    return (
        <>
        { pathUrl &&
            <Modal
                wrapClassName="modal-form-wrap"
                title={"Formulario"}
                visible={true}
                width="calc(100% - 30px)"
                style={{width: 'calc(100% - 20px)', top: 4}}
                bodyStyle={{height: 'calc(100vh - 60px)', padding: 12}}
                onCancel={onCancelFormModal}
                footer={null}
            >
                <iframe src={pathUrl + "/modal"} frameBorder="0" width="100%" height="100%"></iframe>
            </Modal>
        }
        </>
    )
}

export default FormModal
