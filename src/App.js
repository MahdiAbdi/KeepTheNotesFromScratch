import React, { Component } from "react";
import firebase from "firebase";
import "firebase/firestore";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import "./fonts/fira_code.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docId: null,
      note: "",
      token: null,
      user: null,
      error: null,
      anchorEl: null,
      open: false,
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
    console.log(this.provider);
    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        const db = firebase.firestore();
        db.settings({ timestampsInSnapshots: true });
        db.collection("notes")
          .where("author", "==", user.email)
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

  logout = () => {
    const auth = firebase.auth();
    auth.signOut();
  };

  login = () => {
    const auth = firebase.auth();
    auth
      .signInWithPopup(this.provider)
      .then(result => {
        this.handleClose();
      })
      .catch(error => {});
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });};

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, user } = this.state;
    const isSignedIn = Boolean(user);
    const open = Boolean(anchorEl);
    console.log(isSignedIn, user);
    const theme = createMuiTheme({
      typography: {
        fontFamily: "Fira Code"
      }
    });
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                ToNote
              </Typography>
              <div>
                {isSignedIn ? (
                  <div
                    style={{
                      width: "110%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      color="inherit"
                      style={{ display: "inline-block" }}
                      variant="body2"
                      className={classes.grow}
                    >
                      {user.displayName}
                    </Typography>
                    <Avatar
                      style={{ display: "inline-block" }}
                      onClick={this.handleMenu}
                      alt="Remy Sharp"
                      src={user.photoURL}
                      className={classes.avatar}
                    />
                  </div>
                ) : (
                  <div>
                    <Typography
                      color="inherit"
                      style={{ display: "inline-block" }}
                      variant="body2"
                      className={classes.grow}
                    >
                      Login -->
                    </Typography>
                    <IconButton
                      aria-owns={open ? "menu-appbar" : undefined}
                      aria-haspopup="true"
                      onClick={this.login.bind(this)}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </div>
                )}
              </div>
              {
              isSignedIn && (
              <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={this.state.open}
                  onClose={this.handleClose}
              >
                <MenuItem onClick={this.logout.bind(this)}>
                  SignOut
                </MenuItem>
              </Menu>
              )}
            </Toolbar>
          </AppBar>
          {isSignedIn ? (
            <TextField
              id="outlined-multiline-flexible"
              multiline
              rows={40}
              value={this.state.note}
              onChange={this.autoSave.bind(this)}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
          ) : null}
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = theme =>
  createStyles({
    root: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    textField: {
      width: "100%",
      height: "100%",
      fontFamily: "Comic Sans MS !important"
    }
  });

export default withStyles(styles)(App);
