import React from 'react';

import ohbotIcon from './icon.png';
import styles from './ohbridge-warning.css';

const OHBRIDGE_EXTENSION_ID = 'bfjihladgnccpchokgeeicpjcakdmkbe';
const OHBRIDGE_PROBE_URL =
    `chrome-extension://${OHBRIDGE_EXTENSION_ID}/ohbot.obe`;

class OhBridgeWarning extends React.Component {
    constructor (props) {
        super(props);
        this.state = {visible: false, copied: false};
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleCopyExtensionsUrl = this.handleCopyExtensionsUrl.bind(this);
    }

    componentDidMount () {
        this.detect();
    }

    componentWillUnmount () {
        this.unmounted = true;
    }

    async detect () {
        try {
            const response = await fetch(OHBRIDGE_PROBE_URL, {method: 'GET'});
            if (response.ok && !this.unmounted) {
                this.setState({visible: true});
            }
        } catch (e) {
            void e;
        }
    }

    handleDismiss () {
        this.setState({visible: false});
    }

    handleOverlayClick (e) {
        if (e.target === e.currentTarget) this.handleDismiss();
    }

    async handleCopyExtensionsUrl () {
        const url = 'chrome://extensions';
        try {
            await navigator.clipboard.writeText(url);
        } catch (e) {
            void e;
        }
        if (this.unmounted) return;
        this.setState({copied: true});
        window.setTimeout(() => {
            if (!this.unmounted) this.setState({copied: false});
        }, 2000);
    }

    render () {
        if (!this.state.visible) return null;
        return (
            <div
                className={styles.overlay}
                onClick={this.handleOverlayClick}
            >
                <div className={styles.card}>
                    <img
                        src={ohbotIcon}
                        alt="Ohbot"
                        className={styles.logo}
                    />
                    <h2 className={styles.title}>
                        {'Heads up — you can remove the '}
                        <span className={styles.titleAccent}>{'OhBridge'}</span>
                        {' extension!'}
                    </h2>
                    <p className={styles.paragraph}>
                        {'Looks like you still have the '}<strong>{'OhBridge'}</strong>
                        {' Chrome extension installed. You don’t need it '}
                        {'anymore — this app now talks to your Ohbot or Picoh '}
                        {'directly over USB.'}
                    </p>
                    <p className={styles.paragraph}>
                        {'Connect using the button at the top right of the site.'}
                    </p>
                    <p className={styles.paragraph}>
                        {'When you have a moment, head over to '}
                        <button
                            type="button"
                            className={styles.link}
                            title="Copy chrome://extensions and paste it into the address bar"
                            onClick={this.handleCopyExtensionsUrl}
                        >
                            {'chrome://extensions'}
                        </button>
                        {', find '}<strong>{'OhBridge'}</strong>
                        {', and hit Remove.'}
                        {this.state.copied ? (
                            <span className={styles.copiedHint}>
                                {'Copied — paste in address bar'}
                            </span>
                        ) : null}
                    </p>
                    <div className={styles.buttonRow}>
                        <button
                            className={styles.button}
                            onClick={this.handleDismiss}
                        >
                            {'Got it, thanks!'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default OhBridgeWarning;
