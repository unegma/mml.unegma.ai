import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";

import {blobToBase64, createResponse} from "@unegma/mml-lib-frontend";
import {MMLApiResponse} from "@unegma/mml-types";
import Input from "@mui/material/Input";


const ENDPOINT = `${
  process.env.REACT_APP_APP_ENV === 'production'
    ? process.env.REACT_APP_API_ENDPOINT
    : process.env.REACT_APP_API_ENDPOINT_STAGING
}`;


export default function HomeScreen({toggleLeftSideDrawer}: {toggleLeftSideDrawer: any}) {

  const [done, setDone] = React.useState<boolean>(false);
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [story, setStory] = React.useState<any>({"story": ''});
  const [defaultStory, setDefaultStory] = React.useState<any>("A Jungle in the Amazon Rainforest");
  const [options, setOptions] = React.useState<string[]>([]);
  const [conversation, setConversation] = useState<any>([]);
  const [personality, setPersonality] = useState<string>('moody');
  const [choiceOne, setChoiceOne] = React.useState<string>("");
  const [choiceTwo, setChoiceTwo] = React.useState<string>("");

  /**
   *
   */
  const handleExample = async (input: any) => {

    // todo maybe wrap this in a try block

    if (processing) {
      alert('Please wait for the current recording to finish processing');
      return;
    }
    setDone(false);
    setProcessing(true);


    setConversation([...conversation, {"role": "assistant", "content": story.story}, {"role": "user", "content": input}]);

    // todo something here is causing lots of errors (it isn't do do with the library it seems, because can import and use other methods from utilities and frontend utils)

    // Please note that this method will increase the size of your payload by approximately 33%, as base64 encoding is not space-efficient. If your audio files are large, you may run into issues with payload size limits.
    // const base64Audio = await blobToBase64(blob);
    // console.log('audio',base64Audio);

    // todo check SA2Response type data is the only data on the response
    const responseData: MMLApiResponse = await createResponse(
      ENDPOINT,
      '',
      conversation,
      personality
    );
    console.log('response data:', responseData);

    // @ts-ignore
    // setAudioBuffer(responseData.barboyResponseAudio.data); // todo handle if this is null
    // setSpeaking(true);
    // setAudioURI(responseData.message);

    function parseJsonIfNeeded(data: any): any {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (error) {
          // If error, return the original data
          // Assuming the string is not a valid JSON, hence return as is.
          console.error('Parsing error:', error);
          return data;
        }
      }
      // If data is not a string, return as is
      return data;
    }
    const newStory = parseJsonIfNeeded(responseData);


    console.log(newStory)

    setStory(newStory.story);
    setChoiceOne(newStory.choices[0]['1'])
    setChoiceTwo(newStory.choices[0]['2'])

    // setTranscription(responseData.transcription);
    // setBarboyResponse(responseData.barboyResponse);

    setProcessing(false);
    setDone(true);
  };

  useEffect(() => {
    handleExample(defaultStory)
  }, []);

  return (
    <>
      <div className="home-screen-cover" onClick={(event:any) => {toggleLeftSideDrawer(event)}}>
        <div className="home-screen-button-container">
          <p className="home-screen-title">Welcome to your own story about.. <Input defaultValue={defaultStory} /></p>
          {/*<p className="home-screen-text">Click the Menu at the<br/>top left to get started.</p>*/}
          <div style={{margin:'20px'}}>
            <TextField
              style={{width:'100%', marginBottom:'20px'}}
              placeholder=""
              multiline
              rows={20}
              value={story}
            />
            <br/>
            <div style={{display:'flex'}}>
              <Button onClick={() => {handleExample(choiceOne)}} style={{flex:'1 0 0', marginRight:'10px'}} variant="contained" color="primary" >{choiceOne}</Button>
              <Button onClick={() => {handleExample(choiceTwo)}} style={{flex:'1 0 0'}} variant="contained" color="primary">{choiceTwo}</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
