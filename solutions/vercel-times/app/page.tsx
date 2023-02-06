import { getNYTimesTopStories, Story as TStory } from './nytimes-api'
import Header from './components/Header'
import CookieBanner from './components/CookieBanner'
import Story from './components/Story'
import Ad from './components/Ad'
import StoryGroup from './components/StoryGroup'
import StoryPhoto from './components/StoryPhoto'
import StoryBody from './components/StoryBody'
import Opinion from './components/Opinion'

export type GroupedStories = {
  type: 'multiple' | 'top-interactive'
  stories?: TStory[]
  story?: TStory
}

export default async function Page() {
  const stories = await getNYTimesTopStories()
  const articles: TStory[] = []
  const opinionStories: TStory[] = []
  let interactiveStory: TStory | null = null

  for (const story of stories.results) {
    if (story.section === 'opinion') {
      opinionStories.push(story)
    } else if (story.item_type === 'Interactive' && !interactiveStory) {
      // The first interactive story that's found will be the top right story
      interactiveStory = story
    }
    // We don't handle stories without multimedia
    else if (story.multimedia) {
      articles.push(story)
    }
  }

  const topArticles = articles.slice(0, 3)
  const otherArticles = articles.slice(3, articles.length - 2)
  const lastArticles = articles.slice(articles.length - 2)

  return (
    <div>
      <CookieBanner />
      <Ad />
      <div className="max-w-7xl mx-auto px-10">
        <Header />
        <main className="">
          <div className="grid grid-cols-3 gap-6 divide-x divide-gray-400">
            <div className="col-span-2">
              <StoryGroup stories={topArticles} />

              {otherArticles.map((story) => (
                <Story key={story.uri} story={story} />
              ))}

              <section className="border-t border-neutral-900 z-20 w-full">
                <nav className="flex flex-row items-center space-x-6 py-4">
                  <div className="font-semibold flex text-sm">
                    World Cup 2022
                  </div>

                  <ul className="flex flex-row flex-1 whitespace-nowrap text-xs space-x-4 font-medium">
                    <li>Knockout Bracket</li>
                    <li>Final Group Standings</li>
                    <li>How to Watch</li>
                    <li>Spot the Ball</li>
                    <li>From The Athletic</li>
                  </ul>
                </nav>
                <div className=" grid grid-cols-3 gap-3 divide-neutral-200 divide-x pt-2">
                  <div className="cols-span-1 space-y-4 divide-neutral-200 divide-y ">
                    <article className="">
                      <h3 className="text-md font-semibold font-serif pb-1.5 pr-4">
                        As the World Focuses on Soccer, a Women’s Team in Exile
                        Aches to Play
                      </h3>
                      <p className="text-sm font-serif pb-2 text-neutral-800">
                        The Afghan women’s national team fled to Australia when
                        the Taliban took over. FIFA, yielding to Afghanistan’s
                        soccer federation, no longer recognizes the team.
                      </p>
                      <div className="flex flex-row items-center">
                        <span className="flex text-xs space-x-4 mr-1 uppercase">
                          7 Min Read
                        </span>
                      </div>
                    </article>
                    <article className="pt-4">
                      <h3 className="text-xs font-semibold font-serif pb-1.5 pr-4">
                        England Cruises Past Senegal to Reach Quarterfinals
                      </h3>
                      <p className="text-sm font-serif pb-2 text-neutral-800">
                        Senegal put up a fight early, but goals by Jordan
                        Henderson, Harry Kane and Bukayo Saka put England
                        through to meet France.
                      </p>
                    </article>
                    <article className="pt-4">
                      <h3 className="text-xs font-semibold font-serif pb-1.5 pr-4">
                        France locked in its spot in the World Cup
                        quarterfinals, defeating Poland 3-1.
                      </h3>
                      <div className="flex flex-row items-center">
                        <span className="flex text-xs space-x-4 mr-1">
                          See more key moments
                        </span>
                        <span className="flex-inline bg-slate-800 px-1.5 text-white rounded-full text-xs">
                          9+
                        </span>
                      </div>
                    </article>
                  </div>
                  <div className="col-span-2">
                    <article className="px-6 pb-6">
                      <div className="flex bg-red-200 mb-2 h-[290px]"></div>
                      <h3 className="text-md font-semibold font-serif py-1.5 pr-4">
                        U.S. Added 261,000 Jobs in October, a Sign of Economy’s
                        Resilience
                      </h3>
                      <p className="text-sm font-serif pb-2 text-neutral-800">
                        Job growth remained stubbornly robust, defying efforts
                        to curb inflation. Wages also increased, and the
                        unemployment rate rose to 3.7 percent. See more updates
                        5+
                      </p>
                      <div className="flex flex-row items-center">
                        <span className="flex text-xs space-x-4 mr-1">
                          See key moments
                        </span>
                        <span className="flex-inline bg-slate-800 px-1.5 text-white rounded-full text-xs">
                          7+
                        </span>
                      </div>
                    </article>
                  </div>
                </div>
              </section>
              <div className="border-t border-neutral-900 z-20 w-full mt-5">
                <nav className="flex flex-row items-center space-x-6 py-4">
                  <div className="text-white font-semibold flex text-sm">
                    <span className="bg-red-400 w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                    <span className="bg-blue-400 w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                    <span className="bg-red-400 w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                    <span className="bg-blue-400 w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <ul className="flex flex-row flex-1 whitespace-nowrap text-xs space-x-4 font-medium">
                    <li>Updates</li>
                    <li>Polls in Key Senate Races</li>
                    <li>House Race in 4 Polls</li>
                    <li>Beginner’s Guide</li>
                    <li>Abortion on the Ballot</li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-span-1 lg:pl-6">
              <div className="border-t border-neutral-900">
                {interactiveStory && (
                  <section className="pt-4 grid gap-2 pb-4">
                    <StoryPhoto story={interactiveStory} caption />
                    <StoryBody
                      story={interactiveStory}
                      variant="right-headline"
                      readTime
                    />
                  </section>
                )}
                <div className="grid grid-cols-6 gap-x-[calc(1rem_*_2_+_1px)] py-4 border-t border-neutral-200">
                  {lastArticles.map((story) => (
                    <section
                      key={story.uri}
                      className="col-span-3 grid gap-2 content-start"
                    >
                      <StoryPhoto story={story} />
                      <StoryBody story={story} variant="secondary" readTime />
                    </section>
                  ))}
                </div>
              </div>
              <section className="border-t border-neutral-900 pt-2">
                <div className="text-sm font-bold mb-4">
                  <span>Opinion</span>
                </div>
                <div className="divide-y divide-slate-200">
                  {opinionStories.map((story) => (
                    <Opinion key={story.uri} story={story} />
                  ))}
                </div>
              </section>
            </div>
          </div>
          <div></div>
        </main>
      </div>
    </div>
  )
}
