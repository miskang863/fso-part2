import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === personObject.name)) {
      const person = persons.find(p => p.name === newName)
      const changedPerson = { ...person, number: newNumber }

      const result = window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`);

      if (result) {
        personService
          .update(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.name !== newName ? person : response))
            setNotification(
              `Phone number changed to ${personObject.number}`
            )
            setTimeout(() => {
              setNotification(null)
            }, 3000)
          }).catch(error => {
            setPersons(persons.filter(p => p.id !== changedPerson.id))
            setError(
              `Information of ${personObject.name} has already been removed from server`
            )
            setTimeout(() => {
              setError(null)
            }, 3000)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject))
          setNotification(
            `Added ${personObject.name}`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (e, person) => {
    e.preventDefault()
    const result = window.confirm(`Delete ${person.name}?`);
    if (result) {
      personService.remove(person.id)
      setPersons(persons.filter(p => p.id !== person.id))
      setNotification(
        `Deleted ${person.name}`
      )
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <Notification message={notification} />
      <Error message={error} />
      <h2>Phonebook</h2>
      <Filter
        value={filter}
        onChange={handleFilter} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameChange={handlePersonChange}
        numberValue={newNumber}
        numberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {personsFiltered.map(person =>
        <Persons
          key={persons.indexOf(person)}
          person={person}
          handleDelete={handleDelete} />
      )}
    </div>
  )
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ onSubmit, nameValue, nameChange, numberValue, numberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={nameChange} />
      </div>
      <div>number: <input value={numberValue} onChange={numberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={(e) => handleDelete(e, person)}>delete</button>
    </p>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


export default App