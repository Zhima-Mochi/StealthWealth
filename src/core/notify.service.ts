/**
 * @fileoverview Notification utilities
 */

namespace NotifyService {
  /**
   * Send an email notification
   * @param recipient - Email recipient (default is current user)
   * @param actions - List of actions to notify
   */
  export function SendEmail(actions: ActionService.Action[], recipient: string = Session.getActiveUser().getEmail()): void {
    if (actions.length === 0) return;

    const subject = `Rebalance ${actions.length} actions`;

    const rows = actions.map(action => `
      <tr>
        <td>${action.Ticker}</td>
        <td>${action.Action}</td>
        <td>${action.Currency}</td>
        <td>${action.Quantity}</td>
        <td>${action.CurrentValue}</td>
        <td>${action.TargetValue}</td>
        <td>${action.CurrentPrice}</td>
      </tr>
    `).join('');

    const message = `
      <html>
        <body>
          <p>Here are the rebalance actions:</p>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr>
              <th>Ticker</th>
              <th>Action</th>
              <th>Currency</th>
              <th>Quantity</th>
              <th>Current Value</th>
              <th>Target Value</th>
              <th>Current Price</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `;

    try {
      GmailApp.sendEmail(recipient, subject, '', { htmlBody: message });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}
