import React, {
  ReactNode,
  useState,
  useEffect,
  createContext,
  useContext,
} from 'react'
import {
  Breakpoint,
  breakpoints,
  BreakpointServer,
} from '../../config/breakpoints'
import { useDebounce } from '../use-debounce/use-debounce'

const defaultValue = {}
const BreakpointContext = createContext(defaultValue)

const getBreakpoint = (window: Window): Breakpoint => {
  if (window.matchMedia(`(min-width: ${breakpoints.xl})`).matches) {
    return Breakpoint.xl
  }
  if (window.matchMedia(`(min-width: ${breakpoints.lg})`).matches) {
    return Breakpoint.lg
  }
  if (window.matchMedia(`(min-width: ${breakpoints.md})`).matches) {
    return Breakpoint.md
  }
  if (window.matchMedia(`(min-width: ${breakpoints.sm})`).matches) {
    return Breakpoint.sm
  }
  if (window.matchMedia(`(min-width: 0em)`).matches) {
    return Breakpoint.xs
  }

  // can not match with any matchMedia (that would be a problem)
  return Breakpoint.xl
}

type BreakpointProviderProps = {
  children: ReactNode
  // on the server-side Request we use the user agent to create a best educated guess for its Viewport
  // using user agent and library which will only be one of these three possible Viewports
  initialBreakpoint: BreakpointServer
}

const BreakpointProvider = ({
  children,
  initialBreakpoint,
}: BreakpointProviderProps) => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(
    initialBreakpoint || Breakpoint.lg
  )
  const breakpointDebounced = useDebounce(breakpoint, 200)

  useEffect(() => {
    // initial state
    const currentBreakpoint = getBreakpoint(window)
    setBreakpoint(currentBreakpoint)

    const calcInnerWidth = () => {
      const newViewport = getBreakpoint(window)
      setBreakpoint(newViewport)
    }

    // add event listener
    window.addEventListener('resize', calcInnerWidth)

    // remove event listener
    return () => {
      window.removeEventListener('resize', calcInnerWidth)
    }
    // if we add viewport the whole setup of setting the event listener only once is gone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BreakpointContext.Provider
      value={!breakpointDebounced ? breakpoint : breakpointDebounced}
    >
      {children}
    </BreakpointContext.Provider>
  )
}

function useBreakpoint() {
  const context = useContext(BreakpointContext)
  if (context === defaultValue) {
    throw new Error('useBreakpoint is not used within a BreakpointProvider')
  }
  return context
}

export {
  /** can be used on any component level to get the latest Viewport */
  useBreakpoint,
  /** should only be set at application level */
  BreakpointProvider,
  /** to ease the usage when using the hook  */
  Breakpoint,
  /** never consume this directly, only exported for our mocked provider, see our mocks! */
  BreakpointContext,
}
