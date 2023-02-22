import sendmail from 'sendmail'

export const send = (email: string, message: string) => {
  return new Promise((resolve, reject) => {
    sendmail(
      {
        from: 'notifications@vercel.app',
        to: email,
        subject: '🚀 Your Daily Dose of Top Hacker News Posts',
        html: message,
      },
      (err, reply) => {
        console.log(err && err.stack)
        console.dir(reply)
      }
    )
  })
}
