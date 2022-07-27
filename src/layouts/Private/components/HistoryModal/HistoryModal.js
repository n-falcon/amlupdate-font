import React, { useEffect, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next'
import './HistoryModal.scss'
import moment from 'moment';

import { Modal, Button, Pagination, Row, Col } from 'antd';

const HistoryModal = ({ closeHandler, type, schema, data }) => {

  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(5);
  const [lastIndex, setLastIndex] = useState(maxItemsPerPage);

  useEffect(() => {

  }, [])

  const handleChangePage = (page, pageSize) => {
    let first = (page-1) * pageSize
    setFirstIndex(first)
    let last = page * pageSize
    if(last > data.length) {
      last = data.length
    }
    setLastIndex(last)
    setCurrentPage(page);
    
    console.log(page, pageSize);
  }

  return (
    <Modal
      title={type}
      width={1200}
      style={{ top: 10 }}
      wrapClassName="historyCDIModal"
      visible={true}
      onCancel={closeHandler}
      footer={[<Button onClick={closeHandler}>{t('messages.aml.btnClose')}</Button>]}>
      {/* <Table
        pagination={{ pageSize: 5 }}
      /> */}

      <Row className="title">
        {
        schema.map(item => 
          <Col span={item.cols}>
            {item.title}
          </Col>
        )
        }
      </Row>
      { data.slice(firstIndex, lastIndex).map(row =>
        <div className="data-item">
          <Row>
            {
              schema.map(item => 
                <Col span={item.cols}>
                  {item.dataIndex === 'creationDate' ? moment(row[item.dataIndex]).format('DD/MM/YYYY HH:mm:ss') : item.dataIndex === 'risk' ?
                      t(`messages.aml.risk.${row[item.dataIndex]}`) : row[item.dataIndex]
                  }
                </Col>
              )
            }
          </Row>  
          <Row>
            {/* <Col  xs={4}>
              <span className="desc-title">Descripcion</span>
            </Col> */}
            <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} xs={24}>
              <pre className="comments">{row.comments}</pre>
            </Col>
          </Row>  
        </div>
      )}       
      <Pagination onChange={handleChangePage} current={currentPage} pageSize={maxItemsPerPage} total={data.length} style={{textAlign: 'center'}} /> 
    </Modal>
      )
}

export default HistoryModal;
