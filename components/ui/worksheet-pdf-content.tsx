'use client';

import React from 'react';
import { Worksheet } from '@/app/types';
import { formatWorksheetForPDF } from '@/lib/pdf-utils';

interface WorksheetPDFContentProps {
  worksheet: Worksheet;
  id: string;
}

export const WorksheetPDFContent: React.FC<WorksheetPDFContentProps> = ({
  worksheet,
  id
}) => {
  const formattedWorksheet = formatWorksheetForPDF(worksheet);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      minHeight: '297mm',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#000000',
      lineHeight: '1.5'
    },
    header: {
      padding: '32px',
      borderBottom: '2px solid #e5e7eb',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px'
    },
    description: {
      fontSize: '18px',
      color: '#6b7280',
      marginBottom: '16px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      fontSize: '14px',
      textAlign: 'left' as const
    },
    infoGridItem: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderBottom: '1px solid #f3f4f6'
    },
    section: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    difficultyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px'
    },
    difficultyItem: {
      textAlign: 'center' as const
    },
    difficultyBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid'
    },
    difficultyText: {
      marginTop: '8px',
      fontSize: '14px',
      color: '#6b7280'
    },
    questionsSection: {
      padding: '24px'
    },
    questionContainer: {
      marginBottom: '32px'
    },
    questionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '16px'
    },
    questionNumber: {
      width: '32px',
      height: '32px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      flexShrink: 0
    },
    questionMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      border: '1px solid #d1d5db'
    },
    questionContent: {
      marginLeft: '48px',
      marginBottom: '16px'
    },
    questionText: {
      fontSize: '16px',
      lineHeight: '1.6',
      fontWeight: '500',
      color: '#111827'
    },
    choicesContainer: {
      marginLeft: '48px',
      marginBottom: '16px'
    },
    choiceItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    choiceCircle: {
      width: '24px',
      height: '24px',
      border: '2px solid #d1d5db',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500'
    },
    answerBox: {
      marginLeft: '48px',
      marginBottom: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      minHeight: '80px'
    },
    answerLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    answerLine: {
      width: '100%',
      height: '32px',
      borderBottom: '1px solid #d1d5db',
      marginTop: '8px'
    },
    tagsContainer: {
      marginLeft: '48px',
      marginBottom: '16px'
    },
    tagsList: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '4px'
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '12px',
      color: '#6b7280',
      border: '1px solid #d1d5db'
    },
    separator: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '24px 0'
    },
    footer: {
      padding: '24px',
      borderTop: '2px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      textAlign: 'center' as const
    },
    footerContent: {
      fontSize: '14px',
      color: '#6b7280'
    },
    footerRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '8px'
    },
    footerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    footerSmall: {
      fontSize: '12px',
      color: '#9ca3af'
    }
  };

  const getDifficultyColors = (difficulty: string) => {
    const colorMap = {
      'low': { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
      'medium': { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
      'high': { bg: '#fed7aa', text: '#c2410c', border: '#fdba74' },
      'highest': { bg: '#fecaca', text: '#dc2626', border: '#fca5a5' }
    };
    return colorMap[difficulty as keyof typeof colorMap] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
  };

  return (
    <div id={id} style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          {formattedWorksheet.title}
        </h1>
        {formattedWorksheet.description && (
          <p style={styles.description}>
            {formattedWorksheet.description}
          </p>
        )}
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <span>📚</span>
            <span>{formattedWorksheet.subjectName}</span>
          </div>
          <div style={styles.infoItem}>
            <span>📅</span>
            <span>{formattedWorksheet.formattedDate}</span>
          </div>
          <div style={styles.infoItem}>
            <span>📝</span>
            <span>총 {formattedWorksheet.totalQuestions}문제</span>
          </div>
        </div>

        {/* 학습지 정보 */}
        <div style={styles.infoGrid}>
          <div>
            <div style={styles.infoGridItem}>
              <span style={{ color: '#6b7280' }}>과목:</span>
              <span style={{ fontWeight: '500' }}>{formattedWorksheet.subjectName}</span>
            </div>
            <div style={styles.infoGridItem}>
              <span style={{ color: '#6b7280' }}>총 문항 수:</span>
              <span style={{ fontWeight: '500' }}>{formattedWorksheet.totalQuestions}문제</span>
            </div>
            <div style={styles.infoGridItem}>
              <span style={{ color: '#6b7280' }}>평균 정답률:</span>
              <span style={{ fontWeight: '500' }}>{formattedWorksheet.averageCorrectRate}%</span>
            </div>
          </div>
          <div>
            <div style={styles.infoGridItem}>
              <span style={{ color: '#6b7280' }}>생성일:</span>
              <span style={{ fontWeight: '500' }}>{formattedWorksheet.formattedDate}</span>
            </div>
            <div style={styles.infoGridItem}>
              <span style={{ color: '#6b7280' }}>태그:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {formattedWorksheet.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.infoGridItem}>
              <span style={{ color: '#6b7280' }}>상태:</span>
              <span 
                style={{ 
                  ...styles.badge,
                  backgroundColor: formattedWorksheet.status === 'published' ? '#dbeafe' : '#f3f4f6',
                  color: formattedWorksheet.status === 'published' ? '#1e40af' : '#6b7280'
                }}
              >
                {formattedWorksheet.status === 'published' ? '게시됨' : '임시저장'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 난이도 분포 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>🎯</span>
          난이도 분포
        </h3>
        <div style={styles.difficultyGrid}>
          {Object.entries(formattedWorksheet.difficultyDistribution).map(([difficulty, count]) => {
            if (count === 0) return null;
            const percentage = (count / formattedWorksheet.totalQuestions) * 100;
            const colors = getDifficultyColors(difficulty);
            
            return (
              <div key={difficulty} style={styles.difficultyItem}>
                <div 
                  style={{
                    ...styles.difficultyBadge,
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border
                  }}
                >
                  {difficulty === 'low' ? '하' : 
                   difficulty === 'medium' ? '중' : 
                   difficulty === 'high' ? '상' : '최상'}
                </div>
                <div style={styles.difficultyText}>
                  {count}문제 ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 문제 목록 */}
      <div style={styles.questionsSection}>
        <h3 style={styles.sectionTitle}>
          <span>📝</span>
          문제
        </h3>
        
        <div>
          {formattedWorksheet.questions.map((question, index) => {
            const difficultyColors = getDifficultyColors(question.difficulty);
            
            return (
              <div key={question.id} style={styles.questionContainer}>
                {/* 문제 헤더 */}
                <div style={styles.questionHeader}>
                  <div style={styles.questionNumber}>
                    {question.number}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.questionMeta}>
                      <span 
                        style={{
                          ...styles.badge,
                          backgroundColor: difficultyColors.bg,
                          color: difficultyColors.text,
                          borderColor: difficultyColors.border
                        }}
                      >
                        {question.difficultyLabel}
                      </span>
                      <span style={styles.badge}>
                        {question.typeLabel}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        정답률 {question.correctRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 문제 내용 */}
                <div style={styles.questionContent}>
                  <p style={styles.questionText}>
                    {question.content}
                  </p>
                </div>

                {/* 객관식 선택지 */}
                {question.type === 'multiple_choice' && question.choices && (
                  <div style={styles.choicesContainer}>
                    <div>
                      {question.choices.map((choice, choiceIndex) => (
                        <div key={choiceIndex} style={styles.choiceItem}>
                          <div style={styles.choiceCircle}>
                            {String.fromCharCode(65 + choiceIndex)}
                          </div>
                          <span style={{ fontSize: '14px' }}>{choice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 단답형/서술형 답안 공간 */}
                {question.type !== 'multiple_choice' && (
                  <div style={styles.answerBox}>
                    <div style={styles.answerLabel}>답안:</div>
                    <div style={styles.answerLine}></div>
                    {question.type === 'essay' && (
                      <>
                        <div style={styles.answerLine}></div>
                        <div style={styles.answerLine}></div>
                      </>
                    )}
                  </div>
                )}

                {/* 문제 태그 */}
                {question.tags.length > 0 && (
                  <div style={styles.tagsContainer}>
                    <div style={styles.tagsList}>
                      {question.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} style={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 구분선 (마지막 문제 제외) */}
                {index < formattedWorksheet.questions.length - 1 && (
                  <div style={styles.separator}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 푸터 */}
      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerRow}>
            <div style={styles.footerItem}>
              <span>⏱️</span>
              <span>예상 소요 시간: {Math.ceil(formattedWorksheet.totalQuestions * 1.5)}분</span>
            </div>
            <div style={styles.footerItem}>
              <span>✅</span>
              <span>총점: {formattedWorksheet.totalQuestions * 10}점</span>
            </div>
          </div>
          <div style={styles.footerSmall}>
            하이캠퍼스 학습지 시스템 | 생성일: {formattedWorksheet.formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetPDFContent;
