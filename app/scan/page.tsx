'use client';

import { useRouter } from 'next/navigation';
import { QRCodeScanner } from '@/components/ui/qr-code-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowLeft, Smartphone } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();

  const handleScanSuccess = (data: string) => {
    try {
      const url = new URL(data);
      
      // OMR 카드 URL인지 확인
      if (url.pathname.includes('/omr/')) {
        // OMR 카드 페이지로 리다이렉트
        router.push(url.pathname);
      } else {
        alert('올바른 OMR 카드 QR 코드가 아닙니다.');
      }
    } catch (error) {
      console.error('URL 파싱 실패:', error);
      alert('올바르지 않은 QR 코드입니다.');
    }
  };

  const handleScanError = (error: string) => {
    console.error('QR 스캔 에러:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
            <QrCode className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">QR 코드 스캔</h1>
              <p className="text-sm text-gray-500">OMR 카드 QR 코드를 스캔하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 안내 메시지 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Smartphone className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold text-blue-900 mb-2">OMR 카드 스캔 안내</h2>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 선생님이 제공한 학습지의 QR 코드를 스캔하세요</li>
                  <li>• 카메라 권한을 허용해야 QR 코드를 스캔할 수 있습니다</li>
                  <li>• QR 코드가 인식되면 자동으로 OMR 카드 입력 페이지로 이동합니다</li>
                  <li>• 카메라를 사용할 수 없는 경우 URL을 직접 입력할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR 코드 스캐너 */}
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          onError={handleScanError}
        />

        {/* 추가 도움말 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">문제 해결</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">카메라가 작동하지 않는 경우</h4>
                <p className="text-sm text-gray-600">
                  브라우저 설정에서 카메라 권한을 허용하거나, URL을 직접 입력해보세요.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">QR 코드가 인식되지 않는 경우</h4>
                <p className="text-sm text-gray-600">
                  QR 코드를 화면 중앙에 맞추고, 충분한 조명이 있는지 확인해주세요.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">잘못된 QR 코드를 스캔한 경우</h4>
                <p className="text-sm text-gray-600">
                  선생님이 제공한 학습지의 QR 코드인지 확인해주세요. OMR 카드용 QR 코드만 사용할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
