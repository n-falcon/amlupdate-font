import './ModalPdfViewer.scss';
import React, { useEffect, useState } from 'react';
import apiConfig from '../../../../config/api';
import { getFormFilePromise } from './promises';
import { Spin } from 'antd';

const ModalPdfViewer = ({pdfId}) => {
    const [base64, setBase64] = useState(null)

    useEffect(() => {
        getFormFilePromise(pdfId).then((response) => {
        setBase64(response.data);
        })
    }, [])

    return (
        base64 === null ? 
            <div className="spin-pdf-viewer">
                <Spin spinning={true} size="large" centered={true}/> 
            </div>
            :
            <iframe src={"data:application/pdf;base64,"+ base64} frameBorder="0" width="100%" height="100%"></iframe>
    )
}

export default ModalPdfViewer
