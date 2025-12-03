export class NotificationService {
  send(toUser, message) {
    // For the assignment, console.log is enough
    console.log(`[NOTIFY] -> ${toUser.email} (${toUser.role}): ${message}`);
  }
}

