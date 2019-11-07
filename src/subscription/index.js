import {PubSub} from 'apollo-server'
import * as MESSAGE_EVENTS from './message'

// add to subscription/index.js to export CREATED event
export const EVENTS = {
    MESSAGE: MESSAGE_EVENTS,
}
export default new PubSub();