import { useState, useEffect } from 'react';
import localForage from 'localforage';

export function useIndexedDBStorage(key, initialValue) {
    const [state, setState] = useState(initialValue);

    // 从 IndexedDB 读取数据
    useEffect(() => {
        localForage.getItem(key).then(storedValue => {
            if (storedValue !== null) {
                setState(storedValue);
            }
        });
    }, [key]);

    // 监听 state 变化并更新 IndexedDB
    useEffect(() => {
        localForage.setItem(key, state);

        // 添加清理函数，监听浏览器关闭事件
        const handleUnload = () => {
            localForage.removeItem(key);
        };

        // 添加事件监听器
        window.addEventListener('unload', handleUnload);

        // 返回一个清理函数，用于在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, [key, state]);

    return [state, setState];
}
