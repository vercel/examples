import React from 'react';
/**
 * Handles errors through `getDerivedStateFromError`.
 * Renders the provided error component and provides a way to `reset` the error boundary state.
 */ class ErrorBoundaryHandler extends React.Component {
    static getDerivedStateFromError(error) {
        return {
            error
        };
    }
    render() {
        if (this.state.error) {
            return /*#__PURE__*/ React.createElement(React.Fragment, null, this.props.errorStyles, /*#__PURE__*/ React.createElement(this.props.errorComponent, {
                error: this.state.error,
                reset: this.reset
            }));
        }
        return this.props.children;
    }
    constructor(props){
        super(props);
        this.reset = ()=>{
            this.setState({
                error: null
            });
        };
        this.state = {
            error: null
        };
    }
}
/**
 * Renders error boundary with the provided "errorComponent" property as the fallback.
 * If no "errorComponent" property is provided it renders the children without an error boundary.
 */ export function ErrorBoundary({ errorComponent , errorStyles , children  }) {
    if (errorComponent) {
        return /*#__PURE__*/ React.createElement(ErrorBoundaryHandler, {
            errorComponent: errorComponent,
            errorStyles: errorStyles
        }, children);
    }
    return /*#__PURE__*/ React.createElement(React.Fragment, null, children);
}
const styles = {
    error: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        display: 'inline-block',
        textAlign: 'left',
        lineHeight: '49px',
        height: '49px',
        verticalAlign: 'middle'
    },
    text: {
        fontSize: '14px',
        fontWeight: 'normal',
        lineHeight: '49px',
        margin: 0,
        padding: 0
    }
};
export function GlobalErrorComponent({ error  }) {
    return /*#__PURE__*/ React.createElement("html", null, /*#__PURE__*/ React.createElement("head", null), /*#__PURE__*/ React.createElement("body", null, /*#__PURE__*/ React.createElement("div", {
        style: styles.error
    }, /*#__PURE__*/ React.createElement("div", {
        style: styles.desc
    }, /*#__PURE__*/ React.createElement("h2", {
        style: styles.text
    }, "Application error: a client-side exception has occurred (see the browser console for more information)."), (error == null ? void 0 : error.digest) && /*#__PURE__*/ React.createElement("p", {
        style: styles.text
    }, `Digest: ${error.digest}`)))));
}

//# sourceMappingURL=error-boundary.js.map