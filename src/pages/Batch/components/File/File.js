import './File.scss'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Popconfirm, Progress } from 'antd'
import fileImg from './file.png'
import apiConfig from '../../../../config/api'
import { ReportService } from '../../../../services'
import { cancelProcessPromise } from '../../promises'


const File = ({ file, currentUser }) => {
  const { t } = useTranslation()

  const [isDownloadingResults, setIsDownloadingResults] = useState(false)

  const handleDownloadPDF = () => {
    window.open(apiConfig.url + '/../pdfBatch/batch.pdf?id=' + file.id + '&userId=' + currentUser.id)
  }

  const handleDownloadZIP = async () => {
    await setIsDownloadingResults(true)
    await ReportService.read('/zipFile', { id: file.id }, null, 'resultados.zip')
    await setIsDownloadingResults(false)
  }

  const handleDownloadOriginal = async () => {
    await ReportService.read('/inputFile', { id: file.fileId }, null, file.fileName)
  }

  const renderStatusClassName = () => {
    const fileStatus = file.status
    const baseClassName = 'file'

    let statusClassName

    switch (fileStatus) {
      case 'NEW':
        statusClassName = 'queued'
        break

      case 'INPROCESS':
        statusClassName = 'in-process'
        break

      case 'PROCESSED':
        statusClassName = 'ready'
        break

      default:
        statusClassName = 'downloaded'
        break
    }

    return baseClassName + ' ' + statusClassName
  }

  const renderStatusString = () => {
    const fileStatus = file.status

    let statusString

    switch (fileStatus) {
      case 'NEW':
        statusString = t('messages.aml.queued')
        break

      case 'INPROCESS':
        statusString = t('messages.aml.inProcess')
        break

      case 'PROCESSED':
        statusString = ''
        break

      default:
        statusString = t('messages.aml.downloaded')
        break
    }

    return statusString
  }

  const renderStatusIcon = () => {
    const fileStatus = file.status

    let statusString

    switch (fileStatus) {
      case 'NEW':
        statusString = 'hourglass'
        break

      case 'INPROCESS':
        statusString = 'loading'
        break

      case 'PROCESSED':
        statusString = 'check'
        break

      default:
        statusString = 'check'
        break
    }

    return statusString
  }

  const renderStatusPercent = () => {
    const lines = file.lines
    const linesProcessed = file.linesProc

    return Math.round((linesProcessed * 100) / lines)
  }

  const handleCancelProcess = async (id) => {
    await cancelProcessPromise(id)
  }

  return (
    <div className={ renderStatusClassName() }>
      <div className="upper">
        <div className="status-bar">
          <div className="downloaded-sticker" />
          <span className="status-string">{ renderStatusString() }</span>
          <Icon type={ renderStatusIcon() } />
        </div>
        <div className="text-file-icon">
          <img src={ fileImg } alt="" />
        </div>
        <div className="progress-overlay">
          <Progress type="circle" percent={ renderStatusPercent() } strokeColor='#4d8842' strokeWidth="5" strokeLinecap="square" />
          <Popconfirm
            title="Desea cancelar el proceso ? ( Se eliminará el archivo definitivamente )"
            okText="Ok"
            cancelText="Cancelar"
            onConfirm={ () => handleCancelProcess(file.id) }
          >
          <div className="stop-overlay"><Icon type="close" /></div>
          </Popconfirm>
        </div>
        <div className="buttons-overlay">
          <div>
            <Button type="primary" onClick={ handleDownloadPDF }>
              <Icon type="cloud-download" /> { t('messages.aml.certificatePdf') }
            </Button>
            <Button type="primary" onClick={ handleDownloadZIP }>
              <Icon type={ isDownloadingResults ? 'loading' : 'cloud-download' } /> { t('messages.aml.resultsZip') }
            </Button>
          </div>
        </div>
        <div className="black-overlay" />
      </div>
      <div className="lower" onClick={ handleDownloadOriginal }>
        <div className="file-name">
          <div className="file-name-inner" title={ file.fileName }>
            { file.fileName }
          </div>
        </div>
      </div>
    </div>
  )
}

export default File
