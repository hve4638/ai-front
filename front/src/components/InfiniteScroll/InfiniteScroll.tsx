import classNames from 'classnames';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import styles from './styles.module.scss';
import useLazyThrottle from '@/hooks/useLazyThrottle';
import useThrottle from '@/hooks/useThrottle';

type InfiniteScrollProps = {
    className?: string;
    style?: React.CSSProperties;

    hasMore?: boolean;
    children?: React.ReactNode;

    loadMore: () => void;
}

function InfiniteScroll({
    className,
    style,
    hasMore = true,
    loadMore,
    children,
}: InfiniteScrollProps) {
    const { ref, inView } = useInView({
        rootMargin: '150px 0px',
        threshold: 0,
    });
    const sentinelKey = useMemo(() => Math.random(), [children]);
    const loadMoreThrottle = useThrottle(()=>{
        loadMore();
    }, 100);
    

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreThrottle();
        }
    });

    return (
        <div
            // key={sentinelKey}
            className={className}
            style={style}
            // ref={ref}
        >
            <div ref={ref}/>
            {children}
        </div>
    )
}

export default InfiniteScroll;