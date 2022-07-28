import React, {useState} from "react"
import './Step2File.scss'
import {Form, Row, Col, Input, Select, Upload, Icon, Button, message} from 'antd';
import { withTranslation } from "react-i18next";
import apiConfig from '../../../../../../config/api'

const Step2File = ({form, sendFormFile , prev}) => {

    const { getFieldDecorator, validateFields, getFieldsError, setFieldsValue } = form;
    const [fileList, setFileList] = useState([]);
    const { Dragger } = Upload;
    const [tmpFilesList, setTmpFilesList] = useState([])

    const formItemLayout = {
        labelCol: {span: 10},
        wrapperCol: {span : 12},
      };

    const propsUpload = {
        accept: ".xlsx",
        onRemove: file => {
          setTmpFilesList(oldTmpFilesList => {
            const index = oldTmpFilesList.indexOf(file)
            const newTmpFilesList = oldTmpFilesList.slice()

            newTmpFilesList.splice(index, 1)

            return newTmpFilesList
          })
        },
        beforeUpload: file => {
          if(tmpFilesList.length === 0) {
            setTmpFilesList(oldTmpFilesList => [...oldTmpFilesList, file])
          }

          return false
        },
        multiple: false,
        fileList: tmpFilesList,
      }


    const nextStepLocal = () => {
        validateFields(['category']).then((c) => {
            if(tmpFilesList.length === 0){
                message.error("Debe subir un archivo");
            }else{
                sendFormFile(c.category, tmpFilesList[0])
            }
        })
      }

    const downloadPlantilla = () => {
        window.open(apiConfig.url + '/../templates/carga_registro.xlsx')
    }

    return (
        <div className="step2file-content">
            <div className="step2file-title">
                Paso 2: Suba el archivo
            </div>
            <Row>
              <Col span={12}>
                <Form {...formItemLayout}>
                    <Form.Item label="Indique la categoría" labelAlign="left">
                        { getFieldDecorator('category', {
                            rules: [{
                                required: true,
                                message: 'Indique la categoría'
                            }]
                        })(
                            <Select>
                                <Select.Option value="CLIENTE">Cliente</Select.Option>
                                <Select.Option value="COLABORADOR">Colaborador</Select.Option>
                                <Select.Option value="PROVEEDOR">Proveedor</Select.Option>
                                <Select.Option value="DIRECTOR">Director</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Form>
              </Col>
              <Col span={12}>
                <div className="plantilla"><a onClick={downloadPlantilla}>Plantilla</a></div>
              </Col>
            </Row>
            <div className= "next2file-dragger">
                <Row style={{marginBottom: 30}}>
                    <Col span={24}>
                        <Dragger {...propsUpload}>
                            <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Haga click o arraste un archivo excel aquí</p>
                            <p className="ant-upload-hint">
                                El formato debe ser .xlsx | Cualquier otro formato no está permitido
                            </p>
                        </Dragger>
                    </Col>
                </Row>
            </div>
            <div className="steps-buttons">
                <Button  onClick={() => prev()}>
                    Atrás
                </Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={() => nextStepLocal(tmpFilesList)}>
                    Enviar
                </Button>
            </div>
        </div>
    )
}
export default Form.create()(Step2File);
