import React, { useState, useEffect } from 'react';
import './loadingicon.css';

function LoadingAnimation() {
    const [animationPhase, setAnimationPhase] = useState('phase-1-2s'); // 初始状态为第一个阶段

    useEffect(() => {
        let timeoutId = null;

        const intervalId = setInterval(() => {
            setAnimationPhase('phase-3s'); // 设置为第三秒快速图标
            timeoutId = setTimeout(() => {
                setAnimationPhase('phase-1-2s'); // 1秒后（即第3秒结束时）切换回第一阶段
            }, 1000); // 设置超时以在第3秒后切换图标
        }, 2000); // 每2秒切换一次

        return () => {
            clearInterval(intervalId); // 清除定时器
            clearTimeout(timeoutId); // 如果组件卸载，确保没有挂起的超时
        };
    }, []);

    return (
        <div className="backboard">
            <div className="loading-container">
                <div className={`loader-icon ${animationPhase}`}></div>
                <svg className={`eye-icon ${animationPhase}`} width="68" height={animationPhase === 'phase-1-2s' ? '23' : '39'} viewBox="0 0 68 39" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    {/* 根据animationPhase来切换图标 */}
                    {animationPhase === 'phase-1-2s' && (
                        // 图标1


                        <svg className="first" width="68" height="23" viewBox="0 0 68 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M34.5 2.5625C21.3 2.5625 8.33333 9.24409 3 11.6968C9 14.9108 22.9 19.5625 34.5 19.5625C46.1 19.5625 60 14.3187 65.5 11.6968C60.6667 8.65205 47.7 2.5625 34.5 2.5625Z"
                                fill="#FEDC00" stroke="#373236" stroke-width="5" stroke-linejoin="round"/>
                            <circle cx="34.4375" cy="11" r="11" fill="#373236"/>
                        </svg>


                    )}
                    {animationPhase === 'phase-3s' && (
                        // 图标2


                        <svg className="first" width="68" height="23" viewBox="0 0 68 23" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M34.5 2.5625C21.3 2.5625 8.33333 9.24409 3 11.6968C9 14.9108 22.9 19.5625 34.5 19.5625C46.1 19.5625 60 14.3187 65.5 11.6968C60.6667 8.65205 47.7 2.5625 34.5 2.5625Z"
                                fill="#FEDC00" stroke="#373236" stroke-width="5" stroke-linejoin="round"/>
                            <circle cx="34.4375" cy="11" r="11" fill="#373236"/>
                        </svg>
                    )}
                </svg>
                <div className="icontext">Generating image......</div>
            </div>
        </div>
    );
}

export default LoadingAnimation;
