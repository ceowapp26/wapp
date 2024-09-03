import React, { useState, useEffect } from 'react';
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import styled from "@emotion/styled";
import { Mic, MicOff, Check, X, Trash2 } from 'lucide-react';

const SpeechRecorderWrapper = styled(NodeViewWrapper)`
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RecorderControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const RecordButton = styled.button<{ recording: boolean }>`
  background-color: ${props => props.recording ? '#dc3545' : '#28a745'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RecorderLegend = styled.span`
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 8px;
  display: block;
  text-align: center;
`;

const TranscriptActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ConfirmButton = styled(ActionButton)`
  background-color: #28a745;
  color: white;
  border: none;

  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled(ActionButton)`
  background-color: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;

  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #dc3545;
  }
`;

const TranscriptContent = styled(NodeViewContent)`
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
  min-height: 60px;
  border: 1px solid #ced4da;
`;

const SpeechToTextNode = ({editor, deleteNode}) => {
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.");
    } else {
      const {webkitSpeechRecognition} = window;
      const newRecognition = new webkitSpeechRecognition();

      newRecognition.continuous = true;
      newRecognition.interimResults = true;

      newRecognition.onstart = () => setRecording(true);
      newRecognition.onend = () => setRecording(false);
      newRecognition.onresult = (event) => {
        const res = Array.from(event.results).map(result => result[0].transcript);
        setTranscript(res);
      };
      newRecognition.onerror = (event) => setError(`Error occurred in recognition: ${event.error}`);

      setRecognition(newRecognition);
    }
  }, []);

  const toggleRecording = (e) => {
    e.preventDefault();
    if (recording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const resetRecorder = (e) => {
    e.preventDefault();
    recognition.stop();
    setTranscript([]);
  };

  const confirmTranscript = (e) => {
    e.preventDefault();
    recognition.stop();
    editor
      .chain()
      .focus()
      .toggleNode('paragraph', 'paragraph', {})
      .insertContent(transcript.join(' '))
      .run();
  };

  return (
    <SpeechRecorderWrapper>
      {editor.isEditable && (
        <DeleteButton onClick={deleteNode}>
          <Trash2 size={18} />
        </DeleteButton>
      )}

      <RecorderControls>
        <RecordButton recording={recording} onClick={toggleRecording}>
          {recording ? <MicOff size={24} /> : <Mic size={24} />}
        </RecordButton>
      </RecorderControls>
      
      <RecorderLegend>
        {recording ? "Listening..." : "Click to start dictation"}
      </RecorderLegend>

      {error && <p style={{color: '#dc3545', textAlign: 'center', marginTop: '8px'}}>{error}</p>}

      {transcript.length > 0 && (
        <>
          <TranscriptContent>{transcript.join(' ')}</TranscriptContent>
          <TranscriptActions>
            <ConfirmButton onClick={confirmTranscript}>
              <Check size={16} style={{marginRight: '4px'}} /> Confirm
            </ConfirmButton>
            <CancelButton onClick={resetRecorder}>
              <X size={16} style={{marginRight: '4px'}} /> Cancel
            </CancelButton>
          </TranscriptActions>
        </>
      )}
    </SpeechRecorderWrapper>
  );
};

const SpeechToTextNodeOptions = {
  name: "SpeechToTextNode",
  tag: "speech-to-text-node",
  component: SpeechToTextNode,
  atom: true,
  widget_options: {
    displayOnInlineTooltip: true,
    insertion: "insertion",
    insert_block: "SpeechToTextNode",
  },
  options: {},
  attributes: {},
};

export { SpeechToTextNode, SpeechToTextNodeOptions };