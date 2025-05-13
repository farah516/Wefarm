import { makeAutoObservable } from "mobx";

class NotificationStore {
  userNotifications = [];

  constructor() {
    makeAutoObservable(this);
  }

  addNotification = (notification, userId, userRole) => {
    if (
      notification.userId === Number(userId) &&
      notification.userRole === userRole
    ) {
      this.userNotifications.push(notification);
    }
  };

  removeNotification = (id) => {
    this.userNotifications = this.userNotifications.filter(
      (notification) => notification.id !== id
    );
  };

  setUserNotifications = (notifications) => {
    this.userNotifications = notifications;
  };
}

const notificationStore = new NotificationStore();
export default notificationStore;
