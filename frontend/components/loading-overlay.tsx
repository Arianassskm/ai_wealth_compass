"use client";

import React, { useEffect, useState } from "react";
import "./css/loading-overlay.css"; // 确保路径正确

const loadingMessages = [
  "请求正在跑向服务器...",
  "正在头脑风暴中...",
  "内容疯狂展示中...",
];

export function LoadingOverlay() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2000); // 每2秒切换一次消息

      return () => clearInterval(interval); // 组件卸载时清除定时器
    }
  }, [isAnimating]);

  useEffect(() => {
    if (currentMessageIndex === loadingMessages.length - 1) {
      setIsAnimating(false);
    }
  }, [currentMessageIndex]);

  return (
    <div className="fixed inset-0">
      <div className="loading-background"></div>
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src="/images/brain-storming.gif" // 替换为你的 GIF 文件路径
          alt="Loading"
          className="loader-container"
        />
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-white">正在加载，请稍候...</h2>
          <p className="text-lg text-gray-300 mt-2">{loadingMessages[currentMessageIndex]}</p>
        </div>
      </div>
    </div>
  );
}

