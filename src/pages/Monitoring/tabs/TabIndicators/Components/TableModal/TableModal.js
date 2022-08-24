import React from 'react';
import {Modal,Table} from 'antd';


const TableModal = ({onCancel,dataSource,columns,title}) =>{
return (
  <div id="modal-user">
  <Modal
    title={title}
    // className={this.state.modal.className}
    visible={true}
    style={{ top: 30 }}
    footer={null}
    onCancel={onCancel}
  >
    <>
      <Table dataSource={dataSource} columns={columns} size="small" />
    </>
  </Modal>
</div>
)
}

export default TableModal;




  