import './Header.scss'
import React, { useState } from 'react'
import { camelizerHelper } from '../../../../helpers'
import { Icon } from 'antd'
import personIcon from './user-icon-2.png'
import entityIcon from './entity-icon-2.png'

export default ({ personName, personRut, personType, imgPerson }) => {
  const [style, setStyle] = useState({width: '100%'})

  const onLoadImage = (i) => {
      let attr = i.target
      let rel = attr.naturalHeight/attr.naturalWidth
      //console.log('rel:'+rel+"; h:"+attr.naturalHeight+"; w:"+attr.naturalWidth)
      if(rel > 1.2) {
        setStyle({maxHeight: 140})
      }
  }

  return (
    <div className="header page-header">
      <div className="avatar">
          { imgPerson !== null && imgPerson !== '' ?
            <div className="image-wrapper-animated">
              <img src={ 'data:image/png;base64,'+imgPerson } className="iconAvatar" alt="" style={style} onLoad={onLoadImage}/>
            </div>
            :
            <>
              { personType === 'Entity' ?
                <div className="image-wrapper">
                  <img src={ entityIcon } className="icon" alt="" />
                </div>
                :
                <div className="image-wrapper">
                  <img src={ personIcon } className="icon" alt="" />
                </div>
              }
            </>
          }
      </div>
      <h1 className="page-title">{ camelizerHelper(personName) }</h1>
      { (personRut !== undefined && personRut !== null && personRut !== 'undefined' && personRut !== 'null') && <p className="rut">{ personRut }</p> }
      <Icon type="user" />
    </div>
  )
}
