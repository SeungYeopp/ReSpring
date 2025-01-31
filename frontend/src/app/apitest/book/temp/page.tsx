"use client"

export default function TempPage () {
    const somefunction = () => {
        const str = '1';

        const parsedStoryIds = str
        .split(/[\s,]+/)
        .map((token) => parseInt(token, 10))
        .filter((num) => !isNaN(num))

        console.log(parsedStoryIds);
        return parsedStoryIds;
    }
    return (
        <h1>
            콘솔 확인하세요!
            {somefunction()}
        </h1>
    )
}