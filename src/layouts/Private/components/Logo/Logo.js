import './Logo.scss'
import React from 'react'
import apiConfig from '../../../../config/api'

export default ({ currentUserId }) => (
  <div className="logo">
    <img src={ apiConfig.url + '/../getImageClientUser/' + currentUserId + '/0' } alt="" />
  </div>
)
