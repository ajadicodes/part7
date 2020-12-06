import React from 'react'
import { useHistory } from 'react-router-dom'
import { useField } from '../hooks/index'

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('url')

  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })

    // redirect to anecdote list
    history.push('/')
  }

  const resetFields = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} reset={null} />
        </div>
        <div>
          author
          <input {...author} reset={null} />
        </div>
        <div>
          url for more info
          <input {...info} reset={null} />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={resetFields}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew
