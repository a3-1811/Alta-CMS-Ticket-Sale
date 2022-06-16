import React from 'react'
import './style.scss'
type Props = {}

const NotFoundPage = (props: Props) => {
  return (
    <div className="page-container">
        <div className="bg bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url('https://blog.hubspot.com/hubfs/404-error-page.jpg')`}}></div>
        <h1 className="title absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[400px] font-bold text-yellow/0">404</h1>
      </div>
  )
}

export default NotFoundPage