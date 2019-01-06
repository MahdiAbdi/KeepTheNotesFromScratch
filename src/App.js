import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    const config = {
      apiKey: "AIzaSyB3GYcRcn40zuiUOL9oEiXC2pE7RWBPX8U",
      authDomain: "keepthenotes-bf133.firebaseapp.com",
      databaseURL: "https://keepthenotes-bf133.firebaseio.com",
      projectId: "keepthenotes-bf133",
      storageBucket: "keepthenotes-bf133.appspot.com",
      messagingSenderId: "682012368542"
    };

    firebase.initializeApp(config);

    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });

    (async function getNotes() {
      const notes = await db.collection("notes").get();

      notes.docs.map(note => console.log(note.data()));
    })();
  }

  autoSave(e) {
    this.setState({ content: e.target.value });
    const db = firebase.firestore();
    db.collection('notes').add({
      content: this.state.content,
      author: 'Mahdi',
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <textarea value={this.state.content} onChange={this.autoSave.bind(this)} />
      </div>
    );
  }
}

export default App;
