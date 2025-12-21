/**
 * Logger utility for debug output
 * Provides consistent logging that can be enabled/disabled
 */

export class Logger {
    private enabled: boolean;

    /**
     * Create a new Logger
     * @param enabled - Whether logging is enabled
     */
    constructor(enabled: boolean = false) {
        this.enabled = enabled;
    }

    /**
     * Log a message (if enabled)
     * @param args - Arguments to log
     */
    log(...args: unknown[]): void {
        if (this.enabled) {
            console.log(...args);
        }
    }

    /**
     * Start a log group
     * @param label - Group label
     */
    group(label: string): void {
        if (this.enabled) {
            console.log(`\n${label}`);
        }
    }

    /**
     * End a log group
     */
    groupEnd(): void {
        if (this.enabled) {
            console.log('');
        }
    }

    /**
     * Log a separator line
     */
    separator(): void {
        if (this.enabled) {
            console.log('\n###############################################\n');
        }
    }

    /**
     * Enable or disable logging
     * @param enabled - Whether logging should be enabled
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Check if logging is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }
}
