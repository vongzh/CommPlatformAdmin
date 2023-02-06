export class Subscriber {
  constructor(eventName, worker) {
    this.eventName = eventName
    this.worker = worker
  }
}
export class EventBus {
  constructor() {
    this.eventStores = {}
  }
  subscribe(subScriber) {
    if (!subScriber.eventName) {
      return
    }
    const subscribers = this.eventStores[subScriber.eventName] || (this.eventStores[subScriber.eventName] = [])
    subscribers.push(subScriber)
  }
  publish(event, data) {
    const subscribers = this.eventStores[event]
    if (subscribers) {
      subscribers.forEach(callback => callback.worker(data))
    }
  }
}
