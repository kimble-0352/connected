'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, CameraOff, QrCode, Type } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function QRCodeScanner({ onScanSuccess, onError, className }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      
      // 카메라 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      setHasPermission(true);
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // QR 코드 스캔 시작
        videoRef.current.onloadedmetadata = () => {
          startQRDetection();
        };
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      setHasPermission(false);
      setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
      onError?.('카메라 접근 실패');
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startQRDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // 실제 QR 코드 디코딩은 qr-scanner 라이브러리 사용
        // 여기서는 간단한 시뮬레이션
        detectQRCode(imageData);
      }
    }, 500);
  };

  const detectQRCode = async (imageData: ImageData) => {
    try {
      // 실제로는 QR 스캐너 라이브러리를 사용
      // 여기서는 데모용 시뮬레이션
      
      // QR 코드가 감지되었다고 가정하고 URL 패턴 체크
      const mockDetectedData = 'https://your-domain.com/omr/test-worksheet';
      
      // URL 패턴 검증
      if (mockDetectedData.includes('/omr/')) {
        stopScanning();
        onScanSuccess(mockDetectedData);
      }
    } catch (error) {
      console.error('QR 코드 감지 실패:', error);
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }

    // URL 형식 검증
    try {
      const url = new URL(manualInput);
      if (url.pathname.includes('/omr/')) {
        onScanSuccess(manualInput);
        setManualInput('');
        setError(null);
      } else {
        setError('올바른 OMR 카드 URL이 아닙니다.');
      }
    } catch {
      setError('올바른 URL 형식이 아닙니다.');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>QR 코드 스캔</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 카메라 스캔 영역 */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {/* 스캔 가이드 오버레이 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-white opacity-75" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm text-center bg-black bg-opacity-50 rounded px-2 py-1">
                    QR 코드를 화면 중앙에 맞춰주세요
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">카메라를 시작하여 QR 코드를 스캔하세요</p>
                </div>
              </div>
            )}
          </div>

          {/* 카메라 제어 버튼 */}
          <div className="flex justify-center space-x-4">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>카메라 시작</span>
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outline" className="flex items-center space-x-2">
                <CameraOff className="h-4 w-4" />
                <span>스캔 중지</span>
              </Button>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 수동 입력 */}
        <div className="space-y-3">
          <Label htmlFor="manual-input" className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <span>URL 직접 입력</span>
          </Label>
          <div className="flex space-x-2">
            <Input
              id="manual-input"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="https://your-domain.com/omr/test-worksheet"
              className="flex-1"
            />
            <Button onClick={handleManualSubmit}>
              확인
            </Button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* 권한 안내 */}
        {hasPermission === false && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">카메라 권한 필요</h4>
            <p className="text-sm text-yellow-700">
              QR 코드를 스캔하려면 카메라 권한이 필요합니다. 
              브라우저 설정에서 카메라 권한을 허용해주세요.
            </p>
          </div>
        )}

        {/* 사용 안내 */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">스캔 방법</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 카메라를 시작하고 QR 코드를 화면 중앙에 맞춰주세요</li>
            <li>• QR 코드가 자동으로 인식되면 OMR 카드 페이지로 이동합니다</li>
            <li>• 카메라를 사용할 수 없는 경우 URL을 직접 입력하세요</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
