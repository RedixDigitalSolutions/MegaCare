'use client';

import { useRef, useState } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PrescriptionUploaderProps {
  onFileSelected: (file: File) => void;
  onImageCapture?: (imageData: string) => void;
  isProcessing?: boolean;
}

export function PrescriptionUploader({
  onFileSelected,
  onImageCapture,
  isProcessing = false,
}: PrescriptionUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
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
    } catch (error) {
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
          onImageCapture?.(canvasRef.current!.toDataURL('image/jpeg'));
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
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
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-black/5">
            <img src={preview} alt="Ordonnance" className="w-full h-auto" />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Ordonnance chargée avec succès
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                variant="default"
                className="flex-1"
                disabled={isProcessing}
              >
                Prendre la photo
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center hover:border-primary/80 transition cursor-pointer bg-primary/5"
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-8 h-8 text-primary/60" />
                <div>
                  <p className="font-medium text-foreground">
                    Glissez votre ordonnance ici
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou cliquez pour sélectionner un fichier
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                >
                  Choisir un fichier
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Ou utiliser la caméra
                </span>
              </div>
            </div>

            <Button
              onClick={startCamera}
              variant="outline"
              className="w-full"
              disabled={isProcessing}
            >
              <Camera className="w-4 h-4 mr-2" />
              Ouvrir la caméra
            </Button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}
