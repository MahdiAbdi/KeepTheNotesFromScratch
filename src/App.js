import React, { Component } from "react";
import firebase from "firebase";
import "firebase/firestore";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docId: null,
      note: "",
      token: null,
      user: null,
      error: null
    };
  }

  provider = null;

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

    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        const db = firebase.firestore();
        db.settings({ timestampsInSnapshots: true });
        db.collection("notes")
          .where("author", "==", this.state.user.email)
          .onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
              if (change.type === "added") {
                this.setState({ docId: change.doc.id });
              } else if (change.type === "removed") {
                this.setState({ note: "" });
              }
              this.setState({ note: change.doc.data().content });
            });
          });
      } else {
        this.setState({
          docId: null,
          note: "",
          token: null,
          user: null,
          error: null
        });
      }
    });
  }

  autoSave(e) {
    const db = firebase.firestore();
    if (this.state.docId) {
      db.collection("notes")
        .doc(this.state.docId)
        .update({ content: e.target.value });
    } else {
      db.collection("notes").add({
        author: this.state.user.email,
        content: e.target.value
      });
    }
  }

  auth(e) {
    const auth = firebase.auth();
    if (this.state.user) {
      auth.signOut();
    } else {
      auth
        .signInWithPopup(this.provider)
        .then(result => {})
        .catch(error => {});
    }
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.auth.bind(this)}>
          {this.state.user ? `Hi ${this.state.user.email}! Log Out` : "Log In"}
        </button>
        {this.state.user ? (
          <textarea
            value={this.state.note}
            onChange={this.autoSave.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
