import React, {Component} from 'react';
import axios from 'axios';
import QuizCreator from './components/QuizCreator';
import Toggle from './components/Toggle';

class App extends Component {
  state = {
    currentQuiz: 0,
    quizzes: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    quizCreatorDisplay: false,
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  };

  // this will download all of the quizzes from the database and add them to this.state.quizzes array
  getDataFromDb = () => {
    fetch('http://localhost:3001/quiz/getQuiz')
      .then((quiz) => quiz.json())
      .then((res) => this.setState({ quizzes: res.quiz }));
  };

  createQuiz = (message) => {
    
    let currentIds = this.state.quizzes.map((quiz) => quiz.id);
    let idToBeAdded = 0;
    
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    
    axios.post('http://localhost:3001/quiz/newQuiz', {
      
      name: message,
    });
    
  };

  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.quizzes.forEach((quiz) => {
      if (quiz.id == idTodelete) {
        objIdToDelete = quiz._id;
              }
    });

    axios.delete('http://localhost:3001/quiz/deleteQuiz', {
      data: {
        id: objIdToDelete,
      },
      });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.quizzes.forEach((dat) => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/quiz/updateQuiz', {
      
      update: { name: updateToApply },
    });
  };

  
  

  render() {
    const { quizzes } = this.state;
    
    const displayQuizzes = quizzes.map((quiz) => {
      return (<li style={{ padding: '10px' }} key={quiz._id}>
        <span style={{ color: 'gray' }}> id: </span> {quiz._id} <br />
        <span style={{ color: 'gray' }}> data: </span>
        {quiz.name}
      </li>);
    });
          
    return (
      <div>
        <h1>Welcome to the Quiz Factory!</h1>
        <ul>
          {quizzes.length <= 0
            ? 'No quizzes exist right now. Why don\'t you make one? \:\)'
            : displayQuizzes
          }
        </ul>

        <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
          <QuizCreator 
          
          />
      </div>    
              
    );
  }
}

export default App;