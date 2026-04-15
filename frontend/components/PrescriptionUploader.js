import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
export function PrescriptionUploader({ onFileSelected, onImageCapture, isProcessing = false, }) {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onFileSelected(file);
            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onFileSelected(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        }
        catch (error) {
            console.error('Erreur accès caméra:', error);
        }
    };
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0);
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `prescription-${Date.now()}.jpg`, {
                        type: 'image/jpeg',
                    });
                    onFileSelected(file);
                    onImageCapture?.(canvasRef.current.toDataURL('image/jpeg'));
                    stopCamera();
                }
            }, 'image/jpeg');
        }
    };
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            setIsCameraActive(false);
        }
    };
    const clearPreview = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    if (preview) {
        return (_jsx(Card, { className: "p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative rounded-lg overflow-hidden bg-black/5", children: [_jsx("img", { src: preview, alt: "Ordonnance", className: "w-full h-auto" }), _jsx("button", { onClick: clearPreview, className: "absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Ordonnance charg\u00E9e avec succ\u00E8s" })] }) }));
    }
    return (_jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "space-y-4", children: isCameraActive ? (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "relative bg-black rounded-lg overflow-hidden", children: _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, className: "w-full aspect-video object-cover" }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: capturePhoto, variant: "default", className: "flex-1", disabled: isProcessing, children: "Prendre la photo" }), _jsx(Button, { onClick: stopCamera, variant: "outline", className: "flex-1", disabled: isProcessing, children: "Annuler" })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { onDragOver: handleDragOver, onDrop: handleDrop, className: "border-2 border-dashed border-primary/50 rounded-lg p-8 text-center hover:border-primary/80 transition cursor-pointer bg-primary/5", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Upload, { className: "w-8 h-8 text-primary/60" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-foreground", children: "Glissez votre ordonnance ici" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "ou cliquez pour s\u00E9lectionner un fichier" })] }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileSelect, className: "hidden", disabled: isProcessing }), _jsx(Button, { onClick: () => fileInputRef.current?.click(), variant: "outline", size: "sm", disabled: isProcessing, children: "Choisir un fichier" })] }) }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-border" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-background text-muted-foreground", children: "Ou utiliser la cam\u00E9ra" }) })] }), _jsxs(Button, { onClick: startCamera, variant: "outline", className: "w-full", disabled: isProcessing, children: [_jsx(Camera, { className: "w-4 h-4 mr-2" }), "Ouvrir la cam\u00E9ra"] })] })) }), _jsx("canvas", { ref: canvasRef, className: "hidden" })] }));
}
