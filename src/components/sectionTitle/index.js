import React from 'react'
import './style.scss'

const SectionTitle = ({title, algin="left"}) => (
    <h4 className="section-title" style={{'textAlign': algin}}>{title}</h4>
)

export default SectionTitle