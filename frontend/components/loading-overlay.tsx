"use client";

import React, { useEffect, useRef,useState } from "react";
import lottie from "lottie-web";
import "./css/loading-overlay.css"; // 确保路径正确

const loadingMessages = [
  "已提交请求...",
  "正在分析用户需求",
  "正在解析有关内容",
];

export function LoadingOverlay() {
  const lottieContainer = useRef(null);
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

  useEffect(() => {
    if (lottieContainer.current) {
      lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/frontend/components/lottie/brainStorming.json", // 替换为你的 Lottie 动画 JSON 文件路径
      });
    }

    return () => {
      if (lottieContainer.current) {
        lottie.destroy();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/loading-background.jpg)' }}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="loader-container" ref={lottieContainer}></div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-white">正在加载，请稍候...</h2>
          <p className="text-lg text-gray-300 mt-2">{loadingMessages[currentMessageIndex]}</p>
        </div>
      </div>
    </div>
  );
}

