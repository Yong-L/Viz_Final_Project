import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Form,
  Input,
  Button
} from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2010,
      modal: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.clearChild = this.clearChild.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleClick(item) {
    if (item.datum === undefined) {
      this.clearChild();
      return;
    }

    const state = item.datum.id;
    const state_pop = item.datum.Population;
    const state_name = item.datum.Name;

    const spec = `/api/bar/${this.state.year}/${state}`;

    this.setState(
      {
        modal: true,
        state_pop: state_pop,
        state_name: state_name
      },
      () => {
        window.vegaEmbed("#charts", spec).then(() => {
          const element = document.getElementById("charts");
          element.scrollIntoView({ behavior: "smooth" });
        });
      }
    );
  }

  clearChild() {
    this.setState({
      state_pop: null,
      state_name: null
    });
    const node = document.getElementById("charts");
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  handleSubmit(event) {
    this.clearChild();

    const spec = `/api/map/${this.state.year}`;

    const handleClick = this.handleClick;

    window
      .vegaEmbed("#map", spec)
      .then(result => {
        const view = result.view;
        view.addEventListener("click", function(_, item) {
          handleClick(item);
        });
      })
      .catch(console.error);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">US Census</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Form onSubmit={this.handleSubmit}>
                <Input
                  value={this.state.year}
                  onChange={this.handleChange}
                  type="select"
                  name="year"
                >
                  <option value="2010">2010</option>
                  <option value="2011">2011</option>
                  <option value="2012">2012</option>
                  <option value="2013">2013</option>
                  <option value="2014">2014</option>
                  <option value="2015">2015</option>
                  <option value="2016">2016</option>
                  <option value="2017">2017</option>
                </Input>
              </Form>
            </NavItem>
            <NavItem>
              <Button onClick={this.handleSubmit} outline color="success">
                Submit
              </Button>
            </NavItem>
          </Nav>
        </Navbar>
        <div id="map" />
        <div id="charts" />
      </div>
    );
  }
}

export default App;
