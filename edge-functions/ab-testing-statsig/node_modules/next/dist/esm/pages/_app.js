import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import React from 'react';
import { loadGetInitialProps } from '../shared/lib/utils';
function appGetInitialProps(_) {
    return _appGetInitialProps.apply(this, arguments);
}
function _appGetInitialProps() {
    _appGetInitialProps = /**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */ _async_to_generator(function*({ Component , ctx  }) {
        const pageProps = yield loadGetInitialProps(Component, ctx);
        return {
            pageProps
        };
    });
    return _appGetInitialProps.apply(this, arguments);
}
var _Component;
class App extends (_Component = React.Component) {
    render() {
        const { Component , pageProps  } = this.props;
        return /*#__PURE__*/ React.createElement(Component, Object.assign({}, pageProps));
    }
}
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
export { App as default };

//# sourceMappingURL=_app.js.map