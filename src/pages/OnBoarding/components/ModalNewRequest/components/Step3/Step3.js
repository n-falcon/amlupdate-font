import React, { useEffect, useState } from 'react'
import './Step3.scss'
import {Transfer, Button, Row, message} from 'antd'
import {getClientsMinPromise} from '../../../../promises'

const Step3 = ({formBd, prev, sendFormS3}) => {
    const [formFilters, setFormFilters] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
      getClientsMinPromise(0, 1000, [formBd.category], null, formBd.company, formBd.area, formBd.typePerson, formBd.segment ? [formBd.segment] : null).then(response => {
          if (response.success && response.data.records.length > 0) {
          // setFormFilters(response.data)
          getFilteredClients(response.data)
          }else{
              message.error("No se encontraron destinatarios con los filtros seleccionados")
              prev()
          }
      })
    }, [])

      const getFilteredClients = (clients) => {
        const resRec = [];
        clients.records.map(rec => {
          const data = {
            key: rec.id,
            title: rec.nombre,
          };
          resRec.push(data);
        });
        setFormFilters(resRec);
      }

      const handleChange = (selectedIds) => {
        setSelectedIds(selectedIds);
      };

    return (
      <div className="step3-onb">
        <div className="step3-title">
                Paso 3: Seleccione los destinatarios
        </div>
        <Row>
          <div className="step3-transfer">
              <Transfer
                  dataSource={formFilters}
                  showSearch
                  filterOption={(input, option) =>
                    option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  listStyle={{
                    width: 380,
                    height: 370,
                  }}
                  operations={['Agregar', 'Eliminar']}
                  targetKeys={selectedIds}
                  onChange={handleChange}
                  render={item => item.title}
              />
          </div>
        </Row>
        <Row>
          <div className="steps-buttons">
            <Button  onClick={() => prev()}>
                Atrás
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => sendFormS3(selectedIds)}>
                Enviar
            </Button>
          </div>
        </Row>
      </div>


    )
}
export default Step3
