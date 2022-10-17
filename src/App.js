import React, {useRef} from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import {drawKeypoints, drawSkeleton} from './utilities';

function App() {
	const webCamRef = useRef(null);
	const canvasRef = useRef(null);

	const runPoseNet = async()=>{
		const net = await posenet.load({
			inputResolution:{width:720, height:480},
			scale: 0.5
		})
		console.log("loaded");
		setInterval(()=>{
			detect(net)
		}, 100)
	}

	const detect = async (net)=>{
		if(typeof webCamRef.current !== "undefined" && webCamRef.current !== null && webCamRef.current.video.readyState === 4){

			const video = webCamRef.current.video
			const videoWidth = webCamRef.current.video.videoWidth;
			const videoHeight = webCamRef.current.video.videoHeight;

			webCamRef.current.video.width = videoWidth;
			webCamRef.current.video.height = videoHeight;;
			
			const pose = await net.estimateSinglePose(video);
			console.log(pose);

			drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
		}
	}

	const drawCanvas = (pose, video, videoWidth, videoHeight, canvas)=> {
		const ctx = canvas.current.getContext("2d");
		canvas.current.width = videoWidth;
		canvas.current.height = videoHeight;

		drawKeypoints(pose["keypoints"], 0.5, ctx);
		drawSkeleton(pose["keypoints"],0.5, ctx);
	}

	runPoseNet();
  return (
    <div className="App">
		<Webcam style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: 0, right: 0, textAlign: "center", zIndex: 9, width: 720, height: 480}} ref={webCamRef}/>
		<canvas style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: 0, right: 0, textAlign: "center", zIndex: 9, width: 720, height: 480}} ref={canvasRef}/>
    </div>
  );
}

export default App;
