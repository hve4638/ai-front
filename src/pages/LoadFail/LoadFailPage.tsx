

export function LoadFailPage({failReason, failReasonDetail}) {
    return (
        <div
            id="load-fail-page"
            className="column"
            style={{
                margin: '32px'
            }}
        >
            <h2>Error</h2>
            <div
                className="textfield column scrollbar"
                style={{
                    padding: "16px",
                    overflow : "auto",
                }}
            >
                <div className="reason">{failReason}</div>
                <hr></hr>
                <pre className="detail">
                    {failReasonDetail}

                </pre>
            </div>
        </div>
    )
}