import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Worksheet } from '@/app/types';

export interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// QR 코드 생성 함수
export const generateQRCode = async (data: string, size: number = 100): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    // 실패 시 기본 QR 코드 이미지 반환
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNjY2MiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVI8L3RleHQ+PC9zdmc+';
  }
};

// 학습지 정보를 기반으로 QR 코드 데이터 생성
export const generateWorksheetQRData = (worksheet: Worksheet): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mathflat.com';
  const worksheetUrl = `${baseUrl}/worksheet/${worksheet.id}`;
  
  // QR 코드에 포함될 정보
  const qrData = {
    title: worksheet.title,
    subject: worksheet.subject,
    grade: worksheet.worksheetSettings?.grade || '중2',
    creator: worksheet.worksheetSettings?.creator || '매쓰플랫',
    totalQuestions: worksheet.totalQuestions,
    createdAt: worksheet.createdAt,
    url: worksheetUrl
  };
  
  // JSON 형태로 인코딩하거나 단순 URL만 사용
  return worksheetUrl;
};

// 더 이상 사용하지 않는 함수들 (html2canvas 제거로 인해)
// 이 함수들은 하위 호환성을 위해 유지하지만 실제로는 사용되지 않음

// 브라우저 인쇄 기능을 활용한 PDF 생성 함수
export const generateWorksheetPDF = async (
  worksheet: Worksheet,
  elementId: string,
  options: PDFOptions = {}
): Promise<jsPDF> => {
  // 한글 지원을 위해 브라우저의 인쇄 기능을 활용
  // 실제로는 PDF 객체를 반환하지 않고 인쇄 다이얼로그를 열어줌
  throw new Error('PDF 다운로드는 현재 지원되지 않습니다. 인쇄 기능을 사용해주세요.');
};

// PDF 자동 다운로드 함수
export const downloadPDF = async (
  worksheet: Worksheet,
  elementId: string,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    // QR 코드 생성
    let qrCodeImage = '';
    if (worksheet.worksheetSettings?.qrEnabled !== false && (worksheet.worksheetSettings?.qrEnabled || worksheet.qrCode)) {
      const qrData = generateWorksheetQRData(worksheet);
      qrCodeImage = await generateQRCode(qrData, 80);
    }
    const subjectName = worksheet.subject === 'math' ? '수학' : 
                       worksheet.subject === 'english' ? '영어' : '국어';

    // step3에서 설정한 정보들을 가져오기
    const worksheetSettings = {
      grade: worksheet.worksheetSettings?.grade || '중2', // step3에서 설정한 학년
      creator: worksheet.worksheetSettings?.creator || '매쓰플랫', // step3에서 설정한 출제자
      layout: worksheet.worksheetSettings?.layout || 'single', // step3에서 설정한 분할선택
      includeAnswers: worksheet.worksheetSettings?.includeAnswers || false, // step3에서 설정한 정답포함 여부
      includeExplanations: worksheet.worksheetSettings?.includeExplanations || false, // step3에서 설정한 해설포함 여부
      qrEnabled: worksheet.worksheetSettings?.qrEnabled !== undefined ? worksheet.worksheetSettings.qrEnabled : (worksheet.qrCode ? true : false), // step3에서 설정한 QR생성 여부
      description: worksheet.description || ''
    };

    const printContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${worksheet.title} - PDF</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background: white !important;
            color: black !important;
          }
          
          body {
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
            line-height: 1.6;
            padding: 15mm;
            background: white !important;
            font-size: 14px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }
          
          .logo {
            margin-bottom: 15px;
          }
          
          .logo-container {
            display: inline-block;
          }
          
          .logo-img {
            width: 120px;
            height: 50px;
            object-fit: contain;
            display: block;
          }
          
          .logo-fallback {
            width: 120px;
            height: 50px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            display: none;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            margin-top: 10px;
          }
          
          .info-left {
            text-align: left;
          }
          
          .info-center {
            text-align: center;
          }
          
          .info-right {
            text-align: right;
          }
          
          .qr-code {
            width: 30px;
            height: 30px;
            margin-left: 10px;
            vertical-align: middle;
          }
          
          .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .questions-container {
            ${worksheetSettings.layout === 'double' ? 'column-count: 2; column-gap: 20px;' : 
              worksheetSettings.layout === 'quad' ? 'column-count: 4; column-gap: 15px;' :
              worksheetSettings.layout === 'six' ? 'column-count: 6; column-gap: 10px;' : ''}
          }
          
          .question {
            margin-bottom: 20px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .question-header {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .question-content {
            margin-bottom: 12px;
            font-size: 13px;
            line-height: 1.7;
          }
          
          .choices {
            margin-left: 15px;
            margin-bottom: 12px;
          }
          
          .choice {
            margin-bottom: 4px;
            font-size: 12px;
          }
          
          .answer-space {
            border: 1px dashed #ccc;
            padding: 8px;
            min-height: 35px;
            background: white !important;
          }
          
          .answer-label {
            font-size: 10px;
            color: #666;
            margin-bottom: 4px;
          }
          
          .answer-section {
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa !important;
            border-radius: 5px;
          }
          
          .explanation-section {
            margin-top: 10px;
            padding: 10px;
            background: #e3f2fd !important;
            border-radius: 5px;
          }
          
          @media print {
            body { margin: 0; padding: 10mm; }
            @page { margin: 10mm; size: A4; }
            .question { page-break-inside: avoid; break-inside: avoid; }
            .questions-container { 
              ${worksheetSettings.layout === 'double' ? 'column-count: 2; column-gap: 15mm;' : 
                worksheetSettings.layout === 'quad' ? 'column-count: 4; column-gap: 10mm;' :
                worksheetSettings.layout === 'six' ? 'column-count: 6; column-gap: 8mm;' : ''}
            }
          }
          
          .download-note {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="download-note">📥 PDF 다운로드 중... 잠시만 기다려주세요.</div>
        
        <div class="header">
        <!-- 대교 로고 -->
        <div class="logo">
          <div class="logo-container">
            <img src="/daekyo-logo.png" alt="대교 Hi Campus" class="logo-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="logo-fallback">대교 Hi Campus</div>
          </div>
        </div>
          
          <!-- 학습지명 (학년 포함) -->
          <div class="title">${worksheetSettings.grade} ${worksheet.title}</div>
          
          <!-- 학습지 설명 -->
          ${worksheetSettings.description ? `<div class="subtitle">${worksheetSettings.description}</div>` : ''}
          
          <!-- 정보 그리드 -->
          <div class="info-grid">
            <div class="info-left">
              <div>이름: _______________</div>
              <div style="margin-top: 5px;">출제자: ${worksheetSettings.creator}</div>
            </div>
            <div class="info-center">
              <div>과목: ${subjectName}</div>
              <div style="margin-top: 5px;">총 문항: ${worksheet.totalQuestions}개</div>
            </div>
            <div class="info-right">
              <div>날짜: ${new Date().toLocaleDateString('ko-KR')}</div>
              ${worksheetSettings.qrEnabled && qrCodeImage ? `<div class="qr-code"><img src="${qrCodeImage}" alt="QR Code" /></div>` : ''}
            </div>
          </div>
        </div>
        
        <div class="questions-container">
          ${worksheet.questions.map((question, index) => {
            const difficultyMap = { 'low': '하', 'medium': '중', 'high': '상', 'highest': '최상' };
            const typeMap = { 'multiple_choice': '객관식', 'short_answer': '단답형', 'essay': '서술형' };
            
            return `
              <div class="question">
                <div class="question-header">
                  ${index + 1}. [${difficultyMap[question.difficulty as keyof typeof difficultyMap]}] 
                  [${typeMap[question.type as keyof typeof typeMap]}]
                </div>
                <div class="question-content">${question.content}</div>
                
                ${question.type === 'multiple_choice' && question.choices ? `
                  <div class="choices">
                    ${question.choices.map((choice, choiceIndex) => 
                      `<div class="choice">${String.fromCharCode(65 + choiceIndex)}. ${choice}</div>`
                    ).join('')}
                  </div>
                ` : ''}
                
                <div class="answer-space">
                  <div class="answer-label">답안:</div>
                  ${question.type === 'essay' ? 
                    '<div style="height: 50px; border-bottom: 1px solid #ddd; margin: 4px 0;"></div><div style="height: 50px; border-bottom: 1px solid #ddd; margin: 4px 0;"></div>' : 
                    '<div style="height: 25px; border-bottom: 1px solid #ddd; margin: 4px 0;"></div>'
                  }
                </div>
                
                ${worksheetSettings.includeAnswers ? `
                  <div class="answer-section">
                    <strong>정답:</strong> ${question.correctAnswer || '정답'}
                  </div>
                ` : ''}
                
                ${worksheetSettings.includeExplanations ? `
                  <div class="explanation-section">
                    <strong>해설:</strong> ${question.explanation || '해설이 제공됩니다.'}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        
        <script>
          window.onload = function() {
            // 다운로드 노트 숨기기
            setTimeout(() => {
              const note = document.querySelector('.download-note');
              if (note) note.style.display = 'none';
            }, 1000);
            
            // 자동으로 인쇄 다이얼로그 실행 (PDF 저장 가능)
            setTimeout(() => {
              window.print();
            }, 1500);
          };
          
          // 인쇄 후 창 닫기
          window.onafterprint = function() {
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // 새창으로 PDF 다운로드 페이지 열기
    const downloadWindow = window.open('', '_blank', 'width=800,height=600');
    if (!downloadWindow) {
      alert('팝업이 차단되어 PDF 다운로드를 할 수 없습니다.');
      return;
    }

    downloadWindow.document.write(printContent);
    downloadWindow.document.close();
    
  } catch (error) {
    console.error('PDF 다운로드 중 오류 발생:', error);
    throw error;
  }
};

// 미리보기 전용 함수 (인쇄 다이얼로그 없이 단순 보기)
export const openWorksheetPreview = async (worksheet: Worksheet): Promise<void> => {
  // QR 코드 생성
  let qrCodeImage = '';
  if (worksheet.worksheetSettings?.qrEnabled !== false && (worksheet.worksheetSettings?.qrEnabled || worksheet.qrCode)) {
    const qrData = generateWorksheetQRData(worksheet);
    qrCodeImage = await generateQRCode(qrData, 120);
  }
  const subjectName = worksheet.subject === 'math' ? '수학' : 
                     worksheet.subject === 'english' ? '영어' : '국어';

  // step3에서 설정한 정보들을 가져오기
  const worksheetSettings = {
    grade: worksheet.worksheetSettings?.grade || '중2', // step3에서 설정한 학년
    creator: worksheet.worksheetSettings?.creator || '매쓰플랫', // step3에서 설정한 출제자
    layout: worksheet.worksheetSettings?.layout || 'single', // step3에서 설정한 분할선택
    includeAnswers: worksheet.worksheetSettings?.includeAnswers || false, // step3에서 설정한 정답포함 여부
    includeExplanations: worksheet.worksheetSettings?.includeExplanations || false, // step3에서 설정한 해설포함 여부
    qrEnabled: worksheet.worksheetSettings?.qrEnabled !== undefined ? worksheet.worksheetSettings.qrEnabled : (worksheet.qrCode ? true : false), // step3에서 설정한 QR생성 여부
    description: worksheet.description || ''
  };

  const previewContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${worksheet.title} - 미리보기</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: white !important;
          color: black !important;
        }
        
        body {
          font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
          line-height: 1.6;
          padding: 20px;
          background: white !important;
          font-size: 14px;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #000;
        }
        
        .logo {
          margin-bottom: 15px;
        }
        
        .logo-container {
          display: inline-block;
        }
        
        .logo-img {
          width: 140px;
          height: 60px;
          object-fit: contain;
          display: block;
        }
        
        .logo-fallback {
          width: 140px;
          height: 60px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          display: none;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        
        .subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 15px;
        }
        
        .info-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin-top: 15px;
        }
        
        .info-left {
          text-align: left;
        }
        
        .info-center {
          text-align: center;
        }
        
        .info-right {
          text-align: right;
        }
        
        .qr-code {
          width: 40px;
          height: 40px;
          margin-left: 10px;
          vertical-align: middle;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .qr-code img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .questions-container {
          ${worksheetSettings.layout === 'double' ? 'column-count: 2; column-gap: 30px;' : 
            worksheetSettings.layout === 'quad' ? 'column-count: 4; column-gap: 20px;' :
            worksheetSettings.layout === 'six' ? 'column-count: 6; column-gap: 15px;' : ''}
        }
        
        .question {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fafafa !important;
          break-inside: avoid;
        }
        
        .question-header {
          font-weight: bold;
          margin-bottom: 12px;
          font-size: 16px;
          color: #333;
        }
        
        .question-content {
          margin-bottom: 15px;
          font-size: 15px;
          line-height: 1.8;
          color: #333;
        }
        
        .choices {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        
        .choice {
          margin-bottom: 8px;
          font-size: 14px;
          padding: 5px 0;
        }
        
        .answer-space {
          border: 1px dashed #ccc;
          padding: 15px;
          min-height: 50px;
          background: white !important;
          border-radius: 4px;
        }
        
        .answer-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .answer-section {
          margin-top: 15px;
          padding: 12px;
          background: #f8f9fa !important;
          border-radius: 5px;
          border-left: 4px solid #28a745;
        }
        
        .explanation-section {
          margin-top: 10px;
          padding: 12px;
          background: #e3f2fd !important;
          border-radius: 5px;
          border-left: 4px solid #2196f3;
        }
        
        .preview-note {
          position: fixed;
          top: 10px;
          right: 10px;
          background: #007bff;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1000;
        }
      </style>
    </head>
    <body>
      <div class="preview-note">📖 미리보기</div>
      
      <div class="header">
        <!-- 대교 로고 -->
        <div class="logo">
          <div class="logo-container">
            <img src="/daekyo-logo.png" alt="대교 Hi Campus" class="logo-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="logo-fallback">대교 Hi Campus</div>
          </div>
        </div>
        
        <!-- 학습지명 (학년 포함) -->
        <div class="title">${worksheetSettings.grade} ${worksheet.title}</div>
        
        <!-- 학습지 설명 -->
        ${worksheetSettings.description ? `<div class="subtitle">${worksheetSettings.description}</div>` : ''}
        
        <!-- 정보 그리드 -->
        <div class="info-grid">
          <div class="info-left">
            <div>이름: _______________</div>
            <div style="margin-top: 5px;">출제자: ${worksheetSettings.creator}</div>
          </div>
          <div class="info-center">
            <div>과목: ${subjectName}</div>
            <div style="margin-top: 5px;">총 문항: ${worksheet.totalQuestions}개</div>
          </div>
          <div class="info-right">
            <div>날짜: ${new Date().toLocaleDateString('ko-KR')}</div>
${worksheetSettings.qrEnabled && qrCodeImage ? `<div class="qr-code"><img src="${qrCodeImage}" alt="QR Code" /></div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="questions-container">
        ${worksheet.questions.map((question, index) => {
          const difficultyMap = { 'low': '하', 'medium': '중', 'high': '상', 'highest': '최상' };
          const typeMap = { 'multiple_choice': '객관식', 'short_answer': '단답형', 'essay': '서술형' };
          
          return `
            <div class="question">
              <div class="question-header">
                ${index + 1}. [${difficultyMap[question.difficulty as keyof typeof difficultyMap]}] 
                [${typeMap[question.type as keyof typeof typeMap]}]
              </div>
              <div class="question-content">${question.content}</div>
              
              ${question.type === 'multiple_choice' && question.choices ? `
                <div class="choices">
                  ${question.choices.map((choice, choiceIndex) => 
                    `<div class="choice">${String.fromCharCode(65 + choiceIndex)}. ${choice}</div>`
                  ).join('')}
                </div>
              ` : ''}
              
              <div class="answer-space">
                <div class="answer-label">답안 작성 공간</div>
                ${question.type === 'essay' ? 
                  '<div style="height: 80px; border-bottom: 1px solid #eee; margin: 8px 0;"></div><div style="height: 80px; border-bottom: 1px solid #eee; margin: 8px 0;"></div>' : 
                  '<div style="height: 40px; border-bottom: 1px solid #eee; margin: 8px 0;"></div>'
                }
              </div>
              
              ${worksheetSettings.includeAnswers ? `
                <div class="answer-section">
                  <strong>정답:</strong> ${question.correctAnswer || '정답'}
                </div>
              ` : ''}
              
              ${worksheetSettings.includeExplanations ? `
                <div class="explanation-section">
                  <strong>해설:</strong> ${question.explanation || '해설이 제공됩니다.'}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </body>
    </html>
  `;

  // 새창으로 미리보기 열기
  const previewWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');
  if (!previewWindow) {
    alert('팝업이 차단되어 미리보기를 열 수 없습니다.');
    return;
  }

  previewWindow.document.write(previewContent);
  previewWindow.document.close();
};

export const openPDFInNewWindow = async (
  worksheet: Worksheet,
  elementId: string,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    // 미리보기 전용 함수 사용 (이제 async)
    await openWorksheetPreview(worksheet);
  } catch (error) {
    console.error('미리보기 열기 중 오류 발생:', error);
    throw error;
  }
};

export const printWorksheet = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // 인쇄용 스타일 생성
  const printStyles = `
    <style>
      @media print {
        body * {
          visibility: hidden;
        }
        #${elementId}, #${elementId} * {
          visibility: visible;
        }
        #${elementId} {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          height: auto !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* 페이지 브레이크 설정 */
        .page-break {
          page-break-before: always;
        }
        
        /* 인쇄 시 불필요한 요소 숨기기 */
        .no-print {
          display: none !important;
        }
        
        /* 인쇄용 폰트 크기 조정 */
        .print-title {
          font-size: 24px !important;
          font-weight: bold !important;
          margin-bottom: 20px !important;
        }
        
        .print-question {
          font-size: 14px !important;
          line-height: 1.6 !important;
          margin-bottom: 15px !important;
        }
        
        /* 인쇄용 여백 설정 */
        @page {
          margin: 2cm;
          size: A4;
        }
      }
    </style>
  `;

  // 기존 인쇄 스타일 제거
  const existingPrintStyles = document.getElementById('print-styles');
  if (existingPrintStyles) {
    existingPrintStyles.remove();
  }

  // 새 인쇄 스타일 추가
  const styleElement = document.createElement('div');
  styleElement.id = 'print-styles';
  styleElement.innerHTML = printStyles;
  document.head.appendChild(styleElement);

  // 인쇄 실행
  window.print();

  // 인쇄 후 스타일 제거
  setTimeout(() => {
    const printStylesElement = document.getElementById('print-styles');
    if (printStylesElement) {
      printStylesElement.remove();
    }
  }, 1000);
};

export const printWorksheetInNewWindow = async (worksheet: Worksheet): Promise<void> => {
  // QR 코드 생성
  let qrCodeImage = '';
  if (worksheet.worksheetSettings?.qrEnabled !== false && (worksheet.worksheetSettings?.qrEnabled || worksheet.qrCode)) {
    const qrData = generateWorksheetQRData(worksheet);
    qrCodeImage = await generateQRCode(qrData, 80);
  }
  // 간단한 텍스트 기반 인쇄용 HTML 생성
  const subjectName = worksheet.subject === 'math' ? '수학' : 
                     worksheet.subject === 'english' ? '영어' : '국어';

  // step3에서 설정한 정보들을 가져오기
  const worksheetSettings = {
    grade: worksheet.worksheetSettings?.grade || '중2', // step3에서 설정한 학년
    creator: worksheet.worksheetSettings?.creator || '매쓰플랫', // step3에서 설정한 출제자
    layout: worksheet.worksheetSettings?.layout || 'single', // step3에서 설정한 분할선택
    includeAnswers: worksheet.worksheetSettings?.includeAnswers || false, // step3에서 설정한 정답포함 여부
    includeExplanations: worksheet.worksheetSettings?.includeExplanations || false, // step3에서 설정한 해설포함 여부
    qrEnabled: worksheet.worksheetSettings?.qrEnabled !== undefined ? worksheet.worksheetSettings.qrEnabled : (worksheet.qrCode ? true : false), // step3에서 설정한 QR생성 여부
    description: worksheet.description || ''
  };

  const printContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${worksheet.title} - 학습지</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: white !important;
          color: black !important;
        }
        
        body {
          font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
          line-height: 1.6;
          padding: 20mm;
          background: white !important;
          font-size: 14px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #000;
        }
        
        .logo {
          margin-bottom: 15px;
        }
        
        .logo-container {
          display: inline-block;
        }
        
        .logo-img {
          width: 120px;
          height: 50px;
          object-fit: contain;
          display: block;
        }
        
        .logo-fallback {
          width: 120px;
          height: 50px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          display: none;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
        }
        
        .info-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          margin-top: 10px;
        }
        
        .info-left {
          text-align: left;
        }
        
        .info-center {
          text-align: center;
        }
        
        .info-right {
          text-align: right;
        }
        
        .qr-code {
          width: 30px;
          height: 30px;
          margin-left: 10px;
          vertical-align: middle;
        }
        
        .qr-code img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .questions-container {
          ${worksheetSettings.layout === 'double' ? 'column-count: 2; column-gap: 20px;' : 
            worksheetSettings.layout === 'quad' ? 'column-count: 4; column-gap: 15px;' :
            worksheetSettings.layout === 'six' ? 'column-count: 6; column-gap: 10px;' : ''}
        }
        
        .question {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .question-header {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .question-content {
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.8;
        }
        
        .choices {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        
        .choice {
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .answer-space {
          border: 1px dashed #ccc;
          padding: 10px;
          min-height: 40px;
          background: white !important;
        }
        
        .answer-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .answer-section {
          margin-top: 15px;
          padding: 10px;
          background: #f8f9fa !important;
          border-radius: 5px;
        }
        
        .explanation-section {
          margin-top: 10px;
          padding: 10px;
          background: #e3f2fd !important;
          border-radius: 5px;
        }
        
        @media print {
          body { margin: 0; padding: 15mm; }
          @page { margin: 15mm; size: A4; }
          .question { page-break-inside: avoid; break-inside: avoid; }
          .questions-container { 
            ${worksheetSettings.layout === 'double' ? 'column-count: 2; column-gap: 15mm;' : 
              worksheetSettings.layout === 'quad' ? 'column-count: 4; column-gap: 10mm;' :
              worksheetSettings.layout === 'six' ? 'column-count: 6; column-gap: 8mm;' : ''}
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <!-- 대교 로고 -->
        <div class="logo">
          <div class="logo-container">
            <img src="/daekyo-logo.png" alt="대교 Hi Campus" class="logo-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="logo-fallback">대교 Hi Campus</div>
          </div>
        </div>
        
        <!-- 학습지명 (학년 포함) -->
        <div class="title">${worksheetSettings.grade} ${worksheet.title}</div>
        
        <!-- 학습지 설명 -->
        ${worksheetSettings.description ? `<div class="subtitle">${worksheetSettings.description}</div>` : ''}
        
        <!-- 정보 그리드 -->
        <div class="info-grid">
          <div class="info-left">
            <div>이름: _______________</div>
            <div style="margin-top: 5px;">출제자: ${worksheetSettings.creator}</div>
          </div>
          <div class="info-center">
            <div>과목: ${subjectName}</div>
            <div style="margin-top: 5px;">총 문항: ${worksheet.totalQuestions}개</div>
          </div>
          <div class="info-right">
            <div>날짜: ${new Date().toLocaleDateString('ko-KR')}</div>
${worksheetSettings.qrEnabled && qrCodeImage ? `<div class="qr-code"><img src="${qrCodeImage}" alt="QR Code" /></div>` : ''}
          </div>
        </div>
      </div>
      
      <div class="questions-container">
        ${worksheet.questions.map((question, index) => {
          const difficultyMap = { 'low': '하', 'medium': '중', 'high': '상', 'highest': '최상' };
          const typeMap = { 'multiple_choice': '객관식', 'short_answer': '단답형', 'essay': '서술형' };
          
          return `
            <div class="question">
              <div class="question-header">
                ${index + 1}. [${difficultyMap[question.difficulty as keyof typeof difficultyMap]}] 
                [${typeMap[question.type as keyof typeof typeMap]}]
              </div>
              <div class="question-content">${question.content}</div>
              
              ${question.type === 'multiple_choice' && question.choices ? `
                <div class="choices">
                  ${question.choices.map((choice, choiceIndex) => 
                    `<div class="choice">${String.fromCharCode(65 + choiceIndex)}. ${choice}</div>`
                  ).join('')}
                </div>
              ` : ''}
              
              <div class="answer-space">
                <div class="answer-label">답안:</div>
                ${question.type === 'essay' ? 
                  '<div style="height: 60px; border-bottom: 1px solid #ddd; margin: 5px 0;"></div><div style="height: 60px; border-bottom: 1px solid #ddd; margin: 5px 0;"></div>' : 
                  '<div style="height: 30px; border-bottom: 1px solid #ddd; margin: 5px 0;"></div>'
                }
              </div>
              
              ${worksheetSettings.includeAnswers ? `
                <div class="answer-section">
                  <strong>정답:</strong> ${question.correctAnswer || '정답'}
                </div>
              ` : ''}
              
              ${worksheetSettings.includeExplanations ? `
                <div class="explanation-section">
                  <strong>해설:</strong> ${question.explanation || '해설이 제공됩니다.'}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 500);
        };
        
        window.onafterprint = function() {
          window.close();
        };
      </script>
    </body>
    </html>
  `;

  // 새창으로 인쇄 페이지 열기
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('팝업이 차단되어 인쇄할 수 없습니다.');
    return;
  }

  printWindow.document.write(printContent);
  printWindow.document.close();
};

// 학습지 내용을 구조화된 형태로 변환하는 함수
export const formatWorksheetForPDF = (worksheet: Worksheet) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubjectName = (subject: string) => {
    const subjectMap = {
      'math': '수학',
      'english': '영어',
      'korean': '국어'
    };
    return subjectMap[subject as keyof typeof subjectMap] || subject;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labelMap = {
      'low': '하',
      'medium': '중',
      'high': '상',
      'highest': '최상'
    };
    return labelMap[difficulty as keyof typeof labelMap] || difficulty;
  };

  const getQuestionTypeLabel = (type: string) => {
    const typeMap = {
      'multiple_choice': '객관식',
      'short_answer': '단답형',
      'essay': '서술형'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return {
    ...worksheet,
    formattedDate: formatDate(worksheet.createdAt),
    subjectName: getSubjectName(worksheet.subject),
    questions: worksheet.questions.map((question, index) => ({
      ...question,
      number: index + 1,
      difficultyLabel: getDifficultyLabel(question.difficulty),
      typeLabel: getQuestionTypeLabel(question.type)
    }))
  };
};
