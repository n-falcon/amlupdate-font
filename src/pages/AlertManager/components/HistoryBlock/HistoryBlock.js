import "./HistoryBlock.scss";
import React, { useEffect, useState } from "react";
import { Button, Icon, Table, Alert } from "antd";
import { useTranslation } from "react-i18next";
import { getHistorialPromise } from "../../promises";
import moment from "moment";
import { ModalComments, ModalFiles } from "./components";
import { camelizerHelper } from "../../../../helpers";

const HistoryBlock = ({ alert, currentUserId, origin }) => {
  const { t } = useTranslation();
  const [historyItems, setHistoryItems] = useState([]);
  const [modalComment, setModalComment] = useState("");
  const [modalFiles, setModalFiles] = useState([]);

  const [isModalCommentsVisble, setIsModalCommentsVisible] = useState(false);
  const [isModalFilesVisble, setIsModalFilesVisible] = useState(false);

  useEffect(() => {
    if (alert !== null) {
      getHistoryItems();
    }
  }, [alert]);

  async function getHistoryItems() {
    getHistorialPromise(alert.id, currentUserId).then((response) => {
      setHistoryItems(response);
    });
  }

  const handleOnModalComments = (record) => {
    setModalComment(record.comments);
    setIsModalCommentsVisible(true);
  };


  const handleOnModalFiles = (record) => {
    setModalFiles(record.files);
    setIsModalFilesVisible(true);
  };




  const handleModalCommentsCancel = () => {
    setIsModalCommentsVisible(false);
  };


  const handleModalFilesCancel = () => {
    setIsModalFilesVisible(false);
  };



  const historyColumns = [
    {
      title: () => (
        <>
          <div>{t("messages.aml.user") + " /"}</div>
          <div> Asignado a </div>
        </>
      ),
      dataIndex: "user",
      width: "190px",
      render: (text, record) => (
        <>
          <div>{camelizerHelper(record.user)}</div>
          <div>{camelizerHelper(record.asignedTo)}</div>
        </>
      ),
    },
    {
      title: t("Acción"),
      dataIndex: "action",
      width: "150px",
      render: (text) =>
        text !== null ? t("messages.aml.request." + text) : "",
    },
    {
      title: t("messages.aml.request"),
      dataIndex: "request",
      render: (text, record) => <div>{text ? text : "-"}</div>,
    },
    {
      title: t("messages.aml.status"),
      width: "100px",
      dataIndex: "status",
      render: (text) => (text ? t("messages.aml.request." + text) : "-"),
    },

    {
      title: () => (
        <>
          <div>Fecha</div>
          <div>Evento</div>
        </>
      ),
      width: "130px",
      dataIndex: "creationDate",
      render: (text) => <div>{moment(text).utc(false).format("DD/MM/YYYY HH:mm")}</div>,
    },
    {
      title: () => (
        <>
          <div>Duración</div>
          <div>Evento</div>
        </>
      ),
      width: "80px",
      dataIndex: "duration",
      render: (text, record) => <div>{text !== null ? text : "-"}</div>,
    },
    {
      title: () => (
        <>
          <div>Tiempo</div>
          <div>Asignado</div>
        </>
      ),
      width: "80px",
      dataIndex: "days",
      render: (text) => <div> {text ? text + " dias" : "-"}</div>,
    },
    {
      title: t("messages.aml.view"),
      width: "70px",
      render: (text, record) => {
        return (
          <>
            {record.comments !== null && record.comments !== '' && (
              <div
                className="comments-files"
                onClick={(e) => handleOnModalComments(record)}
              >
                <Icon type="folder-open" />
              </div>
            )}
            {record.files !== null && (
              <div
                className="comments-files"
                onClick={(e) => handleOnModalFiles(record)}
              >
                <Icon type="file" />
              </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="history-block block">
      <div className="block-title">
        <Icon type="unordered-list" />
        <h3>{t("messages.aml.record")}</h3>
      </div>
      <div className="block-content">
        <Table
          size="small"
          dataSource={historyItems}
          columns={historyColumns}
          pagination={false}
          scroll={{ y: 500 }}
        />
      </div>

      {isModalCommentsVisble && (
        <ModalComments
          onCancel={handleModalCommentsCancel}
          comment={modalComment}
        />
      )}
      {isModalFilesVisble && (
        <ModalFiles
          onCancel={handleModalFilesCancel}
          files={modalFiles}
          alertId = {alert.id}
          origin = {origin}
          userId = {currentUserId}
        />
      )}


    </div>
  );
};

export default HistoryBlock;
