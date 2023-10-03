// Utilities to measure the authentication strategies
export const withTimer = (next) => {
  return (req) => {
    req.startTime = new Date().getTime()
    return next(req)
  }
}

export const endTimer = (req) => {
  req.endTime = new Date().getTime()
}

export const timerResult = (req) => {
  return {
    authenticationTime: req.endTime - req.startTime,
  }
}
