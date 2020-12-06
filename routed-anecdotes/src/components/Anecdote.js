import React from 'react'

const Anecdote = ({ anecdote }) => (
  <div>
    <h1>{anecdote.content}</h1>
    has {anecdote.votes} votes
  </div>
)

export default Anecdote
