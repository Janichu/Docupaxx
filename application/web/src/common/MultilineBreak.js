/**
 * MultilineBreak
 */
export const MultilineBreak = ({ lines }) => {
    const makeBreaks = (numberOfLines) => {
        const breakList = [];
        for (let i = 0; i < numberOfLines; i++) {
            breakList.push(<br></br>)
        }
        return breakList;
    }
    const breaks = makeBreaks(lines)
    return (
        <>
            {breaks}
        </>
    )
}