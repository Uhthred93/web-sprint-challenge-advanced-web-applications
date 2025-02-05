import React, { useState } from 'react'
import PT from 'prop-types'

const initialFormValues = {
  username: '',
  password: '',
}

export default function LoginForm({ login }) { // ✅ Destructured `login` prop
  const [values, setValues] = useState(initialFormValues)

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    login(values) // ✅ Calls `login` function with user credentials
  }

  const isDisabled = () => {
    // ✅ Enable button only if:
    // - `username` is at least 3 characters (trimmed)
    // - `password` is at least 8 characters (trimmed)
    return values.username.trim().length < 3 || values.password.trim().length < 8
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        type="password" // ✅ Added type="password" for security
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">
        Submit credentials
      </button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
