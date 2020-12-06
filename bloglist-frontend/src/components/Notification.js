import React from 'react'
import { Alert } from '@material-ui/lab'

const Notification = ({ notification }) => {
  if (!notification.message) {
    return null
  }

  if (!notification.isSuccess) {
    return (
      <Alert severity="error" variant="filled">
        {notification.message}
      </Alert>
    )
  }

  return (
    <Alert severity="success" variant="filled">
      {notification.message}
    </Alert>
  )
}

export default Notification
