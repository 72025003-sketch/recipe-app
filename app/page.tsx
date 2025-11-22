'use client';

import { useState } from 'react';
import callMyApi from './actions';
import ReactMarkdown from 'react-markdown';

export default function Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  // ボタンが押されたときの処理
  const handleClick = async () => {
    if (!input) return;

    setLoading(true);
    setResult(null); // 前の結果をクリア

    try {
      // ここでサーバーアクション（裏方の関数）を呼び出します
      const data = await callMyApi(input);

      if (data.success) {
        setResult(data.message);
        setTimestamp(data.timestamp);
      } else {
        setResult(data.message || '予期せぬエラーが発生しました');
      }
    } catch (e) {
      setResult("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '10px',
        color: '#333'
      }}>
        🍳 レシピ生成アプリ
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '30px',
        fontSize: '1.1rem'
      }}>
        冷蔵庫にある食材を入力すると、Gemini AIが「元気が出る丼もの」のレシピを提案します！
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '600',
          color: '#444'
        }}>
          食材を入力してください（カンマ区切り）
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例: 卵、ネギ、豚肉、ご飯"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '1rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <button
        onClick={handleClick}
        disabled={loading || !input}
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'white',
          backgroundColor: loading || !input ? '#ccc' : '#4CAF50',
          border: 'none',
          borderRadius: '8px',
          cursor: loading || !input ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s, transform 0.1s',
        }}
        onMouseEnter={(e) => {
          if (!loading && input) {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && input) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {loading ? '🤖 生成中...' : '🍳 レシピを生成'}
      </button>

      {result && (
        <div style={{
          marginTop: '30px',
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '16px',
            color: '#333',
            borderBottom: '2px solid #4CAF50',
            paddingBottom: '8px'
          }}>
            📋 生成されたレシピ
          </h2>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.8rem', marginTop: '1rem', marginBottom: '0.5rem', color: '#333' }} {...props} />,
              h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.5rem', marginTop: '1rem', marginBottom: '0.5rem', color: '#444' }} {...props} />,
              h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.2rem', marginTop: '0.8rem', marginBottom: '0.4rem', color: '#555' }} {...props} />,
              p: ({ node, ...props }) => <p style={{ marginBottom: '0.8rem', lineHeight: '1.6' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ marginLeft: '1.5rem', marginBottom: '0.8rem' }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ marginLeft: '1.5rem', marginBottom: '0.8rem' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: '0.3rem' }} {...props} />,
              strong: ({ node, ...props }) => <strong style={{ color: '#4CAF50', fontWeight: '700' }} {...props} />,
              em: ({ node, ...props }) => <em style={{ fontStyle: 'italic', color: '#666' }} {...props} />,
              code: ({ node, ...props }) => <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace' }} {...props} />,
            }}
          >
            {result}
          </ReactMarkdown>
          {timestamp && (
            <p style={{
              marginTop: '16px',
              fontSize: '0.85rem',
              color: '#999',
              textAlign: 'right'
            }}>
              生成日時: {new Date(timestamp).toLocaleString('ja-JP')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}