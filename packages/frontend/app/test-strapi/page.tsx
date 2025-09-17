'use client';

import { useState, useEffect } from 'react';
import { newsApi } from '@/lib/strapi-client';
import { Button } from '@/components/ui/button';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function TestStrapiPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const updateTestResult = (index: number, updates: Partial<TestResult>) => {
    setTestResults(prev => prev.map((result, i) => 
      i === index ? { ...result, ...updates } : result
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // 测试 1: API 连接测试
    const connectionTestIndex = testResults.length;
    addTestResult({ test: 'API 连接测试', status: 'pending' });

    try {
      const connectionResult = await newsApi.testConnection();
      updateTestResult(connectionTestIndex, {
        status: connectionResult ? 'success' : 'error',
        message: connectionResult ? 'API 连接成功' : 'API 连接失败'
      });

      if (!connectionResult) {
        setIsRunning(false);
        return;
      }
    } catch (error) {
      updateTestResult(connectionTestIndex, {
        status: 'error',
        message: `连接测试失败: ${error instanceof Error ? error.message : '未知错误'}`
      });
      setIsRunning(false);
      return;
    }

    // 测试 2: 获取新闻列表
    const newsListTestIndex = testResults.length;
    addTestResult({ test: '获取新闻列表', status: 'pending' });

    try {
      const newsList = await newsApi.getNewsList(1, 5);
      updateTestResult(newsListTestIndex, {
        status: 'success',
        message: `成功获取 ${newsList.data.length} 条新闻`,
        data: newsList
      });

      // 测试 3: 获取新闻详情
      if (newsList.data.length > 0) {
        const newsDetailTestIndex = testResults.length;
        addTestResult({ test: '获取新闻详情', status: 'pending' });

        try {
          const firstNewsId = newsList.data[0].id;
          const newsDetail = await newsApi.getNewsById(firstNewsId);
          updateTestResult(newsDetailTestIndex, {
            status: 'success',
            message: `成功获取新闻详情: ${newsDetail.title}`,
            data: newsDetail
          });
        } catch (error) {
          updateTestResult(newsDetailTestIndex, {
            status: 'error',
            message: `获取新闻详情失败: ${error instanceof Error ? error.message : '未知错误'}`
          });
        }
      }
    } catch (error) {
      updateTestResult(newsListTestIndex, {
        status: 'error',
        message: `获取新闻列表失败: ${error instanceof Error ? error.message : '未知错误'}`
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Strapi 客户端测试</h1>
        <p className="text-gray-600 mb-6">
          这个页面用于测试 Strapi API 客户端的连接和数据获取功能。
        </p>
        
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="mb-6"
        >
          {isRunning ? '测试进行中...' : '开始测试'}
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">测试结果</h2>
          
          {testResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getStatusIcon(result.status)}</span>
                <h3 className="text-lg font-medium">{result.test}</h3>
                <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              
              {result.message && (
                <p className={`text-sm ${getStatusColor(result.status)} mb-2`}>
                  {result.message}
                </p>
              )}
              
              {result.data && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    查看详细数据
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {testResults.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-12">
          点击"开始测试"按钮来运行 Strapi 客户端测试
        </div>
      )}
    </div>
  );
}
