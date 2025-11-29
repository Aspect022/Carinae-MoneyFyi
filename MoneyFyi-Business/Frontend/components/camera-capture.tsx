'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, X, RotateCw, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      setCapturedImage(imageData)
      stopCamera()
    }
  }

  const retake = () => {
    setCapturedImage(null)
    startCamera()
  }

  const confirm = () => {
    if (!capturedImage || !canvasRef.current) return

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `receipt-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })
        onCapture(file)
        stopCamera()
        onClose()
      }
    }, 'image/jpeg', 0.8)
  }

  const toggleCamera = () => {
    stopCamera()
    setFacingMode(facingMode === 'user' ? 'environment' : 'user')
    startCamera()
  }

  // Start camera on mount
  useState(() => {
    startCamera()
    return () => stopCamera()
  })

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold text-white">Capture Receipt</h2>
          <div className="w-10" />
        </div>

        {/* Camera View */}
        <div className="relative flex-1">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              {/* Guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3/4 w-11/12 rounded-lg border-2 border-white/50" />
              </div>
            </>
          ) : (
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured"
              className="h-full w-full object-contain"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-around p-6 pb-safe">
          {!capturedImage ? (
            <>
              <div className="w-16" />
              <Button
                size="lg"
                onClick={capturePhoto}
                className="h-16 w-16 rounded-full bg-background p-0 hover:bg-background/90"
              >
                <div className="h-14 w-14 rounded-full border-4 border-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCamera}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={retake}
                className="border-white text-white hover:bg-white/20"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button
                onClick={confirm}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="mr-2 h-4 w-4" />
                Use Photo
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
