import { OCRResult, DetectedQuestion, QuestionType } from '@/app/types';

// OCR 서비스 설정
interface OCRConfig {
  apiKey?: string;
  endpoint?: string;
  provider: 'google' | 'azure' | 'aws' | 'mock';
}

// Google Vision API 응답 타입
interface GoogleVisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
    }>;
    fullTextAnnotation?: {
      text: string;
    };
  }>;
}

// OCR 처리 클래스
export class OCRProcessor {
  private config: OCRConfig;

  constructor(config: OCRConfig = { provider: 'mock' }) {
    this.config = config;
  }

  /**
   * 이미지 파일에서 텍스트를 추출합니다
   */
  async extractText(file: File): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      let extractedText = '';
      let confidence = 0;
      let detectedQuestions: DetectedQuestion[] = [];

      switch (this.config.provider) {
        case 'google':
          const googleResult = await this.processWithGoogleVision(file);
          extractedText = googleResult.text;
          confidence = googleResult.confidence;
          detectedQuestions = googleResult.questions;
          break;
        
        case 'azure':
          // Azure Computer Vision 구현
          const azureResult = await this.processWithAzure(file);
          extractedText = azureResult.text;
          confidence = azureResult.confidence;
          detectedQuestions = azureResult.questions;
          break;
        
        case 'aws':
          // AWS Textract 구현
          const awsResult = await this.processWithAWS(file);
          extractedText = awsResult.text;
          confidence = awsResult.confidence;
          detectedQuestions = awsResult.questions;
          break;
        
        default:
          // Mock 구현 (개발/테스트용)
          const mockResult = await this.processWithMock(file);
          extractedText = mockResult.text;
          confidence = mockResult.confidence;
          detectedQuestions = mockResult.questions;
          break;
      }

      const processingTime = Math.round((Date.now() - startTime) / 1000);

      return {
        id: this.generateId(),
        contentId: '', // 실제 구현에서는 콘텐츠 ID를 받아야 함
        status: 'completed',
        confidence,
        extractedText,
        processedAt: new Date().toISOString(),
        processingTime,
        detectedQuestions
      };

    } catch (error) {
      const processingTime = Math.round((Date.now() - startTime) / 1000);
      
      return {
        id: this.generateId(),
        contentId: '',
        status: 'failed',
        confidence: 0,
        extractedText: '',
        processedAt: new Date().toISOString(),
        processingTime,
        detectedQuestions: [],
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  }

  /**
   * Google Vision API를 사용한 OCR 처리
   */
  private async processWithGoogleVision(file: File): Promise<{
    text: string;
    confidence: number;
    questions: DetectedQuestion[];
  }> {
    if (!this.config.apiKey) {
      throw new Error('Google Vision API 키가 설정되지 않았습니다.');
    }

    // 파일을 base64로 변환
    const base64 = await this.fileToBase64(file);
    
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64
          },
          features: [
            { type: 'TEXT_DETECTION' },
            { type: 'DOCUMENT_TEXT_DETECTION' }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Google Vision API 오류: ${response.statusText}`);
    }

    const data: GoogleVisionResponse = await response.json();
    const result = data.responses[0];
    
    if (!result.fullTextAnnotation) {
      throw new Error('텍스트를 찾을 수 없습니다.');
    }

    const extractedText = result.fullTextAnnotation.text;
    const questions = this.parseQuestionsFromText(extractedText, result.textAnnotations || []);
    
    return {
      text: extractedText,
      confidence: 85, // Google Vision은 일반적으로 높은 정확도
      questions
    };
  }

  /**
   * Azure Computer Vision을 사용한 OCR 처리
   */
  private async processWithAzure(file: File): Promise<{
    text: string;
    confidence: number;
    questions: DetectedQuestion[];
  }> {
    // Azure Computer Vision API 구현
    // 실제 구현에서는 Azure SDK를 사용하거나 REST API 호출
    throw new Error('Azure OCR은 아직 구현되지 않았습니다.');
  }

  /**
   * AWS Textract를 사용한 OCR 처리
   */
  private async processWithAWS(file: File): Promise<{
    text: string;
    confidence: number;
    questions: DetectedQuestion[];
  }> {
    // AWS Textract API 구현
    // 실제 구현에서는 AWS SDK를 사용
    throw new Error('AWS OCR은 아직 구현되지 않았습니다.');
  }

  /**
   * Mock OCR 처리 (개발/테스트용)
   */
  private async processWithMock(file: File): Promise<{
    text: string;
    confidence: number;
    questions: DetectedQuestion[];
  }> {
    // 파일 처리 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockText = `1. 다음 중 소수가 아닌 것은?
① 2  ② 3  ③ 4  ④ 5

2. 12와 18의 최대공약수를 구하시오.

3. 다음 식을 계산하시오.
   (2x + 3)(x - 1) = ?

4. 일차함수 y = 2x + 3에서 x = 5일 때 y의 값은?
① 10  ② 11  ③ 12  ④ 13

5. 다음 그래프가 나타내는 함수의 식을 구하시오.`;

    const questions: DetectedQuestion[] = [
      {
        id: 'q1',
        questionNumber: 1,
        content: '다음 중 소수가 아닌 것은?',
        type: 'multiple_choice',
        choices: ['2', '3', '4', '5'],
        boundingBox: { x: 50, y: 100, width: 400, height: 60 },
        confidence: 92
      },
      {
        id: 'q2',
        questionNumber: 2,
        content: '12와 18의 최대공약수를 구하시오.',
        type: 'short_answer',
        boundingBox: { x: 50, y: 180, width: 350, height: 40 },
        confidence: 88
      },
      {
        id: 'q3',
        questionNumber: 3,
        content: '다음 식을 계산하시오. (2x + 3)(x - 1) = ?',
        type: 'short_answer',
        boundingBox: { x: 50, y: 240, width: 380, height: 50 },
        confidence: 90
      },
      {
        id: 'q4',
        questionNumber: 4,
        content: '일차함수 y = 2x + 3에서 x = 5일 때 y의 값은?',
        type: 'multiple_choice',
        choices: ['10', '11', '12', '13'],
        boundingBox: { x: 50, y: 310, width: 420, height: 60 },
        confidence: 94
      },
      {
        id: 'q5',
        questionNumber: 5,
        content: '다음 그래프가 나타내는 함수의 식을 구하시오.',
        type: 'essay',
        boundingBox: { x: 50, y: 390, width: 400, height: 40 },
        confidence: 85
      }
    ];

    return {
      text: mockText,
      confidence: 89,
      questions
    };
  }

  /**
   * 추출된 텍스트에서 문항을 파싱합니다
   */
  private parseQuestionsFromText(text: string, annotations: any[]): DetectedQuestion[] {
    const questions: DetectedQuestion[] = [];
    const lines = text.split('\n');
    
    let currentQuestion: Partial<DetectedQuestion> | null = null;
    let questionNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 문항 번호 패턴 감지 (1., 2., 3. 등)
      const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
      if (questionMatch) {
        // 이전 문항이 있으면 저장
        if (currentQuestion && currentQuestion.content) {
          questions.push({
            id: `q${questionNumber - 1}`,
            questionNumber: questionNumber - 1,
            content: currentQuestion.content,
            type: currentQuestion.type || 'short_answer',
            choices: currentQuestion.choices,
            boundingBox: currentQuestion.boundingBox || { x: 0, y: 0, width: 0, height: 0 },
            confidence: 85
          });
        }

        // 새 문항 시작
        currentQuestion = {
          questionNumber: parseInt(questionMatch[1]),
          content: questionMatch[2],
          type: 'short_answer',
          choices: []
        };
        questionNumber = parseInt(questionMatch[1]) + 1;
      }
      // 선택지 패턴 감지 (①, ②, ③, ④ 또는 1), 2), 3), 4))
      else if (line.match(/^[①②③④⑤]|^[1-5]\)/)) {
        if (currentQuestion) {
          currentQuestion.type = 'multiple_choice';
          if (!currentQuestion.choices) currentQuestion.choices = [];
          currentQuestion.choices.push(line.replace(/^[①②③④⑤]|^[1-5]\)\s*/, ''));
        }
      }
      // 기존 문항에 내용 추가
      else if (currentQuestion && line.length > 0) {
        currentQuestion.content += ' ' + line;
      }
    }

    // 마지막 문항 저장
    if (currentQuestion && currentQuestion.content) {
      questions.push({
        id: `q${questionNumber - 1}`,
        questionNumber: questionNumber - 1,
        content: currentQuestion.content,
        type: currentQuestion.type || 'short_answer',
        choices: currentQuestion.choices,
        boundingBox: currentQuestion.boundingBox || { x: 0, y: 0, width: 0, height: 0 },
        confidence: 85
      });
    }

    return questions;
  }

  /**
   * 파일을 Base64로 변환합니다
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/jpeg;base64, 부분 제거
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 고유 ID 생성
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * 이미지 전처리 유틸리티
 */
export class ImagePreprocessor {
  /**
   * 이미지 품질을 개선합니다
   */
  static async enhanceImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        if (!ctx) {
          reject(new Error('Canvas context를 생성할 수 없습니다.'));
          return;
        }

        // 캔버스 크기 설정
        canvas.width = img.width;
        canvas.height = img.height;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0);

        // 대비 및 밝기 조정
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // 대비 증가 (1.2배)
          data[i] = Math.min(255, data[i] * 1.2);     // R
          data[i + 1] = Math.min(255, data[i + 1] * 1.2); // G
          data[i + 2] = Math.min(255, data[i + 2] * 1.2); // B
        }

        ctx.putImageData(imageData, 0, 0);

        // 결과를 Blob으로 변환
        canvas.toBlob((blob) => {
          if (blob) {
            const enhancedFile = new File([blob], file.name, { type: file.type });
            resolve(enhancedFile);
          } else {
            reject(new Error('이미지 처리에 실패했습니다.'));
          }
        }, file.type);
      };

      img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 이미지를 그레이스케일로 변환합니다
   */
  static async convertToGrayscale(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        if (!ctx) {
          reject(new Error('Canvas context를 생성할 수 없습니다.'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const grayscaleFile = new File([blob], file.name, { type: file.type });
            resolve(grayscaleFile);
          } else {
            reject(new Error('그레이스케일 변환에 실패했습니다.'));
          }
        }, file.type);
      };

      img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
      img.src = URL.createObjectURL(file);
    });
  }
}

/**
 * OCR 처리를 위한 편의 함수들
 */
export const ocrUtils = {
  /**
   * 기본 OCR 처리기 인스턴스 생성
   */
  createProcessor: (config?: Partial<OCRConfig>) => {
    return new OCRProcessor({
      provider: 'mock', // 기본값은 mock
      ...config
    });
  },

  /**
   * 파일 타입이 OCR 처리 가능한지 확인
   */
  isSupportedFileType: (file: File): boolean => {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf'
    ];
    return supportedTypes.includes(file.type);
  },

  /**
   * 파일 크기가 적절한지 확인
   */
  isValidFileSize: (file: File, maxSizeMB: number = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
};
