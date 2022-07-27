import "./ModalComments.scss";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Input,
} from "antd";
import { useTranslation } from "react-i18next";

const ModalComments = ({
  currentUser,
  fakeModalOutput,
  modalHandler,
  item,
  puntaje,
  onCancel,
  onOk,
  type,
  comment,
}) => {
  const { t } = useTranslation();
  const [itemData, setItemData] = useState({});
  const [isItemDataLoading, setIsItemDataLoading] = useState(false);


  useEffect(() => {
    console.log(fakeModalOutput);
    // handleGetMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      className="modal-comments"
      footer={null}
      header={null}
      onCancel={onCancel}
      onOk={onOk}
      visible="true"
    >
      <>
        {isItemDataLoading ? (
          <div className="spinner">
            <Spin spinning={true} size="big" />
          </div>
        ) : (
          <>
            <div className="box">
              <h2>
                <span>Comentarios</span>
                {/* <span style = {{marginLeft:'750px'}}>Folio: {itemData.group.request.folio}</span> */}
              </h2>

              <div className="box-inner">
                <div className="declarations">
                  <Row className="declaration-foot">
                    <Col
                      className={type === "COLABORADOR" ? "col-travel" : ""}
                      xs={24}
                    >
  
                      <ul className="bottom-2-items">
                        <li>
                          <div className="col-inner">
                            {/* <div className="key">Comentarios</div> */}
                            <div className="value" style={{ height: 111 }}>
                              <textarea
                                id="observations"
                                value={comment}
                                disabled
                              ></textarea>
                            </div>
                          </div>
                        </li>
                      </ul>
          
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

     
          </>
        )}
      </>
    </Modal>
  );
};

export default ModalComments;
