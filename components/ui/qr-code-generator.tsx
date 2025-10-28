'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, QrCode, ExternalLink } from 'lucide-react';

interface QRCodeGeneratorProps {
  worksheetId: string;
  worksheetTitle: string;
  className?: string;
}

export function QRCodeGenerator({ worksheetId, worksheetTitle, className }: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // OMR 카드 페이지 URL 생성
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
    const omrUrl = `${baseUrl}/omr/${worksheetId}`;
    setQrValue(omrUrl);
  }, [worksheetId]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('URL 복사 실패:', error);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${worksheetId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleOpenOMR = () => {
    window.open(qrValue, '_blank');
  };

  if (!qrValue) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>OMR 카드 QR 코드</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR 코드 */}
        <div className="flex justify-center p-4 bg-white border rounded-lg">
          <QRCode
            id="qr-code-svg"
            value={qrValue}
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>

        {/* 학습지 정보 */}
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-gray-900">{worksheetTitle}</h3>
          <Badge variant="outline">ID: {worksheetId}</Badge>
        </div>

        {/* URL 표시 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">OMR 카드 URL</p>
          <p className="text-sm font-mono text-gray-700 break-all">{qrValue}</p>
        </div>

        {/* 액션 버튼들 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? '복사됨!' : 'URL 복사'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQR}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            QR 다운로드
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenOMR}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            OMR 열기
          </Button>
        </div>

        {/* 사용 안내 */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">사용 방법</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. 학생이 모바일 기기로 QR 코드를 스캔합니다</li>
            <li>2. OMR 카드 입력 페이지가 자동으로 열립니다</li>
            <li>3. 학생 정보를 입력하고 답안을 마킹합니다</li>
            <li>4. 제출 버튼을 눌러 답안을 전송합니다</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
