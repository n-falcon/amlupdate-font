import "./ModalRiskPonderator.scss";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Select, Spin, Input, notification } from "antd";
import { camelizerHelper } from "../../../../helpers/";
import { useTranslation } from "react-i18next";

const ModalRiskPonderator = ({
  modalItem,
  onCancel,
  handleChangeModal,
}) => {
  const { t } = useTranslation();
  const [itemCopy, setItemCopy] = useState([]);
  const [changesCounter, setChangesCounter] = useState(0)


  const handleChangeField = (index,field,value) => {
    let arreglo = itemCopy
    arreglo[index] = {...arreglo[index],[field]:value}
    setItemCopy(arreglo);
    setChangesCounter(changesCounter+1)
  };


  const handleChecksumAndSubmit = (itemCopy)=>{
    const total = parseInt(itemCopy[0].score) + parseInt(itemCopy[1].score) + parseInt(itemCopy[2].score)
    if (total!=100){
      notification["error"]({
        message: t("La suma debe ser igual a 100"),
      }); 
    }else{
      handleChangeModal(itemCopy)
    }
  }



  useEffect(() => {
    if (modalItem != undefined){
      setItemCopy(JSON.parse(JSON.stringify(modalItem)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[] );

  return (
    <Modal
      className="modal-view-rules"
      footer={null}
      header={null}
      onCancel={onCancel}
      visible={true}
    >
          <>
            <div className="box">
              <h2>
              <span>Tabla de Ponderadores</span>
                {/* <span style = {{marginLeft:'750px'}}>Folio: {itemData.group.request.folio}</span> */}
              </h2>
              <div className="box-inner">
                {
                  (modalItem.map((obj,index) => 
                    <Row>
                      <Col offset={2} span={12}>
                        <div>
                          {camelizerHelper(obj.tipo)}
                        </div>
                      </Col>
                      <Col offset={2} span={3} >
                        <div className="col-inner" style={{textAlign:'center'}}>
                        <div className="value">
                        <Input
                          size="small"
                          defaultValue={obj.score}
                          onChange={({ target }) =>
                          handleChangeField(index,"score",target.value)
                          }
                        />
                      </div>
                        </div>
                      </Col>
                    </Row>
                  ))
                }
              </div>
            </div>

            <div className="bottom">
            
              <Button
                className="bottom-button"
                type="primary"
                disabled = {changesCounter === 0}
                onClick={() => handleChecksumAndSubmit(itemCopy)}
              >
                Guardar
              </Button>
          
            </div>
          </>
    </Modal>
  );
};

export default ModalRiskPonderator;
