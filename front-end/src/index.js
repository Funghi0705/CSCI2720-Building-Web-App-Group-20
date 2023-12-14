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
    import React, { useState } from "react";
    import "./style.css";
    import "leaflet/dist/leaflet.css";
    import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
    import { Icon } from "leaflet";
    import {
      BrowserRouter,
      Routes,
      Route,
      Link,
      useParams,
      useLocation,
    } from 'react-router-dom';
    import Login from "./login.js"

    // Global Var for class Map
    const customIcon = new Icon({
      iconUrl: require("./icon.png"),
      iconSize: [38, 38] // size of the icon
    });
    
    // Since other part is not set up yet, testing variable are declared here
    let isAdmin = false;
    let username = "tester1";
    const event = [
      {eventId: 1, title: "event1", venue: "SHB", dateortime: "6/12/2023", description: "This is a testing event!", presenter:"Sam", price:100},
      {eventId: 2, title: "event2", venue: "LSB", dateortime: "6/12/2023", description: "testing event obviously", presenter:"Angus", price:50} 
    ]
    const loc = [
      {locId: 1, name:"SHB", noofevent: 1, latitude: 22.419780, longtitude: 114.205951},
      {locId: 2, name:"LSB", noofevent: 2, latitude: 22.418914, longtitude: 114.206923},
    ]
    const favloc = [
      {locId: 1, name:"SHB", noofevent: 1, latitude: 22.419780, longtitude: 114.205951}
    ]

    let lastUpdate = "6/12/2023 9:30";
    let loginState = true;

    class Logout extends React.Component {
      logout = () => {
        if (window.confirm("You are logging out. Are you sure?")) {
          this.props.onLogout();
        }
      }
    
      render() {
        return (
          <div>
            <div id="logout">
              <i>Welcome, {this.props.name}</i>
              <button type="button" id="logout" className="btn" onClick={this.logout}>
                Log out
              </button>
            </div>
          </div>
        );
      }
    }
    
    class App extends React.Component{
      
      // Declared all the variables as state so that we can change them 
      constructor(props) {
        super(props);
        this.state = {
          isAdmin: isAdmin,
          username: username,
          event: event,
          loc: loc,
          favloc: favloc,
          lastUpdate: lastUpdate,
          login: loginState,
        };
      }

      updateFavloc = (updatedFavloc) => {
        this.setState({ favloc: updatedFavloc });
      };

      handleLogout = () => {
        this.setState({ login: false });
      };

      render(){
        // Add a function to handle first load to retrieve xml here
    
        // Check if the event data is loaded
        if (this.state.login == false) {
          return <Login />
        }
        if (this.state.lastUpdate != null) {
          // Check if the user is admin or not
          if (this.state.isAdmin === true) {
            // Admin page
            console.log("login as admin");
            return {
              // Fred will do this part
            }
          } else {
            // User page
            console.log("login as user");
            return(
              <BrowserRouter>
                <Logout name={this.state.username} onLogout={this.handleLogout} />
                <Title />
                <div>
                  <nav>
                    <ul>
                      <Link to="/"><li>Home</li></Link>
                      <Link to="/loc"><li>Location</li></Link>
                      <Link to="/event"><li>Event</li></Link>
                      <Link to="/map"><li>Map</li></Link>
                      <Link to="/favour"><li>Favourite</li></Link>
                      <Link to="/backend"><li>Backend Testing</li></Link>
                    </ul>
                  </nav>
                </div>
    
                <Routes>
                  <Route path="/" element={<Home lastUpdate={this.state.lastUpdate}/>} />
                  <Route path="/loc" element={<Location data={this.state.loc}/>} />
                  <Route path="/map" element={<Map data={this.state.loc}/>} />
                  <Route path="/loc/:locId" element={<SingleLoc loc={this.state.loc} event={this.state.event} favloc={this.state.favloc} updateFavloc={this.updateFavloc} username={this.state.username}/>} />
                  <Route path="/favour" element={<Favour data={this.state.favloc} updateFavloc={this.updateFavloc}/>} />
                  <Route path="/event" element={<Event event={this.state.event} loc={this.state.loc}/>} />
                  <Route path="/backend" element={<Backend />} />
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
                  In Location, all locations are listed in table as links to single locations page.
                </p>
                <p>
                  In Event, you can see all the events information and search for events with specific range of price.
                </p>
                <p>
                  In Map, all locations are showed in map with links to single locations page.
                </p>
                <p>
                  In Favourite Location, you can see your favorite location list.
                </p>
                <p>
                  <sub><i>Source: Cultural Programmes from <a href="https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural"> DATA.GOV.HK</a></i></sub>
                  <br />
                  <sub>Last Updated Time: {this.props.lastUpdate}</sub>
                </p>
              </div>
            </div>
          </section>
        </>
        )
      }
    }
    
    // link to single location, allow sorting with number of event, search with keyword
    class Location extends React.Component {
    
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
          filteredLoc = this.props.data.filter((item) =>
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
          <div>
              <section>
                <div>
                  <label for="searchInput">Search with keyword: </label>
                  <input type="text" id="searchInput" placeholder="Enter keyword"/>
                  <input type="button" value="Search" onClick={this.handleSearch}/>
                </div>
                <hr/>
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
             </section>

              <section>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Location</th>
                      <th scope="col">No. of Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {output.map((file, index) => <TRL i={index} key={index} data={output} />)}
                  </tbody>
                </table>
              </section>
            </div>
        );
      }
    }

    // TRL: Table Row for Location, handle the dynamic content of the table 
    class TRL extends React.Component {
      render() {
        let i = this.props.i;
        let link = '/loc/' + this.props.data[i].locId;
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
      constructor(props) {
        super(props);
        this.state = {
          selectedMarker: null
        };
      }
    
      handleMarkerClick = (marker) => {
        this.setState({ selectedMarker: marker });
      };
    
      render() {
        const { selectedMarker } = this.state;
        return (
          <section id="maps">
          <div id="map">
            <MapContainer center={[this.props.data[0].latitude, this.props.data[0].longtitude]} zoom={17}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {this.props.data.map((marker) => (
                <Marker
                  key={marker.locId}
                  position={[marker.latitude, marker.longtitude]} 
                  icon={selectedMarker === marker ? customIcon : customIcon}
                  eventHandlers={{ click: () => this.handleMarkerClick(marker) }}
                >
                  <Popup><Link to={"/loc/" + marker.locId}>{marker.name}</Link></Popup> 
                </Marker>
              ))}
            </MapContainer>
          </div>
          </section>
        );
      }
    }

    class Singlemap extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          selectedMarker: null
        };
      }
    
      handleMarkerClick = (marker) => {
        this.setState({ selectedMarker: marker });
      };
    
      render() {
        const { selectedMarker } = this.state;
        return (

          <div id="singlemap">
            <MapContainer center={[this.props.data[0].latitude, this.props.data[0].longtitude]} zoom={17}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {this.props.data.map((marker) => (
                <Marker
                  key={marker.locId}
                  position={[marker.latitude, marker.longtitude]} 
                  icon={selectedMarker === marker ? customIcon : customIcon}
                  eventHandlers={{ click: () => this.handleMarkerClick(marker) }}
                >
                  <Popup><Link to={"/loc/" + marker.locId}>{marker.name}</Link></Popup> 
                </Marker>
              ))}
            </MapContainer>
          </div>

        );
      }
    }

    // list favourite location in table
    class Favour extends React.Component {
        
        render() {
          return(
            <section>
            <div class="container">
              <div class="row">
                <p>Your Favourite Location:</p>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Location</th>
                      <th scope="col">No. of Events</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.data.map((file, index) => <TRF i={index} key={index} data={this.props.data} updateFavloc={this.props.updateFavloc}/>)}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          )
          
        }
    }

    // TRF: Table Row for Favourite, handle the dynamic content of the table 
    class TRF extends React.Component {
      deleteRow = () => {
        const { i, data, updateFavloc } = this.props;
        const updatedFl = [...data];
        updatedFl.splice(i, 1);
        updateFavloc(updatedFl);
      };
    
      render() {
        let i = this.props.i;
        let link = '/loc/' + this.props.data[i].locId;
        return (
          <tr>
            <td>
              <Link to={link}> {this.props.data[i].name}</Link>
            </td>
            <td>{this.props.data[i].noofevent}</td>
            <td>
              <button className="btn btn-danger btn-xs" onClick={this.deleteRow}>
                Remove
              </button>
            </td>
          </tr>
        );
      }
    }
    
    // Single location page, containing map show loc, loc details, user comments (can add)
    function SingleLoc(props) {
      const { locId } = useParams();
      const selectedLocation = props.loc.find(
        (location) => location.locId === parseInt(locId)
      );
      const filteredEvents = props.event.filter(
        (event) => event.venue === selectedLocation.name
      );
    
      // Check if the location is the user's favourite location, and allow user's to add/remove it to/from the favourite location
      const isFavorite = props.favloc.some(
        (favLocation) => favLocation.locId === selectedLocation.locId
      );

      const toggleFavorite = () => {
        if (isFavorite) {
          const updatedFavloc = props.favloc.filter(
            (favLocation) => favLocation.locId !== selectedLocation.locId
          );
          props.updateFavloc(updatedFavloc);
        } else {
          const newFavloc = [...props.favloc, selectedLocation];
          props.updateFavloc(newFavloc);
        }
        console.log(props.favloc);
      };
    
      const [comment, setComment] = useState("");
      const [comments, setComments] = useState([]);
    
      const handleCommentChange = (event) => {
        setComment(event.target.value);
      };
    
      const addComment = () => {
        if (comment.trim() !== "") {
          const newComment = {
            id: comments.length + 1,
            username: props.username,
            comment: comment.trim()
          };
    
          setComments((prevComments) => [...prevComments, newComment]);
          setComment(""); // Clear the comment input field after adding the comment
        }
      };
    
      return (
        <section>
          <div className="container">
            <div className="row">
              <div className="d-flex align-items-center">
                <h2>{selectedLocation.name}</h2>
                <button
                  type="button"
                  className="btn btn-link heart-button"
                  onClick={toggleFavorite}
                >
                  {isFavorite ? (
                    <i className="bi bi-heart-fill" style={{ color: 'red' }}></i>
                  ) : (
                    <i className="bi bi-heart" style={{ color: 'black' }}></i>
                  )}
                </button>
              </div>
              <p>No. of Events: {selectedLocation.noofevent}</p>
              <Singlemap data={[selectedLocation]} />
              {/* Event Details */}
              <h2>Event holding:</h2>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Venue</th>
                    <th scope="col">Date/Time</th>
                    <th scope="col">Description</th>
                    <th scope="col">Presenter</th>
                    <th scope="col">Price (HK$)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => (
                    <TRS key={index} event={event} />
                  ))}
                </tbody>
              </table>
    
              {/* User Comments */}
              <h3>Comments:</h3>
              <div id="comment">
                <div id="comment_container">
                  <div id="comments">
                  <h5>1155158054@link.cuhk.edu.hk</h5>
                    <p>CSCI2720 is Good!</p>
                    {comments.map((comment) => (
                       <div key={comment.id} id={`c${comment.id}`} className="d-flex">
                        <div className="flex-shrink-0"></div>
                        <div className="flex-grow-1">
                        <h5>{comment.username}</h5>
                        <p>{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h6>Add your comment:</h6>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="new-comment" className="form-label">
                        Comment
                      </label>
                      <textarea
                        className="form-control"
                        id="new-comment"
                        rows="3"
                        required
                        value={comment}
                        onChange={handleCommentChange}
                      ></textarea>
                      <div className="invalid-feedback">
                        Please enter your comment.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addComment}
                    >
                      Add comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // TRS: Table Row for Single location, handle the dynamic content of the table
    class TRS extends React.Component {
      render() {
        const { event } = this.props;
    
        return (
          <tr>
            <td>{event.title}</td>
            <td>{event.venue}</td>
            <td>{event.dateortime}</td>
            <td>{event.description}</td>
            <td>{event.presenter}</td>
            <td>{event.price}</td>
          </tr>
        );
      }
    }
    
    // Show events whose price under a specific no.
    class Event extends React.Component {
    
      constructor(props) {
        super(props);
    
        // sliderValue records the slider value
        // output records the events with price that fulfill users' requirement 
        this.state = {
          sliderValue: 0,
          output: [],
        };
      }

      // Find the min and max price of events exist
      findMinMaxPrice = (event) => {
        let minPrice = Infinity;
        let maxPrice = -Infinity;
      
        for (let i = 0; i < event.length; i++) {
          const currentPrice = event[i].price;
          if (currentPrice < minPrice) {
            minPrice = currentPrice;
          }
          if (currentPrice > maxPrice) {
            maxPrice = currentPrice;
          }
        }
      
        return {
          minPrice: minPrice,
          maxPrice: maxPrice
        };
      }

      handleSliderChange = (event) => {
        const sliderValue = parseInt(event.target.value);
        this.setState({ sliderValue });
      };

      filterData = () => {
        const { event } = this.props;
        const { sliderValue } = this.state;
      
        // Filter the event array based on the sliderValue state
        const filteredEvent = event.filter(event => event.price <= sliderValue);
      
        // Update the output state with the filtered array
        this.setState({ output: filteredEvent });
      };

      componentDidMount() {
        const { event } = this.props;
        const { minPrice, maxPrice } = this.findMinMaxPrice(event);
      
        // Set initial slider value and update state
        const sliderValue = maxPrice;
        this.setState({ sliderValue });
      
        this.filterData();
      }

      componentDidUpdate(prevProps, prevState) {
        if (
          prevState.sliderValue !== this.state.sliderValue
        ) {
          this.filterData();
        }
      }

      render() {
        const { event } = this.props;
        const { output, sliderValue } = this.state;
        return (
          <section>
            <div class="container">
              <div class="row">
                <div class="slidecontainer">
                  <label for="myRange">Filter by Price: </label>
                  <input
                    type="range"
                    min={this.findMinMaxPrice(event).minPrice}
                    max={this.findMinMaxPrice(event).maxPrice}
                    value={sliderValue}
                    className="slider"
                    id="myRange"
                    onChange={this.handleSliderChange}
                  />
                  <p>&le; <span id="demo">{"HK$"+sliderValue}</span></p>
                </div>
                <br />
                <br />
                <hr />
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Event</th> 
                      <th scope="col">Venue</th>
                      <th scope="col">Date/Time</th>
                      <th scope="col">Description</th>
                      <th scope="col">Presenter</th>
                      <th scope="col">Price (HK$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {output.map((file, index) => <TRE i={index} key={index} event={output} loc={this.props.loc}/>)}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      }
    }

    // TRE: Table Row for Events, handle the dynamic content of the table 
    class TRE extends React.Component {
      getLocId = (venue) => {
        const { loc } = this.props;
        for (let i = 0; i < loc.length; i++) {
          if (loc[i].name === venue) {
            return loc[i].locId;
          }
        }
        return null;
      };
    
      render() {
        const i = this.props.i;
        const venue = this.props.event[i].venue;
        const locId = this.getLocId(venue);
        const link = locId ? `/loc/${locId}` : '';
    
        return (
          <tr>
            <td>{this.props.event[i].title}</td>
            <td><Link to={link}>{this.props.event[i].venue}</Link></td>
            <td>{this.props.event[i].dateortime}</td>
            <td>{this.props.event[i].description}</td>
            <td>{this.props.event[i].presenter}</td>
            <td>{this.props.event[i].price}</td>
          </tr>
        );
      }
    }
    
    class Title extends React.Component {
      render() {
          return (
              <header>
                  
              </header>
          );
      }
    }

    // The backend team use it for testing
    class Backend extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          output: ''
        };
      }

      render() {
        async function handleSubmit(event) {
          event.preventDefault();
          const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;
            const isAdmin = document.querySelector('#isAdmin').checked;
            const data = {
              username: username,
              password: password,
              isAdmin: isAdmin
            };
  
            const response = await fetch('http://localhost:3000/account/create', {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
  
            this.setState({output: response});
        };

        return (
          <div>
            <form id="createDocument" onSubmit={handleSubmit}>
              <label for="username">User Name:</label>
              <input type="text" id="username" name='username' />
              <br />
              <label for="password">Password:</label>
              <input type="text" id="password" name='password' />
              <br />
              <label for="isAdmin">Login as admin?</label>
              <input type="checkbox" id="isAdmin" name='isAdmin' />
              <br />
              <input type="submit" value="Submit"/>
            </form>

            <div>
              <p>Here is the output:</p>
              <pre id='output'>{this.state.output}</pre>
            </div>
          </div>
        );
      }
    }
    
    const root = ReactDOM.createRoot(document.querySelector("#app"));
    root.render( <App />);
