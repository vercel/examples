const loading = 'animate-[blink_1s_ease_0s_infinite_normal_both]'
const dot = `rounded-full h-2 w-2 mx-0.5 bg-current ${loading}`

export const LoadingDots = () => (
  <span className="inline-flex text-center items-center leading-7">
    <span className={dot} key="dot_1'" />
    <span className={dot} style={{ animationDelay: '0.2s' }} key="dot_2" />
    <span className={dot} style={{ animationDelay: '0.2s' }} key="dot_3" />
  </span>
)
