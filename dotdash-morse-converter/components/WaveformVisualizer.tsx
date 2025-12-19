import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
    analyserNode: AnalyserNode | null;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ analyserNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyserNode || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        // Set canvas size based on its display size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvasCtx.scale(dpr, dpr);


        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animationFrameId: number;

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            analyserNode.getByteTimeDomainData(dataArray);

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(34, 211, 238)'; // cyan-400
            canvasCtx.beginPath();

            const sliceWidth = rect.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * rect.height / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            canvasCtx.lineTo(rect.width, rect.height / 2);
            canvasCtx.stroke();
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [analyserNode]);

    return <canvas ref={canvasRef} className="w-full h-8" />;
};

export default WaveformVisualizer;
