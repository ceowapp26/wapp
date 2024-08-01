import * as Slider from '@radix-ui/react-slider';

const VolumeSlider = ({ onChange, audioVolume }) => {
    return (
        <Slider.Root
            className="absolute w-full hidden items-center bottom-full left-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-24 group-hover:flex"
            orientation="vertical"
            min={0}
            step={0.1}
            max={1}
            value={[audioVolume.isMuted ? 0 : audioVolume.value]}
            onValueChange={(value) => onChange(value)}
        >
            <Slider.Track className="relative flex-grow bg-gray-400 rounded-full data-[orientation=vertical]:w-[3px]">
                <Slider.Range className="absolute bg-green-500 rounded-full data-[orientation=vertical]:w-full" />
            </Slider.Track>
            <Slider.Thumb />
        </Slider.Root>
    );
};

export default VolumeSlider;
