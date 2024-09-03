import React, { useState } from 'react';
import CheckIcon from '@/icons/CheckIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import MicIcon from '@/icons/MicIcon';
import { NodeViewWrapper } from "@tiptap/react";
import styled from "@emotion/styled";
import { getUrl } from "../utils/blockUtils";
import { ReactNodeViewRenderer } from '@tiptap/react';
import { nodeInputRule } from '@tiptap/core';
import { motion } from 'framer-motion';

const StyleWrapper = styled(NodeViewWrapper)`
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
`;

const AudioRecorderNode = (props: any) => {
  //const { blockProps, block } = props;
  const [stored, setStored] = useState(props.node.attrs.stored);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(props.node.attrs.url);
  const [loading_progress, setLoadingProgress] = useState(0);

  const stream = React.useRef(null);
  const mediaRecorder = React.useRef<any>(null);
  const audioElement = React.useRef(null);

  const config = props.config;

  //const audioUrl = props.node.attrs.url
  //let file = blockProps.data.get('file');

  let file = props.node.attrs.file //|| props.node.attrs.src;

  const [count, setCount] = useState(0);

  const countTotal = 120;

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (count !== 0) setCount(count - 1);
      if (count === 0) stopRecording();
    }, 1000);

    return () => interval && clearInterval(interval);
  }, [count]);

  React.useEffect(() => {
    if(props.node.attrs?.url) setAudioUrl(props.node.attrs.url)
  }, [props?.node?.attrs?.url]);

  const startRecording = () => {
    setStored(false);
    setAudioUrl(false);
  
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((userStream: any) => {
        stream.current = userStream;
        mediaRecorder.current = new MediaRecorder(userStream);
        const chunks : any = [];
  
        mediaRecorder.current.start();
  
        mediaRecorder.current.addEventListener('dataavailable', (event: any) => {
          chunks.push(event.data);
        });
  
        mediaRecorder.current.addEventListener('stop', () => {
          const audioBlob = new Blob(chunks, { type: 'audio/mp4' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        });

        setRecording(true);
        setCount(countTotal);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopRecording = () => {
    if (!mediaRecorder?.current) return;
    if (mediaRecorder?.current.state === 'inactive') return;
    mediaRecorder.current.stop();
    // @ts-ignore
    stream?.current?.getTracks()?.forEach((track) => track.stop()); // stop each of them
    stream.current = null;
    setRecording(false);
    setCount(0);
  };

  function uploadRecording(e: any) {
    uploadFile(audioUrl);
  }

  function cancelRecording() {
    setAudioUrl(null);
    setRecording(false);
    setCount(0);
  }

  /** upload functions */

  // will update block state
  const updateData = (options?: any) => {
    //const { getEditorState } = blockProps;
    //const { setEditorState } = blockProps;
    //const data = block.getData();
    const state = {
      url: audioUrl,
      stored: true,
    };
    //const newData = data.merge(state).merge(options);
    //return setEditorState(updateDataOfBlock(getEditorState(), block, newData));
  };

  function stopLoader() {
    /*return this.setState({
      loading: false,
      fileReady: false,
    });*/
  }

  const uploadFile = async (blob: any) => {
    file = await fetch(blob).then((r) => r.blob());

    if(!file.name) file.name = "audio"

    const construct = {
      uploadCompleted: uploadCompleted,
      file: file,
      props: props,
      stored: true,
    };

    setStored(true);

    // custom upload handler
    if (props.extension.options.upload_handler) {
      return props.extension.options.upload_handler(
        file,
        props
      );
    }

    if (!props.extension.options.upload_url) {
      stopLoader();
      return;
    }
  };

  function uploadFailed() {
    // props.blockProps.removeLock();
    stopLoader();
  }

  function uploadCompleted(url: any, cb: any) {
    setAudioUrl(url);
    updateData({ url: url });
    // blockProps.removeLock();
    stopLoader();
    file = null;
    setUrlToAudio(url);
    cb && cb();
  }

  function updateProgressBar(e: any) {
    let complete = loading_progress as any;
    if (e.lengthComputable) {
      complete = (e.loaded / e.total) * 100;
      complete = complete != null ? complete : { complete: 0 };
      setLoadingProgress(complete);
      return console.log(`complete: ${complete}`);
    }
  }

  function setUrlToAudio(url: any) {
    //this.playMode();

    // @ts-ignore
    audioElement.current.src = url;
  }

  return (
    <StyleWrapper selected={props.selected} as="figure" data-drag-handle="true">
      <div className="flex flex-col items-center space-y-4" contentEditable={false}>
        {!audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-2"
          >
            <Button
              onClick={!recording ? startRecording : stopRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={recording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}
            >
              {recording ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Recording
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Start Recording
                </>
              )}
            </Button>
            {count !== 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600"
              >
                Recording will finish in <strong className="font-bold">{count} seconds</strong>
              </motion.span>
            )}
          </motion.div>
        )}

        {audioUrl && stored && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Audio Ready</span>
          </motion.div>
        )}

        {audioUrl && !stored && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-4"
          >
            <Button
              onClick={uploadRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Confirm
            </Button>
            <Button
              onClick={cancelRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </Button>
          </motion.div>
        )}

        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
          >
            <audio src={audioUrl} controls ref={audioElement} className="w-full" />
          </motion.div>
        )}
      </div>
    </StyleWrapper>
  );
};

const AudioRecorderNodeOptions = {
  name: "AudioRecorderNode",
  tag: "audio-recorder-node",
  component: AudioRecorderNode,
  atom: false,
  draggable: true,
  widget_options: {
    displayOnInlineTooltip: true,
    insertion: 'insertion',
    insert_block: 'AudioRecorderNode',
  },
  options: {
    seconds_to_record: 120,
    upload_handler: (file: any, ctx: any) => {
      console.log("UPLOADED FILE", file);
    },
  },
  attributes: {
    url: { default: null }
  },
};

export { AudioRecorderNode, AudioRecorderNodeOptions }

