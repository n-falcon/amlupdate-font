import React, {Component} from 'react';
import { withTranslation } from 'react-i18next'
import './PdfModal.scss'

import {Modal, Button} from 'antd';

class PdfModal extends Component {

    state = {
      urlPdf: null
    }

    async componentDidMount() {
      const { pdfSource, embeded, isObj } = this.props;
      if(!isObj){
        const blob = this.base64ToBlob( pdfSource, 'application/pdf' );
        const url = URL.createObjectURL( blob );
        if(!embeded) window.open(url)
        this.setState({
          urlPdf: url
        })
      }else{
        const url = URL.createObjectURL( pdfSource );
        this.setState({
          urlPdf: url
        })
      }

    }

    base64ToBlob( base64, type = "application/octet-stream" ) {
      const binStr = atob( base64 );
      const len = binStr.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[ i ] = binStr.charCodeAt( i );
      }
      return new Blob( [ arr ], { type: type } );
    }

    render() {
        const {t, closeHandler, embeded } = this.props;

        return (
            embeded ?
            <Modal
                title={t('messages.aml.certificate')}
                width = {1200}
                style={{ top: 5 }}
                wrapClassName="pdfModal"
                visible={true}
                onCancel={closeHandler}
                footer={[<Button onClick={closeHandler}>{t('messages.aml.btnClose')}</Button>]}>
                    <iframe src={ this.state.urlPdf } frameBorder="0" width="100%" height="100%"></iframe>
            </Modal>
            :
            <div></div>
        )
    }
}

export default withTranslation()(PdfModal)
