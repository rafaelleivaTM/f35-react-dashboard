// Use Notifications API to show alert messages
const notificationsService = {
  show: (message) => {
    if (Notification.permission === 'granted') {
      new Notification(message, { icon: '/favicon/f35-plane.png' });
    }
  },
  showCritical: (tittle, message) => {
    if (Notification.permission === 'granted') {
      new Notification(tittle, { body: message, icon: '/favicon/f35-plane.png' });
    }
  },
};

export default notificationsService;

/** Usage example:
 * when isCritical is true, the notification is shown as a desktop notification
 // dispatch(
 //       addNotification({
 //         id: faker.datatype.uuid(),
 //         title: `Order AAAA is missing between BP and F35`,
 //         description: 'The order is in BP in F35 status, but not in F35 tables',
 //         avatar: null,
 //         type: 'order_critical',
 //         createdAt: new Date().toISOString(),
 //         isUnRead: true,
 //         isCritical: true,
 //       })
 //     );
 * */
