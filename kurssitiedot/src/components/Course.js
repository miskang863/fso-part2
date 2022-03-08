const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
        </div>
    )
}

const Header = ({ course }) => {
    return (
        <div>
            <h2>{course}</h2>
        </div>
    )
}

const Part = ({ part, exercise }) => {
    return (
        <li>
            {part} {exercise}
        </li>
    )
}

const Content = ({ parts }) => {
    return (
        <ul>
            {parts.map(part => <Part key={part.id} part={part.name} exercise={part.exercises} />)}
            <b><Total parts={parts} /></b>
        </ul>
    )
}

const Total = ({ parts }) => {
    return (
        <li>
            total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
        </li>
    )
}

export default Course