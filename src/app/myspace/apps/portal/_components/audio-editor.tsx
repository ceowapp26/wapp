import React, { useState, useMemo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from "next-themes";
import * as Select from '@radix-ui/react-select';
import { useMediaQuery } from "usehooks-ts";
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Button, Textarea, Avatar, Tooltip, Popover, PopoverTrigger, PopoverContent, Card, CardBody, Slider, Switch, Divider } from '@nextui-org/react';
import { Play, Pause, Download, Trash2, Mic, XCircle, Globe2, Volume2, Settings, SlidersHorizontal, X, AudioWaveform } from 'lucide-react';
import ChatAvatar from './chat-avatar';
import axios from 'axios';

const SelectWrapper = ({ children, value, onValueChange, icon, placeholder }) => {
  const { theme } = useTheme();

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={`inline-flex truncate w-full max-w-64 mr-2 items-center justify-start md:justify-between rounded px-4 py-2 text-sm leading-none gap-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
        } border`}
      >
        {icon}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '96px' }}>
            <Select.Value />
          </span>
        <Select.Icon className="text-gray-500">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={`overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
          } border`}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">{children}</Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-500">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      {...props}
      ref={forwardedRef}
      className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 font-medium focus:bg-blue-100 dark:focus:bg-blue-900 cursor-pointer"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

const AudioEditor = ({ chatHistory, layout }) => {
  const { theme } = useTheme();
  const isMediumScreen = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  const [audioChatHistory, setAudioChatHistory] = useState([]);
  const [generatedAudios, setGeneratedAudios] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [voice, setVoice] = useState('');
  const [language, setLanguage] = useState('');
  const [speed, setSpeed] = useState(1);
  const [voices, setVoices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  
  const speedOptions = Array.from({ length: 16 }, (_, i) => (i + 5) / 10);

  useEffect(() => {
    setAudioChatHistory(chatHistory.map(message => ({
      ...message,
      id: uuidv4(), 
      voice: voice || '',
      speed: speed || 1,
      language: language || ''
    })));
  }, [chatHistory, voice, language, speed]);
  
  useEffect(() => {
    const fetchVoicesAndLanguages = async () => {
      try {
        const response = await axios.get('/api/get_speech_data');
        const formattedVoices = response.data.voices.map(voice => ({
          name: voice.name,
          languageCodes: voice.languageCodes,
          avatar: getRandomAvatar(voice.ssmlGender),
        }));
        setVoices(formattedVoices);
        setLanguages(response.data.languages);
        if (formattedVoices.length > 0) {
          const defaultVoice = formattedVoices[0];
          setVoice(defaultVoice.name);
          setAvailableLanguages(defaultVoice.languageCodes);
          if (defaultVoice.languageCodes.length > 0) {
            setLanguage(defaultVoice.languageCodes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch voices and languages:', err.response?.data || err);
      }
    };
    if (voices.length === 0) {
      fetchVoicesAndLanguages();
    }
  }, []);

  const handleAppendMessage = () => {
    if (prompt) {
      setAudioChatHistory(prev => [...prev, { 
        id: uuidv4(), 
        content: prompt, 
        role: 'user', 
        context: '', 
        voice, 
        language, 
        speed 
      }]);
      setPrompt('');
    }
  };

  const handleGenerate = async (message) => {
    try {
      const response = await axios.post('/api/generate_audio', {
        text: message.content,
        voice: message.voice,
        language: message.language,
        speed: message.speed,
      });
      setGeneratedAudios(prev => [...prev, { ...message, id: Date.now(), audioUrl: response.data.audioUrl }]);
    } catch (err) {
      console.error('Failed to generate audio:', err);
      setGeneratedAudios(prev => [...prev, { 
        ...message, 
        id: Date.now(), 
        error: 'Failed to generate audio. Please try again later.'
      }]);
    }
  };

  const handleGenerateAll = async () => {
    for (const message of audioChatHistory) {
      await handleGenerate(message);
    }
  };

  const handleClearAll = () => {
    setAudioChatHistory([]);
    setGeneratedAudios([]);
  };

  const handleDownloadAll = () => {
    generatedAudios.forEach(audio => {
      const link = document.createElement('a');
      link.href = audio.audioUrl;
      link.download = `audio_${audio.id}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleApplyAll = () => {
    setAudioChatHistory(prev => prev.map(message => ({
      ...message,
      voice,
      language,
      speed
    })));
  };

  const handleMessageUpdate = (id, field, value) => {
    setAudioChatHistory(prev => prev.map(message => 
      message.id === id ? { ...message, [field]: value } : message
    ));
  };

  const isPromptValid = (text) => {
    return text.trim().split(/\s+/).length <= 255;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAppendMessage();
    }
  };

  const handleAdvancedSettingsChange = (newSettings) => {
    console.log('Advanced settings changed:', newSettings);
  };

  const handleVoiceChange = (e) => {
    const newVoice = e.currentKey;
    setVoice(newVoice);
    const selectedVoice = voices.find(v => v.name === newVoice);
    if (selectedVoice) {
      setAvailableLanguages(selectedVoice.languageCodes);
      if (!selectedVoice.languageCodes.includes(language)) {
        setLanguage(selectedVoice.languageCodes[0]);
      }
    }
  };

  const startContent = useMemo(
    () => (
      <div>
        {prompt && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="cancel"
            className="absolute right-2 top-2 flex items-center justify-center rounded-full w-6 h-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            onClick={() => setPrompt('')}
            type="button"
          >
            <XCircle className="w-4 h-4 text-gray-800 dark:text-gray-200 cursor-pointer" />
          </motion.button>
        )}
        <div className="absolute right-2 bottom-2 flex items-center">
          <span className={`text-xs ${isPromptValid(prompt) ? 'text-gray-400' : 'text-red-500'}`}>
            {prompt.trim().split(/\s+/).length}/255
          </span>
        </div>
      </div>
    ),
    [prompt]
  );

  return (
    <div className={`w-full mx-auto p-4 space-y-8 ${layout === 'one-column' || isMediumScreen ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} ${isSmallScreen ? '' : 'space-y-0 space-x-4'} items-center overflow-x-auto`}>
        <SelectWrapper
          value={voice}
          onValueChange={(newVoice) => handleVoiceChange({ currentKey: newVoice })}
          icon={<Volume2 className="mr-2" />}
          placeholder="Select Voice"
          className={`${isSmallScreen ? 'w-full' : 'w-1/4'}`}
        >
          {voices.map((voiceOption) => (
            <SelectItem key={voiceOption.name} value={voiceOption.name}>
              <div className="flex items-center space-x-2">
                <Avatar src={voiceOption.avatar} size="sm" />
                <span>{voiceOption.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectWrapper>

        <SelectWrapper
          value={language}
          onValueChange={setLanguage}
          icon={<Globe2 className="mr-2" />}
          placeholder="Select Language"
          className={`${isSmallScreen ? 'w-full' : 'w-1/4'}`}
        >
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              <div className="flex items-center space-x-2">
                <Avatar src={`https://flagcdn.com/${getCountryCode(lang)}.svg`} size="sm" />
                <span>{lang}</span>
              </div>
            </SelectItem>
          ))}
        </SelectWrapper>

        <SelectWrapper
          value={speed.toString()}
          onValueChange={(newSpeed) => setSpeed(parseFloat(newSpeed))}
          icon={<AudioWaveform className="mr-2" />}
          placeholder="Select Speed"
          className={`${isSmallScreen ? 'w-full' : 'w-1/4'}`}
        >
          {speedOptions.map((speedOption) => (
            <SelectItem key={speedOption} value={speedOption.toString()}>
              {speedOption}x
            </SelectItem>
          ))}
        </SelectWrapper>

        <Button auto onClick={handleApplyAll} color="secondary" className={`${isSmallScreen ? 'w-full' : 'w-1/4'}`}>
          Apply All
        </Button>
      </div>

      <Textarea
        variant="bordered"
        placeholder="Insert message"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        required
        error={!isPromptValid(prompt) && prompt !== ''}
        helperText={!isPromptValid(prompt) && prompt !== '' ? `Prompt exceeds 255 words limit` : ''}
        startContent={startContent}
        className="min-h-[100px]"
      />

      <div className={`grid ${layout === 'two-column' || isMediumScreen ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence>
            {audioChatHistory.map((message) => (
              <MessageContainer
                key={message.id}
                message={message}
                voices={voices}
                availableLanguages={availableLanguages}
                speedOptions={speedOptions}
                onGenerate={() => handleGenerate(message)}
                onRemove={() => setAudioChatHistory(prev => prev.filter(m => m.id !== message.id))}
                onVoiceChange={(newVoice) => handleMessageUpdate(message.id, 'voice', newVoice)}
                onLanguageChange={(newLanguage) => handleMessageUpdate(message.id, 'language', newLanguage)}
                onSpeedChange={(newSpeed) => handleMessageUpdate(message.id, 'speed', newSpeed)}
              />
            ))}
          </AnimatePresence>
          <Button auto onClick={handleClearAll} color="error" className="w-full">
            Clear All Messages
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between mb-4 gap-4 truncate">
            <Button auto onClick={handleGenerateAll} color="primary">
              <Mic className="mr-2" />
              Generate All
            </Button>
            <AdvancedSettings onSettingsChange={handleAdvancedSettingsChange} layout={layout} className={`${isSmallScreen || layout === "one-column" ? 'w-full max-w-56' : 'w-1/3'}`} />
          </div>
          <AnimatePresence>
            {generatedAudios.map((audio) => (
              <GeneratedAudioContainer key={audio.id} audio={audio} setGeneratedAudios={setGeneratedAudios} />
            ))}
            {generatedAudios.length > 0 &&
              <Button auto onClick={handleDownloadAll} color="success">
                <Download className="mr-2" />
                Download All
              </Button>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MessageContainer = ({ message, onGenerate, onRemove, voices, availableLanguages, speedOptions, onVoiceChange, onLanguageChange, onSpeedChange, isSmallScreen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 z-[99]"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">             
          <ChatAvatar role={message.role} className="w-8 h-8 flex-shrink-0" />
          <span className="font-semibold capitalize dark:text-white">{message.role}</span>
        </div>
        <Button className="dark:text-white" auto onClick={onRemove} color="error" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className={`grid ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-3'} gap-4 mb-4 overflow-x-auto`}>
        <SelectWrapper
          value={message.voice}
          onValueChange={onVoiceChange}
          icon={<Volume2 className="mr-2" />}
          placeholder="Select Voice"
        >
          {voices.map((voiceOption) => (
            <SelectItem key={voiceOption.name} value={voiceOption.name}>
              <div className="flex items-center space-x-2">
                <Avatar src={voiceOption.avatar} size="sm" />
                <span>{voiceOption.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectWrapper>

        <SelectWrapper
          value={message.language}
          onValueChange={onLanguageChange}
          icon={<Globe2 className="mr-2" />}
          placeholder="Select Language"
        >
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              <div className="flex items-center space-x-2">
                <Avatar src={`https://flagcdn.com/${getCountryCode(lang)}.svg`} size="sm" />
                <span>{lang}</span>
              </div>
            </SelectItem>
          ))}
        </SelectWrapper>

        <SelectWrapper
          value={message.speed.toString()}
          onValueChange={(newSpeed) => onSpeedChange(parseFloat(newSpeed))}
          icon={<AudioWaveform className="mr-2" />}
          placeholder="Select Speed"
        >
          {speedOptions.map((speedOption) => (
            <SelectItem key={speedOption} value={speedOption.toString()}>
              {speedOption}x
            </SelectItem>
          ))}
        </SelectWrapper>
      </div>

      <div className="mt-2 dark:text-gray-100">
        <p>{message.content}</p>
      </div>

      <Button auto onClick={onGenerate} color="primary" className="w-full mt-4">
        <Mic className="mr-2" />
        Generate Audio
      </Button>
    </motion.div>
  );
};

const GeneratedAudioContainer = ({ audio, setGeneratedAudios, isSmallScreen }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDelete = () => {
    setGeneratedAudios(prev => prev.filter(a => a.id !== audio.id));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audio.audioUrl;
    link.download = `audio_${audio.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold w-full truncate">{audio.voice}</span>
         {audio.error ? (
          <p className="text-red-500">{audio.error}</p>
        ) : (
          <div className={`flex items-center ${isSmallScreen ? 'flex-col' : 'flex-row'} ${isSmallScreen ? '' : 'space-x-2'} p-4`}>
            <Tooltip content={isPlaying ? "Pause" : "Play"}>
              <Button auto onClick={handlePlayPause} color="primary" size="sm">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </Tooltip>
            <Tooltip content="Download">
              <Button auto onClick={handleDownload} color="secondary" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete">
              <Button auto onClick={handleDelete} color="error" size="sm" isIconOnly>
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>          
          </div>
        )}
      </div>
      {!audio.error && (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">{audio.language}, {audio.speed}x speed</p>
          <audio ref={audioRef} src={audio.audioUrl} onEnded={() => setIsPlaying(false)} />
        </>
      )}
    </motion.div>
  );
};

const AdvancedSettings = ({ onSettingsChange, className, layout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    pitch: 0,
    volumeGain: 0,
    sampleRate: 24000,
    useNeuralVoice: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button 
          className={`w-full ${className}`} 
          auto 
          color="secondary" 
        >
          <SlidersHorizontal className="mr-2" />
          Advanced Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Card css={{ maxWidth: '330px', padding: '$sm' }}>
          <CardBody>
            <h4 className="text-lg font-semibold mb-4">Advanced Audio Settings</h4>
            <div className="space-y-6">
              <div>
                <label className="flex items-center mb-2">
                  <AudioWaveform className="w-4 h-4 mr-2" />
                  Pitch Adjustment
                </label>
                <Slider
                  size="sm"
                  step={0.1}
                  maxValue={20}
                  minValue={-20}
                  value={settings.pitch}
                  onChange={value => handleSettingChange('pitch', value)}
                  marks={[
                    { value: -20, label: '-20' },
                    { value: 0, label: '0' },
                    { value: 20, label: '20' },
                  ]}
                />
              </div>
              <div>
                <label className="flex items-center mb-2">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Volume Gain (dB)
                </label>
                <Slider
                  size="sm"
                  step={0.1}
                  maxValue={6}
                  minValue={-6}
                  value={settings.volumeGain}
                  onChange={value => handleSettingChange('volumeGain', value)}
                  marks={[
                    { value: -6, label: '-6' },
                    { value: 0, label: '0' },
                    { value: 6, label: '6' },
                  ]}
                />
              </div>
              <div>
                <label className="flex items-center mb-2">
                  <Mic className="w-4 h-4 mr-2" />
                  Sample Rate (Hz)
                </label>
                <Slider
                  size="sm"
                  step={100}
                  maxValue={48000}
                  minValue={8000}
                  value={settings.sampleRate}
                  onChange={value => handleSettingChange('sampleRate', value)}
                  marks={[
                    { value: 8000, label: '8k' },
                    { value: 24000, label: '24k' },
                    { value: 48000, label: '48k' },
                  ]}
                />
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Mic className="w-4 h-4 mr-2" />
                  Use Neural Voice
                </span>
                <Switch
                  checked={settings.useNeuralVoice}
                  onChange={e => handleSettingChange('useNeuralVoice', e.target.checked)}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

// Helper functions
const getRandomName = (gender) => {
  const maleNames = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Richard', 'Thomas', 'Charles', 'Joseph'];
  const femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Margaret', 'Susan', 'Dorothy', 'Lisa'];
  const names = gender === 'MALE' ? maleNames : femaleNames;
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomAvatar = (gender) => {
  const seed = Math.random().toString(36).substring(7);
  return `https://avatars.dicebear.com/api/human/${seed}.svg?gender=${gender.toLowerCase()}`;
};

const mapLanguageCodesToNames = (languageCodes) => {
  const languageMap = {
    'en-US': 'English (US)',
    'es-ES': 'Spanish (Spain)',
    'fr-FR': 'French (France)',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
    'pt-BR': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    'ru-RU': 'Russian',
    'zh-CN': 'Chinese (Mandarin)',
    'zh-TW': 'Chinese (Traditional)',
    'ar-SA': 'Arabic (Saudi Arabia)',
    'hi-IN': 'Hindi (India)',
    'tr-TR': 'Turkish',
    'pl-PL': 'Polish',
    'sv-SE': 'Swedish',
    'da-DK': 'Danish',
    'no-NO': 'Norwegian',
    'fi-FI': 'Finnish',
    'cs-CZ': 'Czech',
    'sk-SK': 'Slovak',
    'hu-HU': 'Hungarian',
    'ro-RO': 'Romanian',
    'el-GR': 'Greek',
    'he-IL': 'Hebrew',
    'th-TH': 'Thai',
    'vi-VN': 'Vietnamese',
    'ms-MY': 'Malay',
    'id-ID': 'Indonesian',
    'bg-BG': 'Bulgarian',
    'uk-UA': 'Ukrainian',
    'hr-HR': 'Croatian',
    'sl-SI': 'Slovenian',
    'lt-LT': 'Lithuanian',
    'lv-LV': 'Latvian',
    'et-EE': 'Estonian',
    'sr-SP': 'Serbian',
    'bs-BA': 'Bosnian',
    'mk-MK': 'Macedonian',
  };
  return languageCodes.map(code => languageMap[code] || code);
};

const mapLanguageNameToCode = (languageName) => {
  const reverseLanguageMap = {
    'English (US)': 'en-US',
    'Spanish (Spain)': 'es-ES',
    'French (France)': 'fr-FR',
    'German': 'de-DE',
    'Italian': 'it-IT',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'Portuguese (Brazil)': 'pt-BR',
    'Portuguese (Portugal)': 'pt-PT',
    'Russian': 'ru-RU',
    'Chinese (Mandarin)': 'zh-CN',
    'Chinese (Traditional)': 'zh-TW',
    'Arabic (Saudi Arabia)': 'ar-SA',
    'Hindi (India)': 'hi-IN',
    'Turkish': 'tr-TR',
    'Polish': 'pl-PL',
    'Swedish': 'sv-SE',
    'Danish': 'da-DK',
    'Norwegian': 'no-NO',
    'Finnish': 'fi-FI',
    'Czech': 'cs-CZ',
    'Slovak': 'sk-SK',
    'Hungarian': 'hu-HU',
    'Romanian': 'ro-RO',
    'Greek': 'el-GR',
    'Hebrew': 'he-IL',
    'Thai': 'th-TH',
    'Vietnamese': 'vi-VN',
    'Malay': 'ms-MY',
    'Indonesian': 'id-ID',
    'Bulgarian': 'bg-BG',
    'Ukrainian': 'uk-UA',
    'Croatian': 'hr-HR',
    'Slovenian': 'sl-SI',
    'Lithuanian': 'lt-LT',
    'Latvian': 'lv-LV',
    'Estonian': 'et-EE',
    'Serbian': 'sr-SP',
    'Bosnian': 'bs-BA',
    'Macedonian': 'mk-MK',
  };
  return reverseLanguageMap[languageName] || languageName;
};

const getCountryCode = (languageName) => {
  const countryMap = {
    'English (US)': 'us',
    'Spanish (Spain)': 'es',
    'French (France)': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Japanese': 'jp',
    'Korean': 'kr',
    'Portuguese (Brazil)': 'br',
    'Portuguese (Portugal)': 'pt',
    'Russian': 'ru',
    'Chinese (Mandarin)': 'cn',
    'Chinese (Traditional)': 'tw',
    'Arabic (Saudi Arabia)': 'sa',
    'Hindi (India)': 'in',
    'Turkish': 'tr',
    'Polish': 'pl',
    'Swedish': 'se',
    'Danish': 'dk',
    'Norwegian': 'no',
    'Finnish': 'fi',
    'Czech': 'cz',
    'Slovak': 'sk',
    'Hungarian': 'hu',
    'Romanian': 'ro',
    'Greek': 'gr',
    'Hebrew': 'il',
    'Thai': 'th',
    'Vietnamese': 'vn',
    'Malay': 'my',
    'Indonesian': 'id',
    'Bulgarian': 'bg',
    'Ukrainian': 'ua',
    'Croatian': 'hr',
    'Slovenian': 'si',
    'Lithuanian': 'lt',
    'Latvian': 'lv',
    'Estonian': 'ee',
    'Serbian': 'rs',
    'Bosnian': 'ba',
    'Macedonian': 'mk',
  };
  return countryMap[languageName] || 'us'; 
};

export default AudioEditor;




