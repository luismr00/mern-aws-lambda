import React from 'react'

const Unauthorized = () => {
  return (
    <div>
        <h3>Unauthorized</h3>
        <button onClick={() => window.location.href = '/signin'}>Sign in</button>
    </div>
  )
}

export default Unauthorized