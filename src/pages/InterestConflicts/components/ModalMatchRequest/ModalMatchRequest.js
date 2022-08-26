import "./ModalMatchRequest.scss";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Icon,
  Input,
  Modal,
  Checkbox,
  Row,
  Select,
  Spin,
  notification,
  Popconfirm,
  Pagination,
  Collapse
} from "antd";
import {
  getClientsMinPromise,
  saveItemPromise,
  getAreasPromise,
} from "./promises";
import { camelizerHelper } from "../../../../helpers";

const ModalMatchRequest = ({isVisible, onClose, onNewRelease, record, currentUser }) => {
  const { t } = useTranslation();

  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subject, setSubject] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [hasEmpresa, setHasEmpresa] = useState(false);
  const [areas, setAreas] = useState([]);

  const [activeKey,setActiveKey] = useState(null)
  const [matchCategoryDisabled,setMatchCategoryDisabled] = useState(false)

  const [ selection1, setSelection1 ] = useState({category: null, currentPage: 1, recipientsList: {}, chkAll: false, chkAllRecp: false, clientsList: {}, nroClients: 0, nroClientsSelected: 0, itemsList: null, itemsRecpList: null, overLimit: false, filters: null, keyword: null, company: null, companyName: null, area: null, keywordRecpt: null, companyRecpt: null, areaRecpt: null})
  const [ selection2, setSelection2 ] = useState({category: null, currentPage: 1, recipientsList: {}, chkAll: false, chkAllRecp: false, clientsList: {}, nroClients: 0, nroClientsSelected: 0, itemsList: null, itemsRecpList: null, overLimit: false, filters: null, keyword: null, company: null, companyName: null, area: null, keywordRecpt: null, companyRecpt: null, areaRecpt: null})
  const [nCategories, setNCategories] = useState(1)
  const [level, setLevel] = useState(1)
  const [levels, setLevels] = useState([])
  const [periodicity,setPeriodicity] = useState(null)

  const limitRecords = 10;

  const handleOnCategorySelect = (value, matchCategory) => {
    let antCategory
    switch(matchCategory){
      case '1':
        antCategory = selection1.category
        selection1.category = value
        selection1.recipientsList = {}
        setSelection1(selection1)
        handleGetClients(matchCategory, selection1, null, null, null)

        if(selection2.category !== null) {
          selection2.category = null
          selection2.chkAllRecp = true
          setSelection2(selection2)
          handleMoveToClients('2', selection2)
        }
        break
      case '2':
        antCategory = selection2.category
        selection2.category = value
        selection2.recipientsList = {}
        setSelection2(selection2)
        handleGetClients(matchCategory, selection2, null, null, null);
        break
    }
    if(antCategory === null || matchCategory !== activeKey) {
      enableCollapse()
      setActiveKey(matchCategory)
    }
  }

  const enableCollapse = () => {
    setMatchCategoryDisabled(false)
  }

  const disableCollapse = () => {
    setMatchCategoryDisabled(true)
  }

  const handlerChangeTab = (key) => {
      if(!matchCategoryDisabled && key !== null && key !== undefined && key !== activeKey) setActiveKey(key)
  }

  const categorySelection = (matchCategory, selection) => {
    return (
      <Row>
        <Col span={4}>Seleccionar Categoria {matchCategory}</Col>
        <Col span={6}>
          <Select style={{ width: "200px" }} value={selection.category} size="small" onClick={disableCollapse} onFocus={disableCollapse} onBlur={enableCollapse}  onChange={(value) => handleOnCategorySelect(value, matchCategory)} placeholder="Seleccionar Categoria">
            { (matchCategory === '1' || selection1.category !== 'COLABORADOR') &&
              <Select.Option value="COLABORADOR">{t('messages.aml.category.COLABORADOR')}</Select.Option>
            }
            { (matchCategory === '1' || selection1.category !== 'PROVEEDOR') &&
              <Select.Option value="PROVEEDOR">{t('messages.aml.category.PROVEEDOR')}</Select.Option>
            }
            { (matchCategory === '1' || selection1.category !== 'CLIENTE') &&
              <Select.Option value="CLIENTE">{t('messages.aml.category.CLIENTE')}</Select.Option>
            }
          </Select>
        </Col>
        { matchCategory === '1' && nCategories === 1 &&
          <Col offset={10} span={4}>
            <Button icon="plus" onClick={() => setNCategories(2)} size="small">Agregar</Button>
          </Col>
        }
        { matchCategory === '2' && nCategories === 2 &&
          <Col offset={10} span={4}>
            <Button icon="delete" onClick={() => setNCategories(1)} size="small">Eliminar</Button>
          </Col>
        }
      </Row>
    );
  };

  useEffect(() => {
    getAreasPromise().then((data) => {
      setAreas(data);
    });

    if (
      currentUser.cliente.outsourcer &&
      currentUser.cliente.clientes !== null &&
      currentUser.cliente.clientes.length > 0 &&
      currentUser.subcliente === null
    ) {
      setHasEmpresa(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePagination = async (page, panelId, objSelection) => {
    setIsClientsLoading(true);

    objSelection.nroClients = 0
    objSelection.chkAll = false;

    const fromNum = (page - 1) * limitRecords;
    const c = await getClientsMinPromise(
      fromNum,
      limitRecords,
      [objSelection.category],
      objSelection.keyword,
      objSelection.company,
      objSelection.area
    );
    const items = {};

    let j = 0;
    for (let i = 0; i < c.data.records.length; i++) {
      const id = c.data.records[i].id;
      const data = c.data.records[i];
      const isSelected = false;
      if (objSelection.recipientsList[id] === null || objSelection.recipientsList[id] === undefined) {
        items[id] = {
          data,
          isSelected,
        };
        j++;
      }
    }

    objSelection.itemsList = { total: c.data.total, records: j }
    objSelection.clientsList = items
    setIsClientsLoading(false);

    if(panelId === '1') setSelection1(objSelection)
    else if(panelId === '2') setSelection2(objSelection)
  };

  const handlePaginationChange = async (panelId, objSelection, value) => {
    objSelection.currentPage = value

    if(panelId === '1') setSelection1(objSelection)
    else if(panelId === '2') setSelection2(objSelection)
    handlePagination(value, panelId, objSelection);
  };

  const handleGetClients = async (panelId, objSelection, kyw, empresa, _area) => {
    objSelection.currentPage = 1
    if(panelId === '1') setSelection1(objSelection)
    else setSelection2(objSelection)
    handlePagination(1, panelId, objSelection);
  };

  const getFilterRecipientList = (objSelection) => {
    let newList = [];
    let i = 0;
    for (let k in objSelection.recipientsList) {
      let item = objSelection.recipientsList[k];
      let addKyw = true;
      let addEmp = true;
      let addArea = true;

      if (
        objSelection.keywordRecpt !== null &&
        !item.data.name.toLowerCase().includes(objSelection.keywordRecpt.toLowerCase()) &&
        !item.data.rut.toLowerCase().includes(objSelection.keywordRecpt.toLowerCase())
      )
        addKyw = false;
      if (
        objSelection.companyRecpt !== null &&
        item.data.company !== null &&
        item.data.company.toLowerCase() !== objSelection.companyRecpt.toLowerCase()
      )
        addEmp = false;
      if (
        objSelection.areaRecpt !== null &&
        item.data.area !== null &&
        !item.data.area.toLowerCase().includes(objSelection.areaRecpt.toLowerCase())
      )
        addArea = false;

      if (addKyw && addEmp && addArea && i < limitRecords) {
        newList[i] = item;
        i++;
      }
    }
    if (objSelection.itemsRecpList === null) {
      objSelection.itemsRecpList = { total: 0, records: i }
    } else if (objSelection.itemsRecpList.records !== i) {
      let total = objSelection.itemsRecpList.total;
      objSelection.itemsRecpList = { total, records: i }
    }
    return newList;
  };

  const handlerFilterDest = (panelId, objSelection, text) => {
    objSelection.keyword = text

    handleGetClients(panelId, objSelection);
  };

  const handlerFilterDestRecpt = (panelId, objSelection, text) => {
    let obj = JSON.parse(JSON.stringify(objSelection));

    obj.keywordRecpt = text
    if(panelId === '1') setSelection1(obj)
    else if(panelId === '2') setSelection2(obj)
  };

  const handlerFilterCompany = (panelId, objSelection, value, e) => {
    if (value === null) {
      objSelection.company = null
      objSelection.companyName = null
      handleGetClients(panelId, objSelection);
    } else {
      objSelection.company = value
      objSelection.companyName = e.props.children
      handleGetClients(panelId, objSelection);
    }
  };

  const handlerFilterCompanyRecpt = (panelId, objSelection, value) => {
    let obj = JSON.parse(JSON.stringify(objSelection));

    obj.companyRecpt = value
    if(panelId === '1') setSelection1(obj)
    else if(panelId === '2') setSelection2(obj)
  };

  const handlerFilterArea = (panelId, objSelection, value) => {
    objSelection.area = value
    handleGetClients(panelId, objSelection);
  };

  const handlerFilterAreaRecpt = (panelId, objSelection, value) => {
    let obj = JSON.parse(JSON.stringify(objSelection));

    obj.areaRecpt = value
    if(panelId === '1') setSelection1(obj)
    else if(panelId === '2') setSelection2(obj)
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleClientClick = async (id, panelId, objSelection) => {
    let isSelected = objSelection.clientsList[id].isSelected

    let obj = JSON.parse(JSON.stringify(objSelection));
    obj.clientsList[id].isSelected = !isSelected;

    let nro = objSelection.nroClients;
    if (isSelected) nro--;
    else nro++;

    obj.nroClients = nro
    obj.chkAll = false

    if(panelId === '1') setSelection1(obj)
    else setSelection2(obj)
  };

  const handleRecipientClick = async (panelId, objSelection, item) => {
    let obj = JSON.parse(JSON.stringify(objSelection));
    obj.recipientsList[item.data.id].isSelected = !item.isSelected;

    let nro = obj.nroClientsSelected
    if (item.isSelected) nro--;
    else nro++;
    obj.nroClientsSelected = nro

    if(panelId === '1') setSelection1(obj)
    else setSelection2(obj)
  };

  const handleSelectDeselectAll = async (panelId, objSelection, e) => {
    let obj = JSON.parse(JSON.stringify(objSelection));
    for (let k in obj.clientsList) {
      obj.clientsList[k].isSelected = e.target.checked;
    }
    obj.chkAll = e.target.checked
    obj.nroClients = e.target.checked ? Object.keys(obj.clientsList).length : 0

    if(panelId === '1') setSelection1(obj)
    else setSelection2(obj)
  };

  const handleSelectDeselectRecipient = async (panelId, objSelection, e) => {
    let obj = JSON.parse(JSON.stringify(objSelection));
    let i = 0;
    for (let k in obj.recipientsList) {
      obj.recipientsList[k].isSelected = e.target.checked;
      if (e.target.checked) i++;
    }

    obj.chkAllRecp = e.target.checked

    if (e.target.checked) {
      obj.nroClientsSelected = i
    } else {
      obj.nroClientsSelected = 0
    }

    if(panelId === '1') setSelection1(obj)
    else setSelection2(obj)
  };

  const handleMoveToRecipients = (panelId, objSelection) => {
    let obj = JSON.parse(JSON.stringify(objSelection));
    let newList = {};
    if (obj.chkAll) {
      obj.filters = { keyword: obj.keyword, company: obj.company, companyName: obj.companyName, area: obj.area }
    } else {
      obj.filters = null
      newList = obj.recipientsList
    }

    let i = 0;
    for (let k in obj.clientsList) {
      if (obj.clientsList[k].isSelected) {
        newList[k] = obj.clientsList[k];
        newList[k].isSelected = false;

        delete obj.clientsList[k];
      } else {
        i++;
      }
    }

    obj.itemsList = { total: obj.itemsList.total, records: i }
    obj.itemsRecpList = { total: Object.keys(newList).length }
    obj.recipientsList = newList

    if (obj.chkAll && obj.itemsList.total > limitRecords) {
      obj.overLimit = true
      obj.itemsRecpList = { total: obj.itemsList.total }
    } else {
      obj.overLimit = false
    }
    obj.chkAll = false
    obj.nroClients = 0

    if(panelId === '1') setSelection1(obj)
    else setSelection2(obj)
  };

  const handleMoveToClients = (panelId, objSelection) => {
    let obj = JSON.parse(JSON.stringify(objSelection))
    let newList = obj.clientsList

    let i = obj.itemsList.records;
    for (let k in obj.recipientsList) {
      if (obj.recipientsList[k].isSelected || obj.overLimit) {
        newList[k] = obj.recipientsList[k];
        newList[k].isSelected = false;
        delete obj.recipientsList[k];
        i++;
      }
    }

    obj.filters = null
    obj.chkAll = false
    if (obj.chkAllRecp || obj.overLimit) {
      obj.itemsRecpList = { total: 0, records: 0 }
      obj.recipientsList = {};
    }
    obj.clientsList = newList
    obj.itemsList = { total: obj.itemsList.total, records: i }
    obj.nroClientsSelected = 0

    obj.overLimit = false
    obj.chkAllRecp = false

    if(panelId === '1') setSelection1(obj)
    else setSelection2(obj)
  };

  const saveThis = async () => {
    if (subject === null || subject === "") {
      notification["error"]({
        message: "Error",
        description: t("messages.aml.missingRequiredField"),
      });
      return;
    }

    let recipients1 = [];
    let recipients2 = [];
    for (let k in selection1.recipientsList) {
      recipients1.push({
        record: {
          id: k,
        },
      });
    }
    for (let k in selection2.recipientsList) {
      recipients2.push({
        record: {
          id: k,
        },
      });
    }
    if (recipients1.length === 0 || (recipients2.length === 0 && nCategories === 2)) {
      notification["error"]({
        message: "Error",
        description: "Debe seleccionar al menos un Registro",
      });
      return;
    }

    let g1 = { category: selection1.category }
    if (selection1.filters === null) {
      g1.recipients = recipients1;
    } else {
      g1.filters = selection1.filters;
    }

    let recipients = [g1]

    if(nCategories === 2) {
      if (selection1.category === selection2.category) {
        notification["error"]({
          message: "Error",
          description: "Debe seleccionar distintas Categorías",
        });
        return;
      }

      let g2 = { category: selection2.category }
      if (selection2.filters === null) {
        g2.recipients = recipients2;
      } else {
        g2.filters = selection2.filters;
      }
      recipients.push(g2)
    }

    const body = {
      id: record !== null ? record.id : null,
      subject,
      recipients: recipients,
      levels: levels,
      levelId: level,
      periodicity: periodicity
    };

    setIsSaving(true);
    //console.log(body)
    await saveItemPromise(body);
    setIsSaving(false);
    onClose();
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handlerChangeLevel = (item, value) => {
    let _levels = [...levels]
    if(value) {
      if(!_levels.includes(item)) {
        _levels.push(item)
        setLevels(_levels)
      }
    }else if(_levels.includes(item)) {
      let index = _levels.indexOf(item)
      _levels.splice(index, 1)
      setLevels(_levels)
    }
  }

  const renderPanelCollapse = (panelId, selection) => {
    return (
    <Collapse.Panel header={categorySelection(panelId, selection)} key={panelId} disabled={selection.category === null || matchCategoryDisabled}>
      <Row className="clients-section">
        <Col span={12}>
          <div className="col-inner">
            <Row className="filter-row">
              <Col span={1} style={{ paddingTop: "5px" }}>
                <Checkbox
                  onChange={(e) => handleSelectDeselectAll(panelId, selection, e)}
                  checked={selection.chkAll}
                />
              </Col>
              <Col span={hasEmpresa ? 12 : 15}>
                <Input.Search
                  size="small"
                  onSearch={(text) => handlerFilterDest(panelId, selection, text)}
                  placeholder="Rut/Nombre"
                  allowClear
                />
              </Col>
              {hasEmpresa && (
                <Col span={6}>
                  <Select
                    placeholder="Empresa"
                    style={{ width: "100%" }}
                    size="small"
                    onChange={(value, e) => handlerFilterCompany(panelId, selection, value, e)}
                  >
                    <Select.Option value={null}>
                      [Todos]
                    </Select.Option>
                    {currentUser.cliente.clientes.map(
                      (company) => (
                        <Select.Option value={company.id}>
                          {company.name}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Col>
              )}
              <Col span={hasEmpresa ? 5 : 8}>
                <Select
                  placeholder="Area"
                  style={{ width: "100%" }}
                  size="small"
                  onChange={(value) => handlerFilterArea(panelId, selection, value)}
                >
                  <Select.Option value={null}>
                    [Todos]
                  </Select.Option>
                  {areas.map((area) => (
                    <Select.Option value={area}>
                      {area}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            {isClientsLoading ? (
              <div className="loading">
                <Spin spinning="true" />
              </div>
            ) : (
              <>
                <div className="items-wrapper">
                  <div className="items-collection">
                    {Object.keys(selection.clientsList).map((id) => (
                      <Row
                        className="item-dest"
                        onClick={() =>
                          handleClientClick(id, panelId, selection)
                        }
                      >
                        <Col span={1}>
                          <Checkbox checked={selection.clientsList[id].isSelected}
                          />
                        </Col>
                        <Col span={12}>
                          {camelizerHelper(selection.clientsList[id].data.nombre)}
                        </Col>
                        {hasEmpresa && (
                          <Col span={6}>
                            {camelizerHelper(selection.clientsList[id].data.company)}
                          </Col>
                        )}
                        <Col span={hasEmpresa ? 5 : 8}>
                          {camelizerHelper(selection.clientsList[id].data.area)}
                        </Col>
                      </Row>
                    ))}
                  </div>
                </div>
                <Row>
                  <Col className="total">
                    <h4>
                      {selection.itemsList && (
                        <>
                          {selection.itemsList.total > selection.itemsList.records ? (
                            <>Mostrando {selection.itemsList.records} de {selection.itemsList.total} registros</>
                          ) : (
                            <>{selection.itemsList.total} registro{selection.itemsList.total > 1 && "s"}</>
                          )}
                        </>
                      )}
                    </h4>
                    {selection.itemsList !== null &&
                      selection.itemsList.total > limitRecords && (
                        <Pagination
                          size="small"
                          simple
                          onChange={(page) => handlePaginationChange(panelId, selection, page)}
                          pageSize={limitRecords}
                          current={selection.currentPage}
                          total={selection.itemsList.total}
                        />
                      )}
                  </Col>
                </Row>
              </>
            )}
            <div className="add-button">
              <Button
                type="primary"
                disabled={selection.nroClients === 0}
                onClick={() => handleMoveToRecipients(panelId, selection)}
              >
                Agregar{" "}
                {selection.chkAll ? (
                  <>&nbsp;{selection.itemsList.total} contactos</>
                ) : (
                  <>
                    {selection.nroClients > 0 && (
                      <span>&nbsp;{selection.nroClients}</span>
                    )}{" "}
                    &nbsp;contacto{selection.nroClients > 1 && <>s</>}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
        <Col className="recipients" span={12}>
          <div className="col-inner">
            <Row className="filter-row">
              <Col span={1} style={{ paddingTop: "5px" }}>
                <Checkbox
                  onChange={(e) => handleSelectDeselectRecipient(panelId, selection, e)}
                  checked={selection.chkAllRecp}
                  disabled={selection.overLimit}
                />
              </Col>
              <Col span={hasEmpresa ? 12 : 15}>
                <Input.Search
                  size="small"
                  onSearch={(text) => handlerFilterDestRecpt(panelId, selection, text)}
                  placeholder="Rut/Nombre"
                  allowClear
                />
              </Col>
              {hasEmpresa && (
                <Col span={6}>
                  <Select
                    placeholder="Empresa"
                    style={{ width: "100%" }}
                    size="small"
                    onChange={(text) => handlerFilterCompanyRecpt(panelId, selection, text)}
                  >
                    <Select.Option value={null}>
                      [Todos]
                    </Select.Option>
                    {currentUser.cliente.clientes.map(
                      (company) => (
                        <Select.Option value={company.name}>
                          {company.name}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Col>
              )}
              <Col span={hasEmpresa ? 5 : 8}>
                <Select
                  placeholder="Area"
                  style={{ width: "100%" }}
                  size="small"
                  onChange={(text) => handlerFilterAreaRecpt(panelId, selection, text)}
                >
                  <Select.Option value={null}>
                    [Todos]
                  </Select.Option>
                  {areas.map((area) => (
                    <Select.Option value={area}>
                      {area}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            {isClientsLoading ? (
              <div className="loading">
                <Spin spinning="true" />
              </div>
            ) : (
              <>
                <div className="items-wrapper">
                  {!selection.overLimit ? (
                    <div className="items-collection">
                      {getFilterRecipientList(selection).map(
                        (item, index) => (
                          <Row
                            className="item-dest"
                            onClick={() =>
                              handleRecipientClick(panelId, selection, item)
                            }
                          >
                            <Col span={1}>
                              <Checkbox
                                checked={item.isSelected}
                              />
                            </Col>
                            <Col span={12}>
                              {camelizerHelper(item.data.nombre)}
                            </Col>
                            {hasEmpresa && (
                              <Col span={6}>
                                {camelizerHelper(
                                  item.data.company
                                )}
                              </Col>
                            )}
                            <Col span={hasEmpresa ? 5 : 8}>
                              {camelizerHelper(item.data.area)}
                            </Col>
                          </Row>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="totalSelected">
                      <h1>
                        Se seleccionaron {selection.itemsRecpList.total}{" "}
                        registros
                      </h1>
                      <div className="filters">
                        <Row>
                          Rut/Nombre:{" "}
                          <strong>
                            {selection.filters.keyword !== null
                              ? selection.filters.keyword
                              : "[Todos]"}
                          </strong>
                        </Row>
                        {hasEmpresa && (
                          <Row>
                            Empresa:{" "}
                            <strong>
                              {selection.filters.companyName !== null
                                ? selection.filters.companyName
                                : "[Todos]"}
                            </strong>
                          </Row>
                        )}
                        <Row>
                          Area:{" "}
                          <strong>
                            {selection.filters.area !== null
                              ? selection.filters.area
                              : "[Todos]"}
                          </strong>
                        </Row>
                      </div>
                    </div>
                  )}
                </div>
                <Row>
                  <Col className="total">
                    <h4>
                      {!selection.overLimit && selection.itemsRecpList !== null && (
                        <>
                          {selection.itemsRecpList.records === selection.itemsRecpList.total ? (
                            <>{selection.itemsRecpList.records} registro{selection.itemsRecpList.records > 1 && "s"}</>
                          ) : (
                            <>Mostrando {selection.itemsRecpList.records} de {selection.itemsRecpList.total} registros</>
                          )}
                        </>
                      )}
                    </h4>
                  </Col>
                </Row>
              </>
            )}
            <div className="add-button second">
              <Button
                type="primary"
                disabled={!selection.overLimit && selection.nroClientsSelected === 0}
                onClick={() => handleMoveToClients(panelId, selection)}
              >
                Eliminar
                {!selection.overLimit ? (
                  <>
                    {selection.nroClientsSelected > 0 && (
                      <span>&nbsp;{selection.nroClientsSelected}</span>
                    )}{" "}
                    &nbsp;contacto
                    {selection.nroClientsSelected > 1 && <>s</>}
                  </>
                ) : (
                  <>&nbsp;{selection.itemsRecpList.total} contactos</>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Collapse.Panel>
    )
  }

  return (
    <Modal
      className="modal-match-request"
      footer={null}
      onCancel={onClose}
      onOk={onNewRelease}
      style={{ top: 10 }}
      visible={isVisible}
      width={1100}
    >
      <div className="body-wrapper">
        <Row>
          <Col span={24}>
            <div className="col-inner">
              <div id="subject-select" className="box">
                <h2>Ingrese el nombre de solicitud</h2>
                <div className="subject-select-inner">
                  <Input onChange={handleSubjectChange} value={subject} />
                </div>
              </div>
            </div>
          </Col>
          {/*
          <Col span={12}>
            <div className="col-inner">
              <div id="subject-select" className="box">
                <h2>Seleccione Profundidad</h2>
                <div className="subject-select-inner">
                  <div className="item-check">
                    <span>UBOs</span>
                    <Switch disabled={true} checked={levels.includes('UBO')} value="UBO" onChange={(value) => handlerChangeLevel('UBO', value)}/>
                  </div>
                  <div className="item-check">
                    <span>Parientes</span>
                    <Switch value="PARENT" checked={levels.includes('PARENT')} onChange={(value) => handlerChangeLevel('PARENT', value)}/>
                  </div>
                  <div className="item-check">
                    <span>Parientes UBOs</span>
                    <Switch value="PARENT-UBO" checked={levels.includes('PARENT-UBO')} onChange={(value) => handlerChangeLevel('PARENT-UBO', value)}/>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          */}
        </Row>
        <Row>
          <Col span={24}>
            <div className="col-inner">
              <div id="clients-unselected-list" className="box">
                <Collapse accordion activeKey={activeKey} onChange={handlerChangeTab}>
                  { renderPanelCollapse('1', selection1) }
                  { nCategories === 2 && renderPanelCollapse('2', selection2) }
                </Collapse>
              </div>
            </div>
          </Col>
        </Row>
        <div className="send-wrapper">
          <Popconfirm
            title="Confirmar guardar?"
            placement="top"
            onConfirm={saveThis}
            okText="Sí"
            cancelText="No"
          >
            <Button type="primary" id="send" disabled={isSaving} block={true}>
              {isSaving && <Icon type="loading" />}
              Enviar solicitud
            </Button>
          </Popconfirm>
        </div>
        <div
          className={
            isPreviewOpen
              ? "visible preview-overlay"
              : "no-visible preview-overlay"
          }
        >
          <Icon type="close" onClick={handleClosePreview} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMatchRequest;
