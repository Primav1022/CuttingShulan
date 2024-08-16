import { useState, useEffect } from 'react';
import localForage from 'localforage';

export function useIndexedDBStorage(key, initialValue) {
    const [state, setState] = useState(initialValue);

    // �� IndexedDB ��ȡ����
    useEffect(() => {
        localForage.getItem(key).then(storedValue => {
            if (storedValue !== null) {
                setState(storedValue);
            }
        });
    }, [key]);

    // ���� state �仯������ IndexedDB
    useEffect(() => {
        localForage.setItem(key, state);

        // ���������������������ر��¼�
        const handleUnload = () => {
            localForage.removeItem(key);
        };

        // ����¼�������
        window.addEventListener('unload', handleUnload);

        // ����һ�������������������ж��ʱ�Ƴ��¼�������
        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, [key, state]);

    return [state, setState];
}
