import { Chat } from './chat'
import { FileExplorer } from './file-explorer'
import { Header } from './header'
import { Logs } from './logs'
import { Preview } from './preview'
import { TabItem, TabContent, TabGroup } from '@/components/tabs'
import { Welcome } from '@/components/modals/welcome'
import { cookies } from 'next/headers'
import { hideBanner } from '@/app/actions'

export default async function Page() {
  const store = await cookies()
  const banner = store.get('banner-hidden')?.value !== 'true'
  return (
    <>
      <Welcome defaultOpen={banner} onDismissAction={hideBanner} />
      <div className="flex flex-col h-screen max-h-screen overflow-hidden p-2 space-x-2 space-y-2">
        <Header className="flex items-center w-full" />
        <ul className="flex space-x-5 lg:hidden font-mono text-sm tracking-tight mt-1.5 px-1">
          <TabItem tabId="chat">Chat</TabItem>
          <TabItem tabId="preview">Preview</TabItem>
          <TabItem tabId="file-explorer">File Explorer</TabItem>
          <TabItem tabId="logs">Logs</TabItem>
        </ul>
        <div className="flex-1 flex w-full min-h-0 overflow-hidden lg:space-x-2">
          <TabContent
            className="h-full flex-col lg:flex w-full lg:w-1/2 min-h-0"
            tabId="chat"
          >
            <Chat className="flex-1 overflow-hidden" />
          </TabContent>
          <TabGroup tabId="chat">
            <TabContent className="lg:h-1/3" tabId="preview">
              <Preview className="flex-1 overflow-hidden" />
            </TabContent>
            <TabContent className="lg:h-1/3" tabId="file-explorer">
              <FileExplorer className="flex-1 overflow-hidden" />
            </TabContent>
            <TabContent className="lg:h-1/3" tabId="logs">
              <Logs className="flex-1 overflow-hidden" />
            </TabContent>
          </TabGroup>
        </div>
      </div>
    </>
  )
}
