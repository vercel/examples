import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import { createClient, createConsoleLogger } from 'configcat-js'

type ConfigCatClient = ReturnType<typeof createClient>

const configcatContext = createContext<ConfigCatClient | undefined>(undefined)

export const ConfigcatProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<ConfigCatClient>()

  useEffect(() => {
    // Load the configcat client in the browser
    const configCatClient = createClient(
      process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY!,
      {
        logger:
          process.env.NODE_ENV === 'development'
            ? createConsoleLogger(3)
            : null,
      }
    )
    setClient(configCatClient)
  }, [])

  return (
    <configcatContext.Provider value={client}>
      {children}
    </configcatContext.Provider>
  )
}

export const useConfigcat = () => useContext(configcatContext)

export const useValue = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(false)
  const configcat = useConfigcat()

  useEffect(() => {
    if (configcat) {
      configcat.getValueAsync(key, defaultValue).then((v) => setValue(v))
    }
  }, [configcat, key, defaultValue])

  return value
}
