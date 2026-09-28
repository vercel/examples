import { eveChannel } from 'eve/channels/eve'
import { authorizeAgent } from '../../lib/project-auth'

export default eveChannel({ auth: authorizeAgent })
