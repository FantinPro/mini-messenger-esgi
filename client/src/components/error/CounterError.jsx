import React, { useEffect, useState } from 'react';


export default function CounterError() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (count === 5) {
            throw new Error('Cannot reach 5');
        }
    }, [count]);

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>I will throw an error when I reach 5. ({count})</button>
        </div>
    );
}