/** I declare that the lab work here submitted is original
    except for source material explicitly acknowledged,
    and that the same or closely related material has not been
    previously submitted for another course.
    I also acknowledge that I am aware of University policy and
    regulations on honesty in academic work, and of the disciplinary
    guidelines and procedures applicable to breaches of such
    policy and regulations, as contained in the website.

    University Guideline on Academic Honesty:
    https://www.cuhk.edu.hk/policy/academichonesty/
    
    Student Name : LUI, Chak Sum; LIU, Angus Chak Hei; CHEUNG, Hop Cheung; Liu Xianlong; Zheng Cun Hao
    Student ID : 1155158054; 1155159671; 1155191857; 1155191419; 1155144508
    Class/Section : CSCI2720
    Date : 6/12/2023 */

import ReactDOM from 'react-dom/client';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useLocation,
} from 'react-router-dom';

// Since other part is not set up yet, testing variable are declared here
let isAdmin = false;
let username = "tester1";
const event = [
  {eventId: 1, title: "event1", venue: 1, dateortime: "6/12/2023", description: "This is a testing event!", presenter:"Sam", price:100},
  {eventId: 2, title: "event2", venue: 2, dateortime: "6/12/2023", description: "testing event obviously", presenter:"Angus", price:50} 
]
const loc = [
  {locId: 1, name:"SHB", noofevent: 1, latitude: 22.419780, longtitude: 114.205951},
  {locId: 2, name:"LSB", noofevent: 2, latitude: 22.418914, longtitude: 114.206923},
]
const favloc = [
  {locId: 1, name:"SHB", noofevent: 1, latitude: 22.419780, longtitude: 114.205951}
]
let lastUpdate = "6/12/2023 9:30";

class App extends React.Component{

  render(){
    // Add a function to handle first load to retrieve xml here

    // Check if the event data is loaded
    if (lastUpdate != null) {
      // Check if the user is admin or not
      if (isAdmin === true) {
        // Admin page

      } else {
        // User page
        console.log("login in as user");
        return(
          <BrowserRouter>
            {/* log out option needed here */}
            <Title name={username}/>  {/* Need to set it to top right */} 
            <div>
              <nav>
                <ul>
                  <Link to="/"><li>Home</li></Link>
                  <Link to="/table"><li>Table</li></Link>
                  <Link to="/map"><li>Map</li></Link>
                  <Link to="/favour"><li>Favourite Locations</li></Link>
                  <Link to="/event"><li>Event</li></Link>
                </ul>
              </nav>
            </div>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/table" element={<Table data={loc}/>} />
              <Route path="/map" element={<Map data={loc}/>} />
              <Route path="/loc/:locId" element={<Location loc={loc} event={event}/>} />
              <Route path="/favour" element={<Favour data={favloc}/>} />
              <Route path="/event" element={<Event data={event}/>} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </BrowserRouter>
        )
      }
    }
  }
}

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

class Home extends React.Component {
  render() {
    return (
      <>
      <section>
        <div class="container">
          <div class="row">
            <h3>Welcome to the Cultural Programmes Collection Website <i class="bi bi-calendar-check"></i></h3>
            <p>
              In our website, we collected some cultural programmes that host in 10 venues. You can check the event title, venue, date/time, description, presenter, price here.
            </p>
            <p>
              In Table, all locations are listed in table as links to single locations page.
            </p>
            <p>
              In Map, all locations are showed in map with links to single locations page.
            </p>
            <p>
              In Favourite Locations, you can see your favorite location list.
            </p>
            <p>
              In Event, you can search for events with specific range of price.
            </p>
            <p>
              <i>Source: Cultural Programmes from <a href="https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural"> DATA.GOV.HK</a></i>
              <br />
              <sub>Last Updated Time: {lastUpdate}</sub>
            </p>
          </div>
        </div>
      </section>
    </>
    )
  }
}

// link to single location, allow sorting with number of event, search with keyword
class Table extends React.Component {

  constructor(props) {
    super(props);

    // sortevent records users' sorting option
    // searchloc records users' searching keyword
    // output records the location name with number of events that fulfill users' requirement 
    this.state = {
      sortevent: "nosort",
      searchloc: "",
      output: [],
    };
  }

  // When user click search button, store the input into searchloc
  handleSearch = () => {
    const inputValue = document.getElementById('searchInput').value;
    this.setState({ searchloc: inputValue });
  };

  // When user click sort radio, store the sorting option into sortevent
  handleSort = (event) => {
    const selectedSortChoice = event.target.value;
    this.setState({ sortevent: selectedSortChoice });
  };

  filterAndSortData = () => {
    let filteredLoc = this.props.data;
  
    // Filter the loc array based on the searchloc substring if it is not empty
    if (this.state.searchloc.trim() !== '') {
      filteredLoc = loc.filter((item) =>
        item.name.toLowerCase().includes(this.state.searchloc.toLowerCase())
      );
    }
  
    let sortedLoc = filteredLoc;
  
    // Sort the filteredLoc array based on the sortevent value if it is not "nosort"
    if (this.state.sortevent === 'ascending') {
      sortedLoc.sort((a, b) => a.noofevent - b.noofevent);
    } else if (this.state.sortevent === 'descending') {
      sortedLoc.sort((a, b) => b.noofevent - a.noofevent);
    }
  
    // Update the output state with the filtered and sorted array
    this.setState({ output: sortedLoc });
  };

  componentDidMount() {
    this.filterAndSortData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchloc !== this.state.searchloc ||
      prevState.sortevent !== this.state.sortevent
    ) {
      this.filterAndSortData();
    }
  }

  render() {
    const { output, sortevent } = this.state;
    return (
      <section>
        <div class="container">
          <div class="row">
            <div>
              <label for="searchInput">Search with keyword: </label>
              <input type="text" id="searchInput" placeholder="Enter keyword"/>
              <input type="button" value="Search" onClick={this.handleSearch}/>
            </div>
            <br />
            <br />
            <hr />
            <fieldset>
              <legend>Sort by number of events:</legend>
              <div>
                <input
                  type="radio"
                  id="nosorting"
                  name="sorting"
                  value="nosort"
                  onChange={this.handleSort}
                  checked={this.state.sortevent === 'nosort'}
                />
                <label htmlFor="nosorting">No sorting</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="ascending"
                  name="sorting"
                  value="ascending"
                  onChange={this.handleSort}
                  checked={this.state.sortevent === 'ascending'}
                />
                <label htmlFor="ascending">Ascending</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="descending"
                  name="sorting"
                  value="descending"
                  onChange={this.handleSort}
                  checked={this.state.sortevent === 'descending'}
                />
                <label htmlFor="descending">Descending</label>
              </div>
            </fieldset>
            <table>
              <thead>
                <tr>
                  <th scope="col">Location</th>
                  <th scope="col">No. of Events</th>
                </tr>
              </thead>
              <tbody>
                {output.map((file, index) => <TR i={index} key={index} data={output} />)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }
}

// TR: Table Row, handle the dynamic content of the table 
class TR extends React.Component {
  render() {
    let i = this.props.i;
    let link = '/locationpage/' + this.props.data[i].locId;
    return (
      <tr>
        <td>
          <Link to={link}> {this.props.data[i].name}</Link>
        </td>
        <td>{this.props.data[i].noofevent}</td>
      </tr>
    );
  }
}

// link to each single location, use API e.g. Google Maps
class Map extends React.Component {
    render() {
        return (
            <section>
            <div className="container">
              <div className="row">
                
              </div>
            </div>
          </section>
        );
    }
}

// list favourite location in table
class Favour extends React.Component {
    
    render() {
      return(
        <section>
        <div className="container">
          <div className="row">
            <h3>Your Favourite Locations:</h3>
            <Table data={this.props.data} />
          </div>
        </div>
        </section>
      )
      
    }
}

// Single location page, containing map show loc, loc details, user comments (can add)
class Location extends React.Component {
  render() {
      return (
        <section>
        <div className="container">
          <div className="row">
            
          </div>
        </div>
        </section>
      );
  }
}

// Show events whose price under a specific no.
class Event extends React.Component {
  render() {
      return (
        <section>
        <div className="container">
          <div className="row">
            
          </div>
        </div>
        </section>
      );
  }
}

class Title extends React.Component {
  render() {
      return (
          <header>
              <h1 className="display-4 text-center">{this.props.name}</h1>
          </header>
      );
  }
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render( <App />);