import React from "react"
import './Step1.scss'
import {Row} from 'antd'

const Step1 = ({fileOrBd}) => {


    return (
        <div className='step1-content'>
                Paso 1: Origen de la base de datos
                <br/>
                <br/>
                Si utilizará una base de datos externa, <a href="#" onClick= { () => fileOrBd("file") }>presione aquí</a>
                <br/>
                <br/>
                <br/>
                Si utilizará una base de datos almacenada en AMLupdate, <a href="#" onClick={ () => fileOrBd("bd") }>presione aquí</a>
        </div>
    )
}
export default Step1
