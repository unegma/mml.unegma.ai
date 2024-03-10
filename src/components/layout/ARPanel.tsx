import React, {useEffect, useState} from "react";
import useSceneInteractions from "../../hooks/useSceneInteractions";
import {useAudioRecorder} from "react-audio-voice-recorder";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import RecordingButton from "../various/RecordingButton";
import {MMLApiResponse} from "@unegma/mml-types";
import {blobToBase64, createResponse} from "@unegma/mml-lib-frontend";
import AutoAudioPlayer from "./AudioPlayer/AutoAudioPlayer";

const ENDPOINT = `${
  process.env.REACT_APP_APP_ENV === 'production'
    ? process.env.REACT_APP_API_ENDPOINT
    : process.env.REACT_APP_API_ENDPOINT_STAGING
}`;


export default function ARPanel({showBookingModal, personality, speaking, setSpeaking, scene, furnitureItem, setFurnitureItem, setOverrideNativeEvent, movable, setMovable}: any) {
  const {
    setPresenting, presenting, masterScale, setMasterScale, xPos, setXPos, yPos, setYPos, zPos, setZPos, consoleMessage
  } = useSceneInteractions();

  const [panelShowing, setPanelShowing] = useState(true);


  const increaseScale = () => {
    setMasterScale(Number((masterScale + (masterScale * 0.1)).toFixed(3))); // todo check that changing this from 2 to 3 doesn't cause issues
  }
  //  todo move to reducer?
  const decreaseScale = () => {
    setMasterScale(Number((masterScale - (masterScale * 0.1)).toFixed(3))); // todo check that changing this from 2 to 3 doesn't cause issues
  }
  const moveUp = () => {
    setYPos(yPos+1);
  }
  const moveDown = () => {
    setYPos(yPos-1);
  }
  const moveAway = () => {
    setZPos(zPos-1);
  }

  const [browser, setBrowser] = useState('other');

  const [recording, setRecording] = useState<any>(null);
  const [blob, setBlob] = useState<any>(null);
  const addAudioElement = (blob: any) => {
    console.log('done');
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    console.log(audio);
    setRecording(audio.src);
    setBlob(blob);
  };

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder({noiseSuppression: true, echoCancellation: true});


  useEffect(() => {
    if (!recordingBlob) return;
    console.log('recording blob', recordingBlob);
    addAudioElement(recordingBlob);
  }, [recordingBlob]);

  const INITIAL_PROMPT = "Hello there, can I get you anything?";

  const [audioURI, setAudioURI] = useState<any>(null!);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [transcription, setTranscription] = useState<any>(null!);
  const [barboyResponse, setBarboyResponse] = useState<any>(INITIAL_PROMPT);
  const [conversation, setConversation] = useState<any>([{"role": "assistant", "content": INITIAL_PROMPT}]);
  const [audioBuffer, setAudioBuffer] = useState<any>(null!);

  useEffect(() => {
    if (showBookingModal === false) {
      fetch(`${process.env.REACT_APP_ASSETS_URL + '/initial.wav'}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.arrayBuffer();
        })
        .then(buffer => {
          setAudioBuffer(buffer);
        })
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
          setAudioBuffer(null);
        });
      setSpeaking(true);
    }
  }, [showBookingModal])

  useEffect(() => {
    console.log('here0')
    console.log(audioBuffer)
    if (audioBuffer !== null) { //  todo might need this: && audioBuffer.length > 0
      console.log('here1')
      // Convert the numerical buffer array into a Uint8Array
      const uint8Array = new Uint8Array(audioBuffer);

      // Create a blob from the Uint8Array
      const blob = new Blob([uint8Array], { type: 'audio/wav' });

      // Create an object URL from the blob
      const url = URL.createObjectURL(blob);

      // Create a new Audio object and play it
      const audio = new Audio(url);
      audio.play().catch(error => console.error('Error playing the audio:', error));

      // Revoke the object URL to free up resources, after the audio starts playing
      audio.oncanplaythrough = () => URL.revokeObjectURL(url);
      console.log('here2')
    }
  }, [audioBuffer]);


  /**
   *
   */
  const handleExample = async () => {

    // todo maybe wrap this in a try block

    if (processing) {
      alert('Please wait for the current recording to finish processing');
      return;
    }
    setDone(false);
    setProcessing(true);


    // todo something here is causing lots of errors (it isn't do do with the library it seems, because can import and use other methods from utilities and frontend utils)

    // Please note that this method will increase the size of your payload by approximately 33%, as base64 encoding is not space-efficient. If your audio files are large, you may run into issues with payload size limits.
    const base64Audio = await blobToBase64(blob);
    console.log('audio',base64Audio);

    // todo check SA2Response type data is the only data on the response
    // const responseData: MMLApiResponse = await createResponse(
    //   ENDPOINT,
    //   '',
    //   base64Audio,
    //   '',
    //   browser,
    //   conversation,
    //   personality
    // );
    // console.log('response data:', responseData);
    //
    // // @ts-ignore
    // setAudioBuffer(responseData.barboyResponseAudio.data); // todo handle if this is null
    // setSpeaking(true);
    // setAudioURI(responseData.message);
    //
    // //@ts-ignore
    // setConversation(JSON.parse(responseData.conversation));
    // setTranscription(responseData.transcription);
    // setBarboyResponse(responseData.barboyResponse);

    setProcessing(false);
    setDone(true);
  };

  const reRecordAudio = () => {
    setDone(false);
    setRecording(null);
    startRecording();
  };

  return (
    <>
      <div className="dialog">
        {/*todo add buttons for playing the audio*/}
        <p>{transcription}</p>
        <p>{barboyResponse}</p>
      </div>

      {/*<AutoAudioPlayer audioBuffer={audioBuffer} />*/}

      <div className="recording-button">
        {browser === 'safari' && (
          <RecordingButton
            processing={processing}
            isRecording={isRecording}
            recordingTime={recordingTime}
            startRecording={startRecording}
            stopRecording={stopRecording}
            recordingBlob={recordingBlob}
            reRecordAudio={reRecordAudio}
            addAudioElement={addAudioElement}
            handleExample={handleExample}
            done={done}
          />
        )}
        {browser === 'other' && (
          <RecordingButton
            processing={processing}
            isRecording={isRecording}
            reRecordAudio={reRecordAudio}
            recordingTime={recordingTime}
            startRecording={startRecording}
            stopRecording={stopRecording}
            recordingBlob={recordingBlob}
            addAudioElement={addAudioElement}
            handleExample={handleExample}
            done={done}
          />
        )}
        {browser === 'firefox' && (
          <RecordingButton
            processing={processing}
            isRecording={isRecording}
            reRecordAudio={reRecordAudio}
            recordingTime={recordingTime}
            startRecording={startRecording}
            stopRecording={stopRecording}
            recordingBlob={recordingBlob}
            addAudioElement={addAudioElement}
            handleExample={handleExample}
            done={done}
          />
        )}

        {/*{!isRecording && recordingBlob && (*/}
        {/*  <div className="pt-5 xs:pt-9">*/}
        {/*    <p className="text-center text-base font-normal leading-snug tracking-tight pb-4">*/}
        {/*      Listen to your recording*/}
        {/*    </p>*/}

        {/*    <AudioPlayer recording={recording} />*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>

      {/*{ presenting && panelShowing && (*/}
      {/*  <p className="xrOverlay">*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);setPanelShowing(false); setMovable(false)}} className="xrOverlay__close">Close</span>*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);setMovable(!movable)}} className="xrOverlay__close">Movable</span>*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);increaseScale()}} className="xrOverlay__plus">+ 10%</span>*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);decreaseScale()}} className="xrOverlay__minus">- 10%</span>*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);moveUp()}} className="xrOverlay__plus">up+1</span>*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);moveDown()}} className="xrOverlay__minus">down+1</span>*/}
      {/*    <span onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);moveAway()}} className="xrOverlay__minus">away+1</span>*/}
      {/*    <span className="xrOverlay__scale">{masterScale}</span>*/}
      {/*    <span className="xrOverlay__scale">Console: {consoleMessage}</span>*/}

      {/*    { scene === 'furniture' && (*/}
      {/*      <span className="xrOverlay__plus" onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);setFurnitureItemHandler(furnitureItem)}}>{furnitureItem}</span>*/}
      {/*    )}*/}
      {/*    { scene === 'japanesefurniture' && (*/}
      {/*      <span className="xrOverlay__plus" onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);setJapaneseFurnitureItemHandler(furnitureItem)}}>{furnitureItem}</span>*/}
      {/*    )}*/}
      {/*    { scene === 'survivalfurniture' && (*/}
      {/*      <span className="xrOverlay__plus" onClick={(event:any) => {console.log('xrOverlay',event);setOverrideNativeEvent(true);setSurvivalFurnitureItemHandler(furnitureItem)}}>{furnitureItem}</span>*/}
      {/*    )}*/}
      {/*  </p>*/}
      {/*)}*/}
    </>
  )
}
