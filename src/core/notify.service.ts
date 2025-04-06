/**
 * @fileoverview Notification utilities
 */

namespace NotifyService {
  /**
   * Send an email notification
   * @param recipient - Email recipient
   * @param subject - Email subject
   * @param message - Email body message
   * @returns Success status
   */
  export function SendEmail(actions: ActionService.Action[], recipient: string = Session.getActiveUser().getEmail()): void {
    if (actions.length == 0) return;

    const subject = `Rebalance ${actions.length} actions`;
    // table content
    const tableContent = actions.map(action => [action.Ticker, action.Action, action.Quantity, action.CurrentValue, action.TargetValue, action.CurrentPrice]).join('\n');
    const message = `
    <table>
      <tr>
        <th>Ticker</th>
        <th>Action</th>
        <th>Quantity</th>
        <th>Current Value</th>
        <th>Target Value</th>
        <th>Current Price</th>
      </tr>
      ${tableContent}
    </table>
    `;

    try {
      GmailApp.sendEmail(recipient, subject, message);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
} 