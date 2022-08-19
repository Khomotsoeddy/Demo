import React, { Component } from 'react';
import Modal from './components/Modal';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      viewCompleted:false,
      activeItem:{
        title:"",
        description:"",
        completed:false
      },
      taskList: []
    };
  };

  componentDidMount(){
    this.refreshList()
  };
  
  refreshList = () =>{

    //axios to send and receive HTTP requests from backend
    axios
    .get("http://localhost:8000/tasks/")
    .then(res => this.setState({ taskList: res.data }))
    .catch(err => console(err))
  };

  displayCompleted = staus => {
    if(staus){
      return this.setState({viewCompleted:true});
    }
    return this.setState({viewCompleted:false});
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
         onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>

        <span 
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}>
          Incompleted
        </span>
      </div>
    );
  };

  // rendering items in the list (completed || incompleted)
  renderItem = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      item => item.completed === viewCompleted
    );

    return newItems.map(item => (
      <li 
        key={item.id} 
        className='list-group-item d-flex justify-content-between align-items-center'>
        <span 
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}

        </span>

        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-info mr-2">
            Edit
          </button>

          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ));
  };

  toggle =() => {
    this.setState({modal: !this.state.modal});
  };

  handleSubmit = item =>{
    this.toggle()

    if(item.id){
      axios
      .put(`http://localhost:8000/tasks/${item.id}/`, item)
      .then(res => this.refreshList());
      return;
    }

    axios.post("http://localhost:8000/tasks/",item)
    .then(res => this.refreshList());
  };

  handleDelete = item =>{

    axios
      .delete(`http://localhost:8000/tasks/${item.id}/`)
      .then(res => this.refreshList());

    //alert("deleted" + JSON.stringify(item))
  };

  createItem = () => {
    const item = {title : "",description: "", completed: false};
    this.setState({activeItem:item, modal: !this.state.modal});
  };

  editItem = item => {
    this.setState({activeItem: item, modal: !this.state.modal});
  };


  render(){
    return(
      <main className='content'>
        <h1 className='text-white text-uppercase text-center my-4'>Tasks</h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <div>
                  <button onClick={ this.createItem } className="btn btn-warning">
                    Add Task
                  </button>
                </div>

                {this.renderTabList()}

                <ul className='list-group list-group-flush'>
                  {this.renderItem()}
                </ul>        
              </div>
            </div>
          </div>

          <footer className="my-5 mb-2 bg-info text-white text-center">
            copyright 2022 &copy;
          </footer>

          {this.state.modal ? (
            <Modal 
              activeItem={this.state.activeItem} 
              toggle={this.toggle}
              onSave={this.handleSubmit}/>
          ): null}
        </div>
      </main>
    );
  }

}

export default App;
