import { makeAutoObservable } from "mobx";

class SubscriptionStore {
  AllSubscription = [];
  UserSubscription = [];

  constructor() {
    makeAutoObservable(this);
  }

  addSubscription = (subscription,id) => {
    this.AllSubscription.push(subscription);
    if(subscription.userId === Number(id)) {
      this.UserSubscription.push(subscription);
    }
  };

  removeSubscription = (id) => {
    this.AllSubscription = this.AllSubscription.filter(subscription => subscription.id !== id);
    this.UserSubscription = this.UserSubscription.filter(subscription => subscription.id !== id);
  };

  getSubscriptions(subscriptions) {
    this.AllSubscription = subscriptions;
  }

  getUserSubscriptions(subscriptions) {
    this.UserSubscription = subscriptions;
  }

  editSubscription = (id, updatedSubscription) => {
    const index = this.AllSubscription.findIndex(subscription => subscription.id === id);
    if (index !== -1) {
      this.AllSubscription[index] = { ...this.AllSubscription[index], ...updatedSubscription };
    }
    const index2 = this.UserSubscription.findIndex(subscription => subscription.id === id );
    if (index2 !== -1) {
      this.UserSubscription[index2] = { ...this.UserSubscription[index2], ...updatedSubscription };
    }
  };

}

const subscriptionStore = new SubscriptionStore();
export default subscriptionStore;
