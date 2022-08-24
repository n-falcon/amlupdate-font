import "./ModalViewRules.scss";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Select, Spin, Input, Table,Icon } from "antd";
import { camelizerHelper } from "../../../../helpers/";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { ModalComments } from "./components";

const ModalViewRules = ({
  modalItem,
  onCancel,
  handleChangeModal,
  historyTable,
}) => {
  const { t } = useTranslation();
  const [itemCopy, setItemCopy] = useState({});
  const [changesCounter, setChangesCounter] = useState(0);
  const [modalComment, setModalComment] = useState("");
  const [isModalCommentsVisble, setIsModalCommentsVisible] = useState(false);

  const handleEditItemCopy = (parameterIndex, parameter, value) => {
    const parametersCollection = itemCopy.params;
    parametersCollection[parameterIndex].value = value;
    setItemCopy({ ...itemCopy, params: parametersCollection });
    setChangesCounter(changesCounter + 1);
  };

  const handleChangeField = (field, value) => {
    setItemCopy({ ...itemCopy, [field]: value });
    setChangesCounter(changesCounter + 1);
  };

  useEffect(() => {
    if (modalItem != undefined) {
      setItemCopy(JSON.parse(JSON.stringify(modalItem)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModalCommentsCancel = () => {
    setIsModalCommentsVisible(false);
  };

  const handleOnModalComments = (record) => {
    setModalComment(record.descripcion);
    setIsModalCommentsVisible(true);
  };

  const tableColumns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      render: (text) => {
        return text !== null ? moment(text).format("DD/MM/YYYY HH:mm") : "-";
      },
    },
    {
      title: "Usuario",
      dataIndex: "username",
    },
    {
      title: t("messages.aml.view"),
      width: "70px",
      render: (text, record) => {
        return (
          <>
            {record.description !== null && record.description !== '' && (
              <div
                className="comments-files"
                onClick={(e) => {
                  handleOnModalComments(record)

                }}
              >
                <Icon type="folder-open" />
              </div>
            )}
          </>
        );
      },
    },



  ];

  return (
    <Modal
      className="modal-view-rules"
      footer={null}
      header={null}
      onCancel={onCancel}
      visible={true}
      width="800px"
    >
      <>
        <div className="box">
          <h2>
            <span>Detalle de la Regla</span>
            {/* <span style = {{marginLeft:'750px'}}>Folio: {itemData.group.request.folio}</span> */}
          </h2>

          <div className="box-inner">
            <Row>
              <Col span={8}>
                <div className="col-inner">
                  <div className="key">Tipo de Riesgo</div>
                  <div className="value">
                    <Input
                      disabled
                      size="small"
                      defaultValue={camelizerHelper(modalItem.type)}
                    />
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div className="col-inner">
                  <div className="key">Puntaje</div>
                  <div className="value">
                    {/* <Input
                      size="small"
                      defaultValue={modalItem.score}
                      onChange={({ target }) =>
                        handleChangeField("score", target.value)
                      }
                    /> */}
                    <Select
                      size="small"
                      defaultValue={modalItem.score}
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeField("score", value)}
                    >
                      <Select.Option key={1} value={1}>Bajo</Select.Option>
                      <Select.Option key={2} value={2}>
                      Medio
                      </Select.Option>
                      <Select.Option key={3} value={3}>
                      Alto
                      </Select.Option>
                      <Select.Option key={4} value={4}>
                      Crítico
                      </Select.Option>
                    </Select>

                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div className="col-inner">
                  <div className="key">Estado</div>
                  <div className="value">
                    <Select
                      size="small"
                      defaultValue={modalItem.status}
                      style={{ width: "100%" }}
                      onChange={(value) => handleChangeField("status", value)}
                    >
                      <Select.Option key="1" value="ACTIVE">
                        Activo
                      </Select.Option>
                      <Select.Option key="2" value="INACTIVE">
                        Inactivo
                      </Select.Option>
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col span={16}>
                <div className="col-inner">
                  <div className="key">Regla</div>
                  <div className="value">
                    <Input
                      disabled
                      size="small"
                      defaultValue={modalItem.name}
                    />
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="col-inner">
                  <div className="key">Regla</div>
                  <div className="value">
                    <Input
                      disabled
                      size="small"
                      defaultValue={modalItem.rule}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className="col-inner">
                  <div className="key">Descripción</div>
                  <div className="value">
                    <Input.TextArea
                      defaultValue={null}
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      style={{ width: "100%" }}
                      disableds
                      value={modalItem.description}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {itemCopy.params != undefined && itemCopy.params.length > 0 && (
          <div className="box">
            <h2>
              <span>Parámetros</span>
              {/* <span style = {{marginLeft:'750px'}}>Folio: {itemData.group.request.folio}</span> */}
            </h2>
            <div className="box-inner">
              <Row className="parameters-collection">
                {itemCopy.params.map((parameter, index) => (
                  <Col
                    span={itemCopy.params.length === 1 ? 24 : 12}
                    key={index}
                  >
                    <div className="col-inner">
                      <div className="key">{parameter.name}</div>
                      <div className="value">
                        <Input
                          size="small"
                          defaultValue={parameter.value}
                          onChange={({ target }) => {
                            handleEditItemCopy(index, parameter, target.value);
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}

        <div className="box">
          <h2>Historial de Cambios​</h2>
          <div className="box-inner">
            <Row>
              <Col xs={24}>
                <Table
                  pagination={{ pageSize: 5 }}
                  className="table-data"
                  dataSource={historyTable}
                  columns={tableColumns}
                  size="small"
                ></Table>
              </Col>
            </Row>
          </div>
        </div>

        <div className="bottom">
          <Button
            className="bottom-button"
            type="primary"
            onClick={() => handleChangeModal(itemCopy)}
            disabled={changesCounter === 0}
          >
            Guardar
          </Button>
        </div>
      </>
      {isModalCommentsVisble && (
        <ModalComments
          onCancel={handleModalCommentsCancel}
          comment={modalComment}
        />
      )}
    </Modal>
  );
};

export default ModalViewRules;
