import React from "react";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";

export default function HomeScreen({toggleLeftSideDrawer}: {toggleLeftSideDrawer: any}) {

  return (
    <>
      <div className="home-screen-cover" onClick={(event:any) => {toggleLeftSideDrawer(event)}}>
        <div className="home-screen-button-container">
          <p className="home-screen-title">Welcome to the best story of your life</p>
          {/*<p className="home-screen-text">Click the Menu at the<br/>top left to get started.</p>*/}
          <div style={{margin:'20px'}}>
            <TextField
              style={{width:'100%', marginBottom:'20px'}}
              placeholder=""
              multiline
              rows={20}
            />
            <br/>
            <div style={{display:'flex'}}>
              <Button style={{flex:'1 0 0', marginRight:'10px'}} variant="contained" color="primary" onClick={(event) => {toggleLeftSideDrawer(event)}}>Option 1</Button>
              <Button style={{flex:'1 0 0'}} variant="contained" color="primary" onClick={(event) => {toggleLeftSideDrawer(event)}}>Option 2</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
