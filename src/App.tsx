import React, {useEffect, useState} from 'react';
import {
  Route, Routes, useLocation
} from "react-router-dom";
import './App.scss';
import NavBar from "./components/layout/NavBar";
import InfoModal from "./components/layout/InfoModal";
import RelicOne from "./components/pages/RelicOne";
import RightSideDrawer from "./components/layout/RightSideDrawer";
import useSceneInteractions from "./hooks/useSceneInteractions";
import BarScene from "./components/3d/BarScene";
import BookingModal from "./components/BookingModal/BookingModal";
import HomeScreen from "./components/pages/HomeScreen";

function App() {
  const [showImages, setShowImages] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [personality, setPersonality] = useState('moody');

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerRightOpen, setDrawerRightOpen] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [sliderOn, setSliderOn] = React.useState(false);

  // TODO these aren't goint to get updated when route changes if the url is loaded directly
  const [infoTitle, setInfoTitle] = React.useState('The Title');
  const [infoText, setInfoText] = React.useState('The Description');


  const [zPos, setZPos] = React.useState(0);
  const [yPos, setYPos] = React.useState(0);

  const [speaking, setSpeaking] = useState(false);

  const location = useLocation();

  const [movable, setMovable] = React.useState(true); // todo move to scene interactions
  const [overrideNativeEvent,setOverrideNativeEvent] = React.useState(false); // this is to block the click on the screen when clicking the overlay

  const {
    masterScale, setMasterScale, // TODO IDEALLY WANT 0.15
    setConsoleMessage, setPlayerPosition, playerPosition, presenting, setPresenting
  } = useSceneInteractions();

  useEffect(() => {
    setTimeout(() => {
      if (location.pathname === '/') {
        setDrawerOpen(true);
      }
    }, 1000);
  }, [])


  const toggleLeftSideDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event.type === 'keydown' && (
        (event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift'))
      {
        return;
      }
      setDrawerOpen(!drawerOpen);
  };

  const toggleSlider = () => {
    setSliderOn(!sliderOn);
  };

  const toggleRightSideDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event.type === 'keydown' && (
        (event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift'))
      {
        return;
      }
    setDrawerRightOpen(!drawerRightOpen);
  };

  return (
    <div className="App">
      {/*<CssBaseline /> todo add this? */}

      {!presenting && (
        <NavBar toggleLeftSideDrawer={toggleLeftSideDrawer} showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal} />
      )}

      <InfoModal showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal} />
      <BookingModal personality={personality} setPersonality={setPersonality} showBookingModal={showBookingModal} setShowBookingModal={setShowBookingModal} />


      <RightSideDrawer
        infoOpen={infoOpen}
        toggleRightSideDrawer={toggleRightSideDrawer}
        infoTitle={infoTitle}
        infoText={infoText}
        drawerRightOpen={drawerRightOpen}
        setDrawerRightOpen={setDrawerRightOpen}
      />

      <Routes>
        <Route
          key={'home'}
          path="/"
          element={
            <HomeScreen toggleLeftSideDrawer={toggleLeftSideDrawer} />
          }
        />

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>

      <div className="buttons-container">

        <div className="pointer" onClick={(event) => {toggleRightSideDrawer(event)}}>

        </div>
      </div>
    </div>
  );
}

export default App;
