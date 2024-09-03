import React, { useRef, useState, useEffect, Component } from "react";
import ReactMediaRecorder from "./MediaRecorder";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useCountdownTimer } from "use-countdown-timer";
import { getUrl } from "../blockUtils";
import axios from "axios";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, StopCircle, Check, X, Upload, Trash2 } from 'lucide-react';

const VideoContainer = styled(motion.div)`
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  margin: 2rem 0;
`;

const VideoBody = styled.div`
  padding: 1.5rem;
`;

const EditorControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: ${props => props.primary ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.primary ? '#ffffff' : '#374151'};
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? '#2563eb' : '#d1d5db'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RecButton = styled(Button)`
  background-color: ${props => props.recording ? '#ef4444' : '#10b981'};
  color: #ffffff;

  &:hover:not(:disabled) {
    background-color: ${props => props.recording ? '#dc2626' : '#059669'};
  }
`;

const VideoPlayer = styled.video`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatusBar = styled(motion.div)`
  background-color: #e5e7eb;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  color: #374151;
  border-radius: 8px 8px 0 0;
`;

const Caption = styled(NodeViewContent)`
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.2s;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

function VideoRecorderNode(props) {
  let app = React.useRef();
  let mediaRecorder = React.useRef();
  let video = React.useRef();

  const [granted, setGranted] = React.useState(false);
  const [rejectedReason, setRejectedReason] = React.useState("");
  const [fileReady, setFileReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(null);
  const [file, setFile] = React.useState(null);

  const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
    timer: props.extension.options.seconds_to_record,
    onExpire: () => {
      mediaRecorder.current && mediaRecorder.current.stop();
    },
  });

  React.useEffect(() => {
    if (props.node.attrs.url) {
      setUrlToVideo(props.node.attrs.url);
      playMode();
    }
  }, []);

  React.useEffect(() => {
    if (!props.node.attrs.url || props.node.attrs.url === "") return;
    video.current.src = props.node.attrs.url;
  }, [props.node.attrs.url]);

  function handleGranted() {
    setGranted(true);
    console.log("Permission Granted!");
  }

  function handleDenied(err) {
    setRejectedReason(err.name);
    console.log("Permission Denied!", err);
  }

  function handleStart(stream) {
    setFileReady(false);
    setStreamToVideo(stream);
    console.log("Recording Started.");
    if (!props.extension.options.seconds_to_record) return;
    start();
  }

  function handleStop(blob) {
    reset();
    setFileReady(true);
    releaseStreamFromVideo();
    console.log("Recording Stopped.");
    setFile(blob);
    setStreamToVideo(blob);
    playMode();
  }

  function confirm() {
    downloadVideo(file);
  }

  function handlePause() {
    releaseStreamFromVideo();
    pause();
  }

  function handleResume(stream) {
    setStreamToVideo(stream);
    pause();
  }

  function handleError(err) {
    console.log(err);
  }

  function recordMode() {
    video.current.loop = false;
    video.current.controls = false;
    video.current.muted = true;
  }

  function playMode() {
    video.current.loop = false;
    video.current.controls = true;
    video.current.muted = true;
  }

  function setStreamToVideo(stream) {
    recordMode(video);
    try {
      video.current.srcObject = stream;
    } catch (error) {
      video.current.src = URL.createObjectURL(stream);
    }
  }

  function setUrlToVideo(url) {
    playMode();
    video.current.src = url;
  }

  function releaseStreamFromVideo() {
    video.current.src = "";
    video.current.srcObject = null;
  }

  function downloadVideo(blob) {
    setStreamToVideo(blob);
    playMode();
    uploadFile(blob);
  }

  function formatData() {
    let formData = new FormData();
    if (file) {
      let formName = props.extension.options.upload_formName || "file";
      formData.append(formName, file);
      return formData;
    } else {
      formData.append("url", props.node.attrs.src);
      return formData;
    }
  }

  function getUploadUrl() {
    let url = props.extension.options.upload_url;
    if (typeof url === "function") {
      return url();
    } else {
      return url;
    }
  }

  function getUploadHeaders() {
    return props.extension.options.upload_headers || {};
  }

  function stopLoader() {
    setLoading(false);
    setFileReady(false);
  }

  function uploadFile(blob) {
    setFile(blob);

    if (props.extension.options.upload_handler) {
      return props.extension.options.upload_handler(
        formatData(blob).get("file"),
        props,
        { uploadCompleted, updateProgressBar, uploadFailed }
      );
    }

    if (!props.extension.options.upload_url) {
      stopLoader();
      return;
    }

    setLoading(true);

    axios({
      method: "post",
      url: getUploadUrl(),
      headers: getUploadHeaders(),
      data: formatData(),
      onUploadProgress: (e) => {
        return updateProgressBar(e);
      },
    })
      .then((result) => {
        uploadCompleted(result.data.url);

        if (props.extension.options.upload_callback) {
          return props.extension.options.upload_callback(result, this);
        }
      })
      .catch((error) => {
        uploadFailed();
        console.log(`ERROR: got error uploading file ${error}`);
        if (props.extension.options.upload_error_callback) {
          return props.extension.options.upload_error_callback(error, this);
        }
      });

    return (json_response) => {
      return uploadCompleted(json_response.url);
    };
  }

  function uploadFailed() {
    stopLoader();
  }

  function uploadCompleted(url) {
    props.updateAttributes({
      url: url,
    });
    stopLoader();
    setFile(null);
    setUrlToVideo(url);
  }

  function updateProgressBar(e) {
    let complete = loadingProgress;
    if (e.lengthComputable) {
      complete = (e.loaded / e.total) * 100;
      complete = complete != null ? complete : { complete: 0 };

      setLoadingProgress(complete);

      return console.log(`complete: ${complete}`);
    }
  }

  function isReadOnly() {
    return !props.editor.isEditable;
  }

  function placeHolderEnabled() {
    return "placeholder";
  }

  function placeholderText() {
    return (
      props.extension.options.image_caption_placeholder ||
      "caption here (optional)"
    );
  }

  function defaultPlaceholder() {
    return "default placeholder";
  }
  
  return (
    <NodeViewWrapper>
      <VideoContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ReactMediaRecorder
          ref={mediaRecorder}
          constraints={{
            audio: {
              sampleSize: 16,
              channelCount: 2,
              echoCancellation: true,
              noiseSuppression: false,
            },
            video: true,
          }}
          timeSlice={10}
          onGranted={handleGranted}
          onDenied={handleDenied}
          onStart={(stream) => handleStart(stream)}
          onStop={handleStop}
          onPause={handlePause}
          onResume={handleResume}
          onError={handleError}
          render={({ start, stop, pause, resume }) => (
            <div>
              <AnimatePresence>
                {loading && (
                  <StatusBar
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Loader toggle={loading} progress={loadingProgress} />
                  </StatusBar>
                )}
              </AnimatePresence>

              <VideoBody>
                {!isReadOnly() && (
                  <EditorControls>
                    <AnimatePresence mode="wait">
                      {!loading && (
                        <motion.div
                          key="controls"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <RecButton
                            onClick={(e) => {
                              e.preventDefault();
                              isRunning ? stop() : start();
                            }}
                            disabled={isRunning}
                            recording={isRunning}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isRunning ? (
                              <>
                                <StopCircle size={18} className="mr-2" />
                                {Math.floor(countdown / 1000)}s left
                              </>
                            ) : (
                              <>
                                <Mic size={18} className="mr-2" />
                                Record
                              </>
                            )}
                          </RecButton>
                        </motion.div>
                      )}
                      {fileReady && !loading && (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Button
                            primary
                            onClick={confirm}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Upload size={18} className="mr-2" />
                            Upload
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </EditorControls>
                )}

                <VideoPlayer autoPlay muted ref={video} />

                <Caption>
                  {props.node.content.size === 0 && (
                    <span className="text-gray-400">
                      Type a caption (optional)
                    </span>
                  )}
                </Caption>
              </VideoBody>
            </div>
          )}
        />
      </VideoContainer>
    </NodeViewWrapper>
  );
}

function Loader({ toggle, progress }) {
  return (
    <AnimatePresence>
      {toggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center"
        >
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <span className="text-sm font-medium">
            {progress === 100 ? "Processing..." : `${Math.round(progress)}%`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const VideoRecorderOptions = {
  name: "VideoRecorderNode",
  tag: "video-recorder-node",
  component: VideoRecorderNode,
  atom: false,
  attributes: {
    url: { default: null },
    src: { default: null },
    width: { default: "" },
    height: { default: "" },
    loading: { default: false },
    loading_progress: { default: 0 },
    caption: { default: null },
    direction: { default: "center" },
    file: { default: null },
  },

  wrapper_class: "graf graf--video",
  selected_class: "is-selected",
  selectedFn: (_block) => {},
  /* handleEnterWithoutText(ctx, block) {
  const { editorState } = ctx.state
  return ctx.onChange(addNewBlockAt(editorState, block.getKey()))
},
handleEnterWithText(ctx, block) {
  const { editorState } = ctx.state
  return ctx.onChange(RichUtils.insertSoftNewline(editorState))
  //return ctx.onChange(addNewBlockAt(editorState, block.getKey()))
}, */
  widget_options: {
    displayOnInlineTooltip: true,
    insertion: "insertion",
    insert_block: "image",
  },
  options: {
    upload_formName: "file",

    upload_handler: (file, ctx) => {
      console.log("UPLOADED FILE", file, ctx)
    },
    
    /*upload_handler: (file, props, { uploadCompleted }) => {
      console.log("UPLOADED video");
      const url =
        "https://video.twimg.com/ext_tw_video/1388976569348235264/pu/vid/960x720/mCVk3dF_nGTgIZLX.mp4?tag=12";
      uploadCompleted(url);
    },*/
    seconds_to_record: 10000,
  },
};

export { VideoRecorderNode, VideoRecorderOptions };




