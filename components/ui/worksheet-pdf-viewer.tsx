'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ExternalLink } from 'lucide-react';
import { Worksheet } from '@/app/types';
import { downloadPDF, printWorksheet, openPDFInNewWindow, printWorksheetInNewWindow } from '@/lib/pdf-utils';
import { WorksheetPDFContent } from './worksheet-pdf-content';

interface WorksheetPDFViewerProps {
  worksheet: Worksheet;
  className?: string;
}

// PDF 관련 함수들을 export
export const usePDFActions = (worksheet: Worksheet) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isOpeningPDF, setIsOpeningPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadPDF(worksheet, 'worksheet-print-content', {
        filename: `${worksheet.title}.pdf`,
        format: 'a4',
        orientation: 'portrait',
        quality: 1,
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      });
    } catch (error) {
      console.error('PDF 다운로드 실패:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      printWorksheetInNewWindow(worksheet);
    } catch (error) {
      console.error('인쇄 실패:', error);
      alert('인쇄 중 오류가 발생했습니다.');
    } finally {
      setTimeout(() => setIsPrinting(false), 1000);
    }
  };

  const handleOpenPDFInNewWindow = async () => {
    setIsOpeningPDF(true);
    try {
      await openPDFInNewWindow(worksheet, 'worksheet-print-content', {
        filename: `${worksheet.title}.pdf`,
        format: 'a4',
        orientation: 'portrait',
        quality: 1,
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      });
    } catch (error) {
      console.error('미리보기 실패:', error);
      alert('미리보기 중 오류가 발생했습니다.');
    } finally {
      setIsOpeningPDF(false);
    }
  };

  return {
    handleDownloadPDF,
    handlePrint,
    handleOpenPDFInNewWindow,
    isDownloading,
    isPrinting,
    isOpeningPDF
  };
};

export const WorksheetPDFViewer: React.FC<WorksheetPDFViewerProps> = ({
  worksheet,
  className = ''
}) => {

  return (
    <div className={`${className}`}>
      {/* PDF 생성용 숨겨진 콘텐츠 - 이제 사용하지 않음 */}
      <div className="hidden" data-worksheet={JSON.stringify(worksheet)} id="worksheet-print-content">
        {/* worksheet 데이터는 data 속성으로 전달 */}
      </div>
    </div>
  );
};

export default WorksheetPDFViewer;
