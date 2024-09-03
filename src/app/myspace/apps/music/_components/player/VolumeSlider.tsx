import * as Slider from '@radix-ui/react-slider';
import { motion } from 'framer-motion';

const VolumeSlider = ({ onChange, audioVolume }) => {
    return (
        <div className="relative group">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-[100px] h-5"
                orientation="horizontal"
                min={0}
                max={1}
                step={0.01}
                value={[audioVolume.isMuted ? 0 : audioVolume.value]}
                onValueChange={(value) => onChange(value)}
            >
                <Slider.Track className="bg-gray-600 relative grow rounded-full h-[3px]">
                    <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200 ease-out hover:scale-110" />
            </Slider.Root>
            
            <motion.div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 pointer-events-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
            >
                {Math.round(audioVolume.value * 100)}%
            </motion.div>
        </div>
    );
};

export default VolumeSlider;